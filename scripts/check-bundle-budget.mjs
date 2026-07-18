#!/usr/bin/env node
// Bundle-size budget check.
//
// Run: pnpm check:budget
//
// Fails (exit 1) if any built artifact exceeds its declared budget.
// Budget is gzip size in KB.

import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PKG_DIST = path.resolve(__dirname, '../packages/edoxen/dist')

// Chunk hashes drift on every build — match by prefix, never by
// exact hashed filename, or the check silently stops applying.
const BUDGETS = [
  { file: 'index.js', maxKb: 25 },
  { match: /^edoxen-.+\.js$/, maxKb: 10 },
  { match: /^meeting-.+\.js$/, maxKb: 10 },
  { match: /^flexsearch-.+\.js$/, maxKb: 2 },
]

if (!fs.existsSync(PKG_DIST)) {
  console.error(`Missing dist/ at ${PKG_DIST}. Run 'pnpm -F edoxen build' first.`)
  process.exit(2)
}

const distFiles = fs.readdirSync(PKG_DIST)
const targets = BUDGETS.flatMap((b) => {
  if (b.file) return [{ name: b.file, maxKb: b.maxKb }]
  const hits = distFiles.filter((f) => b.match.test(f))
  if (hits.length === 0) {
    console.warn(`  ? ${b.match} — no matching chunk built (will check next time)`)
  }
  return hits.map((name) => ({ name, maxKb: b.maxKb }))
})

let failed = false
console.log('bundle size budget check:')
for (const { name, maxKb } of targets) {
  const fullPath = path.join(PKG_DIST, name)
  const raw = fs.readFileSync(fullPath)
  const gz = zlib.gzipSync(raw)
  const sizeKb = gz.length / 1024
  const pct = ((sizeKb / maxKb) * 100).toFixed(0)
  const status = sizeKb <= maxKb ? '✓' : '✗'
  console.log(`  ${status} ${name}: ${sizeKb.toFixed(2)} KB / ${maxKb} KB (${pct}%)`)
  if (sizeKb > maxKb) failed = true
}

if (failed) {
  console.error('\nbundle size budget exceeded')
  process.exit(1)
}
console.log('\nall within budget')
