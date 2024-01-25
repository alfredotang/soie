import type { ExecutorContext } from '@nx/devkit'
import { joinPathFragments, readJsonFile, writeJsonFile } from '@nx/devkit'
import { existsSync } from 'node:fs'
import { copyFile } from 'node:fs/promises'

import { build } from 'tsup'

interface TsupExecutorOptions {
  projectRoot: string
  outputPath: string
  tsConfig: string
  main: string
}

function writeExportInfo(path: string) {
  const pkg = readJsonFile(path)
  const moduleExportInfo = {
    types: './index.d.ts',
    main: './index.cjs.js',
    module: './index.esm.js',
    exports: {
      '.': {
        require: './index.cjs.js',
        import: './index.esm.js',
        types: './index.d.ts',
      },
    },
  }

  writeJsonFile(path, {
    ...pkg,
    ...moduleExportInfo,
  })
}

export default async function tsupExecutor(
  {
    projectRoot,
    outputPath,
    tsConfig: tsConfigPath,
    main,
  }: TsupExecutorOptions,
  { root }: ExecutorContext
) {
  const outDir = joinPathFragments(root, outputPath)
  const tsconfig = joinPathFragments(root, projectRoot, tsConfigPath)
  const entry = [joinPathFragments(root, projectRoot, main)]
  const pkgPath = joinPathFragments(root, projectRoot, 'package.json')

  try {
    await build({
      entry,
      splitting: false,
      sourcemap: true,
      minify: true,
      clean: true,
      format: ['cjs', 'esm'],
      treeshake: true,
      dts: true,
      outDir,
      tsconfig,
      outExtension(ctx) {
        return {
          js: `.${ctx.format}.js`,
        }
      },
      async onSuccess() {
        writeExportInfo(pkgPath)
        const actions = ['README.md', 'package.json']
          .map(file => ({
            file,
            path: joinPathFragments(root, projectRoot, file),
          }))
          .filter(({ path }) => existsSync(path))
          .map(({ file, path }) => {
            return copyFile(path, joinPathFragments(outDir, file))
          })

        await Promise.all([
          ...actions,
          copyFile(
            joinPathFragments(root, 'license'),
            joinPathFragments(outDir, 'license')
          ),
        ])
      },
    })
    return { success: true }
  } catch (error) {
    console.error(error)
  }
}
