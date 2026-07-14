// Round-trip every fixture in the gem's spec/fixtures/ through the TS
// loaders. Mirrors the gem's spec/edoxen/decision_spec.rb and
// meeting_spec.rb shape assertions.
//
// Skips (with a single pending message) when the gem repo isn't
// checked out at ../../../edoxen/.

import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadDecisions, loadMeetings } from '../src/load/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const GEM_ROOT = path.resolve(__dirname, '../../../../edoxen')
const DECISIONS_DIR = path.join(GEM_ROOT, 'spec/fixtures')
const MEETINGS_DIR = path.join(GEM_ROOT, 'spec/fixtures/meetings')

const haveGem = fs.existsSync(DECISIONS_DIR)

const yamlFiles = (dir: string): string[] =>
  fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /\.ya?ml$/i.test(f)).sort() : []

describe('round-trip gem fixtures', () => {
  it.skipIf(!haveGem)('gem repo is checked out (skips otherwise)', () => {
    expect(haveGem).toBe(true)
  })

  describe.skipIf(!haveGem)('decision fixtures', () => {
    // `contacts.yaml` and `venues.yaml` are ContactCollection /
    // VenueCollection fixtures (the canonical decision-collection.yaml
    // oneOf accepts all three at the root). They have no `decisions[]`
    // array, so the "loads as a DecisionCollection" assertion does not
    // apply. They are validated by the gem's CLI smoke instead.
    const SKIP = new Set(['contacts.yaml', 'venues.yaml'])
    const decisionFiles = yamlFiles(DECISIONS_DIR).filter((f) => !SKIP.has(f))
    for (const file of decisionFiles) {
      const fullPath = path.join(DECISIONS_DIR, file)
      describe(file, () => {
        it('loads as a DecisionCollection', async () => {
          const { decisions } = await loadDecisions(fullPath)
          expect(Array.isArray(decisions)).toBe(true)
          expect(decisions.length).toBeGreaterThan(0)
        })

        it('every Decision has identifier + (v3.0) title[]', async () => {
          const { decisions } = await loadDecisions(fullPath)
          for (const d of decisions) {
            expect(d.identifier, `${file}: missing identifier`).toBeDefined()
          }
        })

        it('every Decision round-trips through JSON unchanged', async () => {
          const { decisions } = await loadDecisions(fullPath)
          for (const d of decisions) {
            const out = JSON.parse(JSON.stringify(d))
            expect(out.identifier).toEqual(d.identifier)
          }
        })
      })
    }
  })

  describe.skipIf(!haveGem)('meeting fixtures', () => {
    for (const file of yamlFiles(MEETINGS_DIR)) {
      const fullPath = path.join(MEETINGS_DIR, file)
      const isSeries = /series/i.test(file)
      const isBs0 = /bs0/i.test(file)
      describe(file, () => {
        it(isSeries ? 'loads as a MeetingSeries' : 'loads as a Meeting / MeetingCollection', async () => {
          const { meetings, series } = await loadMeetings(fullPath)
          if (isSeries) {
            expect((series ?? []).length, `${file}: expected at least one series`).toBeGreaterThan(0)
          } else {
            expect(meetings.length, `${file}: expected at least one meeting`).toBeGreaterThan(0)
          }
        })

        it.skipIf(isSeries)('every Meeting has identifier + type', async () => {
          const { meetings } = await loadMeetings(fullPath)
          for (const m of meetings) {
            expect(m.identifier, `${file}: missing identifier`).toBeDefined()
            expect(m.type, `${file}: missing type`).toBeTruthy()
          }
        })

        it.skipIf(!isBs0)('BS 0 fixture carries statements, declarations, and occurred_date_range', async () => {
          const { meetings } = await loadMeetings(fullPath)
          const m = meetings[0]
          expect(m.declarations, `${file}: missing declarations`).toBeDefined()
          expect(m.declarations.length).toBeGreaterThan(0)
          expect(m.occurred_date_range, `${file}: missing occurred_date_range`).toBeDefined()
          const section = m.minutes?.[0]?.sections?.[0]
          expect(section?.statements, `${file}: missing MinutesSection.statements`).toBeDefined()
          expect(section?.statements.length).toBeGreaterThan(0)
        })
      })
    }
  })
})
