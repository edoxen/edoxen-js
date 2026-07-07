#!/usr/bin/env node
// edoxen-build — YAML → JSON pipeline.
//
// Reads edoxen YAML dirs/files, validates against the canonical
// schemas, and emits JSON the UI packages can fetch at runtime.
//
// Run: edoxen-build --config edoxen.config.ts
//
// TODO 09 fills out the full implementation. v0.1 ships a minimal
// version that loads + emits; validation lands with TODO 08.

import fs from 'node:fs'
import path from 'node:path'
import { loadDecisions, loadMeetings } from '../src/index.js'

async function main() {
  const args = process.argv.slice(2)
  const configIdx = args.indexOf('--config')
  const configPath = configIdx >= 0 ? args[configIdx + 1] : null

  let config = {
    decisionsDirs: ['../resolutions' as const],
    meetingsDirs: ['../meetings' as const],
    outputDir: './public/data',
  }

  if (configPath && fs.existsSync(configPath)) {
    const mod = await import(path.resolve(configPath))
    config = { ...config, ...mod.default }
  }

  fs.mkdirSync(config.outputDir, { recursive: true })

  for (const dir of config.decisionsDirs) {
    if (!fs.existsSync(dir)) continue
    const { metadata, decisions } = await loadDecisions(dir)
    const out = path.join(config.outputDir, 'decisions.json')
    fs.writeFileSync(out, JSON.stringify({ metadata, decisions }, null, 2))
    console.log(`edoxen-build: emitted ${decisions.length} decisions → ${out}`)
  }

  for (const dir of config.meetingsDirs) {
    if (!fs.existsSync(dir)) continue
    const { meetings, series } = await loadMeetings(dir)
    const out = path.join(config.outputDir, 'meetings.json')
    fs.writeFileSync(out, JSON.stringify({ meetings, series: series ?? [] }, null, 2))
    console.log(`edoxen-build: emitted ${meetings.length} meetings → ${out}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
