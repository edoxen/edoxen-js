#!/usr/bin/env node
// edoxen-build — YAML → JSON pipeline.
//
// Reads edoxen YAML dirs/files, validates against the canonical
// schemas, and emits JSON the UI packages can fetch at runtime.
//
// Usage:
//   edoxen-build --config edoxen.config.ts
//   edoxen-build path/to/decisions/ path/to/meetings/
//   edoxen-build --output ./public/data path/to/decisions/

import fs from 'node:fs'
import path from 'node:path'

async function loadConfig(configPath: string): Promise<EdoxenBuildConfig> {
  const abs = path.resolve(configPath)
  if (!fs.existsSync(abs)) {
    console.error(`Config not found: ${abs}`)
    process.exit(1)
  }
  const mod = await import(abs)
  if (!mod.default) {
    console.error(`Config ${abs} has no default export`)
    process.exit(1)
  }
  return mod.default as EdoxenBuildConfig
}

interface EdoxenBuildConfig {
  decisionsDirs?: string[]
  meetingsDirs?: string[]
  seriesDirs?: string[]
  outputDir: string
}

function printUsage(): never {
  console.error(`Usage:
  edoxen-build --config <path>          load config from a TS/JS module
  edoxen-build <dir> [<dir>...]         positional dirs (decisions/meetings/series)
  edoxen-build --output <dir> <dir>...  explicit output + inputs

Config module shape (default export):
  export default {
    decisionsDirs: ['./resolutions'],
    meetingsDirs: ['./meetings'],
    seriesDirs: ['./series'],
    outputDir: './public/data',
  }
`)
  process.exit(2)
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length === 0) printUsage()

  let config: EdoxenBuildConfig | null = null
  const positional: string[] = []
  let explicitOutput: string | null = null

  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--config') {
      config = await loadConfig(args[++i])
    } else if (a === '--output') {
      explicitOutput = args[++i]
    } else if (a === '--help' || a === '-h') {
      printUsage()
    } else {
      positional.push(a)
    }
  }

  if (!config) {
    if (positional.length === 0) printUsage()
    config = { outputDir: explicitOutput ?? './public/data' }
    for (const dir of positional) {
      const basename = path.basename(dir).toLowerCase()
      if (basename.includes('resolution') || basename.includes('decision')) {
        config.decisionsDirs = [...(config.decisionsDirs ?? []), dir]
      } else if (basename.includes('meeting') && !basename.includes('series')) {
        config.meetingsDirs = [...(config.meetingsDirs ?? []), dir]
      } else if (basename.includes('series')) {
        config.seriesDirs = [...(config.seriesDirs ?? []), dir]
      } else {
        config.decisionsDirs = [...(config.decisionsDirs ?? []), dir]
      }
    }
  } else if (explicitOutput) {
    config.outputDir = explicitOutput
  }

  const { loadDecisions, loadMeetings, loadMeetingSeries } = await import('../src/index.js')
  fs.mkdirSync(config.outputDir, { recursive: true })

  if (config.decisionsDirs) {
    for (const dir of config.decisionsDirs) {
      if (!fs.existsSync(dir)) continue
      const { metadata, decisions } = await loadDecisions(dir)
      const out = path.join(config.outputDir, 'decisions.json')
      fs.writeFileSync(out, JSON.stringify({ metadata, decisions }))
      console.log(`edoxen-build: ${decisions.length} decisions → ${out}`)
    }
  }

  if (config.meetingsDirs) {
    for (const dir of config.meetingsDirs) {
      if (!fs.existsSync(dir)) continue
      const { meetings, series } = await loadMeetings(dir)
      const out = path.join(config.outputDir, 'meetings.json')
      fs.writeFileSync(out, JSON.stringify({ meetings, series: series ?? [] }))
      console.log(`edoxen-build: ${meetings.length} meetings → ${out}`)
    }
  }

  if (config.seriesDirs) {
    for (const dir of config.seriesDirs) {
      if (!fs.existsSync(dir)) continue
      const all = []
      for (const file of fs.readdirSync(dir).filter((f) => /\.ya?ml$/i.test(f)).sort()) {
        const s = await loadMeetingSeries(path.join(dir, file))
        if (s) all.push(s)
      }
      const out = path.join(config.outputDir, 'series.json')
      fs.writeFileSync(out, JSON.stringify(all))
      console.log(`edoxen-build: ${all.length} series → ${out}`)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
