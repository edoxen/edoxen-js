// Transforms — turn parsed Decision/Meeting YAML into flat records
// ready for UI consumption.
//
// Lifted from tc154 / tc184sc4 / OIML `scripts/lib/transforms.mjs`
// (3 verbatim copies; this is the canonical version).

const PUA_BULLET_REPLACEMENTS: ReadonlyArray<[RegExp, string]> = [
  [//g, '•'],
  [//g, '‣'],
  [//g, '▸'],
  [//g, ' '],
]

export function normalizeSnippet(rawMessage: unknown): string {
  if (!rawMessage || typeof rawMessage !== 'string') return ''
  let snippet = rawMessage
  for (const [pattern, replacement] of PUA_BULLET_REPLACEMENTS) {
    snippet = snippet.replace(pattern, replacement)
  }
  snippet = snippet.replace(/\n+/g, ' ').replace(/ {2,}/g, ' ').trim()
  if (snippet.length > 200) {
    snippet = snippet.slice(0, 197) + '...'
  }
  return snippet
}

export function isAcclamation(identifier: unknown): boolean {
  return typeof identifier === 'string' && identifier.includes('-acclaim-')
}

export function deriveDisplayTitle(
  res: { title?: string | null; actions?: unknown[] },
  acclamation: boolean,
): string {
  if (res.title) return res.title
  if (acclamation && Array.isArray(res.actions) && res.actions.length > 0) return 'Acclamation'
  return ''
}

export interface SortableDecision {
  identifier: string
  year: string
}

export function sortDecisions<T extends SortableDecision>(a: T, b: T): number {
  // Year descending, then identifier ascending within the year.
  if (a.year !== b.year) return a.year < b.year ? 1 : -1
  return a.identifier < b.identifier ? -1 : a.identifier > b.identifier ? 1 : 0
}

export interface StructuredIdentifier {
  prefix?: string | null
  number?: string | null
}

export function identifierToDisplay(ids: StructuredIdentifier | StructuredIdentifier[]): string {
  const arr = Array.isArray(ids) ? ids : [ids]
  return arr
    .map((i) => {
      const num = i.number || ''
      return i.prefix ? `${i.prefix}/${num}` : num
    })
    .join(' / ')
}

export { buildDecisionRecord, buildMeetingRecord } from './records.js'
