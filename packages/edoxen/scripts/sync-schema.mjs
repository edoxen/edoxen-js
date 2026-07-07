// Sync the gem's canonical schemas into packages/edoxen/src/schema/.
//
// Mirrors the gem's schema_model_canonical_sync_spec.rb invariant:
// the gem's schema/edoxen.yaml and schema/meeting.yaml are the SSOT;
// this script copies them verbatim (as JSON) so the JS package can
// generate types and validate fixtures at runtime.
//
// Run: pnpm sync:schema
//
// CI catches drift via the schema-sync spec (see TODO 11).

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const GEM_SCHEMA_DIR = path.resolve(__dirname, '../../../../edoxen/schema')
const PKG_SCHEMA_DIR = path.resolve(__dirname, '../src/schema')

const FILES = ['edoxen.yaml', 'meeting.yaml']

if (!fs.existsSync(GEM_SCHEMA_DIR)) {
  console.error(`Gem schema dir not found at ${GEM_SCHEMA_DIR}. Clone edoxen/edoxen as a sibling.`)
  process.exit(1)
}

fs.mkdirSync(PKG_SCHEMA_DIR, { recursive: true })

for (const file of FILES) {
  const src = path.join(GEM_SCHEMA_DIR, file)
  const dst = path.join(PKG_SCHEMA_DIR, file.replace(/\.yaml$/, '.json'))
  const parsed = yaml.load(fs.readFileSync(src, 'utf8'))
  fs.writeFileSync(dst, JSON.stringify(parsed, null, 2) + '\n')
  console.log(`synced ${path.relative(process.cwd(), src)} → ${path.relative(process.cwd(), dst)}`)
}
