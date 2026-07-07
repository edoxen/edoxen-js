// Record builders — turn parsed Decision/Meeting YAML into the flat
// record shape the UI components expect. Lifted from tc184sc4 +
// OIML's `scripts/lib/transforms.mjs::buildResolutionRecord` and
// tc154's `scripts/lib/transforms.mjs`.

import { isAcclamation, normalizeSnippet, identifierToDisplay } from './index.js'

export interface DecisionRecord {
  id: string
  identifier: string
  doi: string
  urn: string
  year: string
  venue: string
  city: string
  source_file: string
  meeting_urn: string
  meeting_date: string
  is_acclamation: boolean
  title: string
  subject: string
  snippet: string
  actions: unknown[]
  considerations: unknown[]
  approvals: unknown[]
  dates: unknown[]
  categories: string[]
  urls: unknown[]
  localizations?: unknown[]
  raw: unknown
}

export interface DecisionMetadataLike {
  dates?: Array<{ date?: string; start?: string; type?: string }>
  date?: string
  venue?: string
  general_area?: string
  city?: string
}

function firstDate(meta: DecisionMetadataLike): string {
  if (Array.isArray(meta.dates) && meta.dates.length > 0) {
    return meta.dates[0].date || meta.dates[0].start || ''
  }
  return meta.date || ''
}

export function buildDecisionRecord(
  res: Record<string, unknown>,
  sourceFile: string,
  metadata: DecisionMetadataLike,
): DecisionRecord {
  const ids = (res.identifier as StructuredIdentifierLike) ?? []
  const identifier = identifierToDisplay(
    Array.isArray(ids) ? ids : [ids],
  )
  const id = identifier.replace(/\//g, '-')
  const acclamation = isAcclamation(identifier)

  const meetingDate = firstDate(metadata)
  const year = meetingDate ? meetingDate.slice(0, 4) : ''

  const title = (res.title as string | undefined) ?? (acclamation && Array.isArray(res.actions) && res.actions.length > 0 ? 'Acclamation' : '')
  const subject = (res.subject as string | undefined) ?? ''
  const message = (res.message as string | undefined) ?? ''
  const snippet = normalizeSnippet(message || subject)

  return {
    id,
    identifier,
    doi: (res.doi as string | undefined) ?? '',
    urn: (res.urn as string | undefined) ?? '',
    year,
    venue: metadata.venue || metadata.general_area || '',
    city: metadata.city || '',
    source_file: sourceFile,
    meeting_urn: '',
    meeting_date: meetingDate,
    is_acclamation: acclamation,
    title,
    subject,
    snippet,
    actions: Array.isArray(res.actions) ? res.actions : [],
    considerations: Array.isArray(res.considerations) ? res.considerations : [],
    approvals: Array.isArray(res.approvals) ? res.approvals : [],
    dates: Array.isArray(res.dates) ? res.dates : [],
    categories: Array.isArray(res.categories) ? (res.categories as string[]) : [],
    urls: Array.isArray(res.urls) ? res.urls : [],
    localizations: Array.isArray(res.localizations) ? res.localizations : undefined,
    raw: res,
  }
}

interface StructuredIdentifierLike {
  prefix?: string
  number?: string
}

export interface MeetingRecord {
  urn: string
  slug: string
  title: string
  ordinal: number | null
  type: string
  status: string
  bodyType: string | null
  startDate: string
  endDate: string
  committee: string
  venues: unknown[]
  hosts: unknown[]
  officers: unknown[]
  components: unknown[]
  raw: unknown
}

function slugFromUrn(urn: string): string {
  const m = urn.match(/:meeting:([-\w]+)$/)
  return m ? m[1] : ''
}

export function buildMeetingRecord(
  meeting: Record<string, unknown>,
  opts: { bodyTypeFromCommittee?: (committee: string) => string } = {},
): MeetingRecord {
  const urn = (meeting.urn as string | undefined) ?? ''
  return {
    urn,
    slug: slugFromUrn(urn),
    title: (meeting.title as string | undefined) ?? '',
    ordinal: typeof meeting.ordinal === 'number' ? meeting.ordinal : null,
    type: (meeting.type as string | undefined) ?? '',
    status: (meeting.status as string | undefined) ?? '',
    bodyType: opts.bodyTypeFromCommittee
      ? opts.bodyTypeFromCommittee((meeting.committee as string | undefined) ?? '')
      : null,
    startDate: (meeting.date_range as { start?: string } | undefined)?.start ?? '',
    endDate: (meeting.date_range as { end?: string } | undefined)?.end ?? '',
    committee: (meeting.committee as string | undefined) ?? '',
    venues: Array.isArray(meeting.venues) ? meeting.venues : [],
    hosts: Array.isArray(meeting.hosts) ? meeting.hosts : [],
    officers: Array.isArray(meeting.officers) ? meeting.officers : [],
    components: Array.isArray(meeting.components) ? meeting.components : [],
    raw: meeting,
  }
}
