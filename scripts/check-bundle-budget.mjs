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

const BUDGETS = [
  { file: 'index.js', maxKb: 25 },
  { file: 'edoxen-Ch_1Fxq0.js', maxKb: 10 },
  { file: 'meeting-CZ7-CmHm.js', maxKb: 10 },
  { file: 'flexsearch-CKLS7Zld.js', maxKb: 2 },
]

if (!fs.existsSync(PKG_DIST)) {
  console.error(`Missing dist/ at ${PKG_DIST}. Run 'pnpm -F edoxen build' first.`)
  process.exit(2)
}

let failed = false
console.log('bundle size budget check:')
for (const { file, maxKb } of BUDGETS) {
  const fullPath = path.join(PKG_DIST, file)
  if (!fs.existsSync(fullPath)) {
    console.warn(`  ? ${file} — not built (will check next time)`)
    continue
  }
  const raw = fs.readFileSync(fullPath)
  const gz = zlib.gzipSync(raw)
  const sizeKb = gz.length / 1024
  const pct = ((sizeKb / maxKb) * 100).toFixed(0)
  const status = sizeKb <= maxKb ? '✓' : '✗'
  console.log(`  ${status} ${file}: ${sizeKb.toFixed(2)} KB / ${maxKb} KB (${pct}%)`)
  if (sizeKb > maxKb) failed = true
}

if (failed) {
  console.error('\nbundle size budget exceeded')
  process.exit(1)
}
console.log('\nall within budget')
