#!/usr/bin/env node
// Schema-sync + type-gen drift check.
//
// Run: pnpm check:schema-sync
//
// Re-runs sync:schema and gen:types; fails if any generated file
// changes. Catches contributors who forget to regen after bumping
// the gem's canonical schemas.
//
// Skips gracefully when the gem repo isn't present (e.g. on CI runners
// that only check out edoxen-js). Set EDOXEN_GEM_DIR to point at a
// non-default gem path.

import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const GEM_DIR = process.env.EDOXEN_GEM_DIR
  ? resolve(process.env.EDOXEN_GEM_DIR)
  : resolve(new URL('../edoxen/', import.meta.url).pathname)

if (!existsSync(GEM_DIR)) {
  console.warn(`Gem repo not found at ${GEM_DIR} — skipping schema-sync check.`)
  console.warn('Run this locally with the gem checked out as a sibling repo.')
  process.exit(0)
}

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

