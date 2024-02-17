/**
 * This is a minimal script to publish your package to "npm".
 * This is meant to be used as-is or customize as you see fit.
 *
 * This script is executed on "dist/path/to/library" as "cwd" by default.
 *
 * You might need to authenticate with NPM before running this script.
 */

import {
  joinPathFragments,
  readCachedProjectGraph,
  readJsonFile,
  workspaceRoot,
  writeJsonFile,
} from '@nx/devkit'
import { execSync } from 'node:child_process'

import consola from 'consola'
import semver from 'semver'

function invariant(condition, message) {
  if (!condition) {
    consola.error(message)
    process.exit(1)
  }
}

// Executing publish script: node path/to/publish.mjs {name} --version {version} --tag {tag}
// Default "tag" to "next" so we won't publish the "latest" tag by accident.
const [, , name, version, tag = 'latest'] = process.argv
const graph = readCachedProjectGraph()
const project = graph.nodes[name]

invariant(
  project,
  `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`
)

const pkg = readJsonFile(
  joinPathFragments(workspaceRoot, project.data.root, 'package.json')
)

invariant(
  semver.valid(version),
  `No version provided or version did not match Semantic Versioning, expected: #.#.#-tag.# or #.#.#, got ${version}.`
)

invariant(
  semver.gt(version, pkg.version),
  `version should be greater than ${pkg.version}`
)

writeJsonFile(
  joinPathFragments(workspaceRoot, project.data.root, 'package.json'),
  {
    ...pkg,
    version,
  }
)

const outputPath = project.data?.targets?.build?.options?.outputPath
invariant(
  outputPath,
  `Could not find "build.options.outputPath" of project "${name}". Is project.json configured  correctly?`
)

writeJsonFile(joinPathFragments(workspaceRoot, outputPath, 'package.json'), {
  ...pkg,
  version,
})

execSync(`git add ./${project.data.root}`)
execSync(`git commit -m "release: ${name}@${version}"`)
execSync('git push')

process.chdir(outputPath)

// Execute "npm publish" to publish
execSync(`npm publish --access public --tag ${tag}`)
