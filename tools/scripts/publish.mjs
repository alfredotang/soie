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
} from '@nx/devkit'
import { execSync } from 'node:child_process'

function invariant(condition, message) {
  if (!condition) {
    console.error(message)
    process.exit(1)
  }
}

console.log(process.env.HELLO)

// Executing publish script: node path/to/publish.mjs {name} --version {version} --tag {tag}
// Default "tag" to "next" so we won't publish the "latest" tag by accident.
const [, , name] = process.argv
const tag = 'next'
const graph = readCachedProjectGraph()
const project = graph.nodes[name]

invariant(
  project,
  `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`
)

const { version } = readJsonFile(
  joinPathFragments(workspaceRoot, project.data.root, 'package.json')
)

// A simple SemVer validation to validate the version
const validVersion = /^\d+\.\d+\.\d+(-\w+\.\d+)?/
invariant(
  version && validVersion.test(version),
  `No version provided or version did not match Semantic Versioning, expected: #.#.#-tag.# or #.#.#, got ${version}.`
)

const outputPath = project.data?.targets?.build?.options?.outputPath
invariant(
  outputPath,
  `Could not find "build.options.outputPath" of project "${name}". Is project.json configured  correctly?`
)

process.chdir(outputPath)

// Execute "npm publish" to publish
execSync(`npm publish --access public --tag ${tag}`)
