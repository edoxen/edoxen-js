// Generate TypeScript types from the bundled JSON Schemas.
//
// Run: pnpm gen:types
//
// Sources:
//   src/schema/edoxen.json  → src/types/generated/edoxen.ts
//   src/schema/meeting.json → src/types/generated/meeting.ts
//
// json-schema-to-typescript emits one interface per $def. The output
// is committed (so consumers can read it) but treated as build
// artefact: never hand-edit; regenerate after schema sync.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { compileFromFile } from 'json-schema-to-typescript'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SCHEMA_DIR = path.resolve(__dirname, '../src/schema')
const TYPES_DIR = path.resolve(__dirname, '../src/types/generated')

fs.mkdirSync(TYPES_DIR, { recursive: true })

const SOURCES = [
  { schema: 'edoxen.json', out: 'edoxen.ts' },
  { schema: 'meeting.json', out: 'meeting.ts' },
]

for (const { schema, out } of SOURCES) {
  const schemaPath = path.join(SCHEMA_DIR, schema)
  const outPath = path.join(TYPES_DIR, out)
  const compiled = await compileFromFile(schemaPath, {
    bannerComment: '// AUTO-GENERATED from src/schema/*.json. Do not edit by hand.',
    style: { singleQuote: true, semi: false },
    additionalProperties: false,
  })
  fs.writeFileSync(outPath, compiled)
  console.log(`generated ${path.relative(process.cwd(), outPath)}`)
}
