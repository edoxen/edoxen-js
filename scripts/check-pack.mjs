#!/usr/bin/env node
// npm pack smoke test.
//
// Run: pnpm check:pack
//
// Packs each package, inspects the tarball, asserts only expected
// files are shipped. Catches "I forgot to add it to .npmignore" bugs
// before they reach npm.

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

const PACKAGES = [
  {
    name: 'edoxen',
    dir: 'packages/edoxen',
    allowPrefixes: ['package/dist/', 'package/cli/', 'package/src/schema/', 'package/package.json', 'package/README.md', 'package/LICENSE'],
    denyGlobs: ['package/src/**/*.ts', 'package/tests/**', 'package/node_modules/**'],
  },
  {
    name: '@edoxen/vue',
    dir: 'packages/edoxen-vue',
    allowPrefixes: ['package/dist/', 'package/package.json', 'package/README.md', 'package/LICENSE'],
    denyGlobs: ['package/src/**', 'package/tests/**', 'package/node_modules/**'],
  },
]

let failed = false

for (const pkg of PACKAGES) {
  console.log(`\npacking ${pkg.name}...`)
  const abs = path.resolve(ROOT, pkg.dir)
  execSync('pnpm pack', { cwd: abs, stdio: 'inherit' })

  const tarballs = fs.readdirSync(abs).filter((f) => f.endsWith('.tgz'))
  if (tarballs.length !== 1) {
    console.error(`expected 1 tarball, found ${tarballs.length}`)
    failed = true
    continue
  }

  const tarball = path.join(abs, tarballs[0])
  const listing = execSync(`tar tzf ${tarball}`).toString().split('\n').filter(Boolean)

  const denied = []
  for (const entry of listing) {
    const allowed = pkg.allowPrefixes.some((p) => entry === p || entry.startsWith(p))
    if (!allowed) denied.push(entry)
  }
  if (denied.length) {
    console.error(`  ✗ unexpected files in ${tarball}:`)
    for (const f of denied) console.error(`      ${f}`)
    failed = true
  } else {
    console.log(`  ✓ ${tarball} ships only expected files (${listing.length} entries)`)
  }

  // Cleanup
  fs.unlinkSync(tarball)
}

if (failed) {
  console.error('\nnpm pack smoke test FAILED')
  process.exit(1)
}
console.log('\nall tarballs clean')
