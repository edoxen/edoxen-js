#!/usr/bin/env node
// Schema-sync + type-gen drift check.
//
// Run: pnpm check:schema-sync
//
// Re-runs sync:schema and gen:types; fails if any generated file
// changes. Catches contributors who forget to regen after bumping
// the gem's canonical schemas.

import { execSync } from 'node:child_process'

function run(cmd) {
  try {
    execSync(cmd, { stdio: 'inherit' })
  } catch {
    console.error(`command failed: ${cmd}`)
    process.exit(1)
  }
}

console.log('re-syncing schema from gem...')
run('pnpm -F edoxen sync:schema')

console.log('re-generating types...')
run('pnpm -F edoxen gen:types')

console.log('checking for drift...')
try {
  execSync('git diff --exit-code packages/edoxen/src/schema/ packages/edoxen/src/types/generated/', { stdio: 'inherit' })
  console.log('schemas + types up to date')
} catch {
  console.error('\nSCHEMA OR TYPE DRIFT DETECTED')
  console.error('Run: pnpm -F edoxen sync:schema && pnpm -F edoxen gen:types')
  console.error('Then commit the regenerated files.')
  process.exit(1)
}
