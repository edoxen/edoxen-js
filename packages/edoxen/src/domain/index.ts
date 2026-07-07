// View-model layer — pure functions that turn raw Decision / Meeting
// records into the shapes the UI components render and filter on.
//
// Lifted (generified) from tc154's src/domain/resolutionPresentation.ts.
// These helpers are framework-agnostic: both Astro components and
// Vue composables call into them.

import type { Decision } from '../types/generated/edoxen.js'
import type { Meeting } from '../types/generated/meeting.js'
import { isAcclamation, normalizeSnippet, identifierToDisplay } from '../transforms/index.js'

// --- Decision / Resolution view-models --------------------------------

export interface DecisionViewModel {
  id: string
  identifier: string
  urn: string
  doi: string
  year: string
  title: string
  subject: string
  snippet: string
  isAcclamation: boolean
  actions: Decision['actions']
  considerations: Decision['considerations']
  approvals: Decision['approvals']
}

export function presentDecision(decision: Decision): DecisionViewModel {
  const identifier = identifierToDisplay(decision.identifier)
  const id = identifier.replace(/\//g, '-')
  const acclamation = isAcclamation(identifier)
  const localization = Array.isArray(decision.localizations) ? decision.localizations[0] : null
  const title = (localization?.title as string | undefined) ??
    (acclamation && decision.actions && decision.actions.length > 0 ? 'Acclamation' : '')
  const subject = (localization?.subject as string | undefined) ?? ''
  const message = (localization?.message as string | undefined) ?? subject
  return {
    id,
    identifier,
    urn: decision.urn ?? '',
    doi: decision.doi ?? '',
    year: firstYear(decision),
    title,
    subject,
    snippet: normalizeSnippet(message),
    isAcclamation: acclamation,
    actions: decision.actions ?? [],
    considerations: decision.considerations ?? [],
    approvals: decision.approvals ?? [],
  }
}

function firstYear(decision: Decision): string {
  const dates = decision.dates ?? []
  for (const d of dates) {
    const v = (d as { date?: string | { start?: string } }).date
    if (typeof v === 'string' && v) return v.slice(0, 4)
  }
  return ''
}

// Distinct action.type values on a single Decision, stable order.
export function uniqueActionTypes(decision: DecisionViewModel): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const a of decision.actions) {
    const t = (a as { type?: string }).type
    if (t && !seen.has(t)) {
      seen.add(t)
      out.push(t)
    }
  }
  return out
}

export interface ActionTypeFacets {
  all: string[]
  top: string[]
}

export function actionTypeFacets(decisions: DecisionViewModel[], topN = 8): ActionTypeFacets {
  const counts = new Map<string, number>()
  for (const d of decisions) {
    for (const t of uniqueActionTypes(d)) {
      counts.set(t, (counts.get(t) ?? 0) + 1)
    }
  }
  const all = Array.from(counts.keys()).sort()
  const top = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, topN)
    .map(([k]) => k)
  return { all, top }
}

// Year facets: distinct years present, descending.
export function yearFacets(decisions: DecisionViewModel[]): string[] {
  const set = new Set<string>()
  for (const d of decisions) if (d.year) set.add(d.year)
  return Array.from(set).sort((a, b) => b.localeCompare(a))
}

export function yearRange(decisions: DecisionViewModel[]): { earliest: string; latest: string } {
  if (!decisions.length) return { earliest: '', latest: '' }
  const years: number[] = []
  for (const d of decisions) {
    const y = parseInt(d.year, 10)
    if (!Number.isNaN(y)) years.push(y)
  }
  if (!years.length) return { earliest: '', latest: '' }
  return { earliest: String(Math.min(...years)), latest: String(Math.max(...years)) }
}

export type DecisionSortOrder = 'newest' | 'oldest' | 'most_actions'

export function compareDecisions(
  order: DecisionSortOrder,
): (a: DecisionViewModel, b: DecisionViewModel) => number {
  if (order === 'oldest') {
    return (a, b) => a.year.localeCompare(b.year) || a.id.localeCompare(b.id)
  }
  if (order === 'most_actions') {
    return (a, b) => b.actions.length - a.actions.length || b.year.localeCompare(a.year)
  }
  return (a, b) => b.year.localeCompare(a.year) || b.id.localeCompare(a.id)
}

// --- Meeting view-model ------------------------------------------------

export interface MeetingViewModel {
  urn: string
  slug: string
  title: string
  ordinal: number | null
  type: string
  status: string
  year: number | null
  start: string
  end: string
  venue: string
  committee: string
}

export function presentMeeting(meeting: Meeting, opts: { title?: string } = {}): MeetingViewModel {
  const urn = meeting.urn ?? ''
  const slug = urn.match(/:meeting:([-\w]+)$/)?.[1] ?? ''
  const dr = (meeting.date_range ?? {}) as { start?: string; end?: string }
  const year = dr.start ? parseInt(dr.start.slice(0, 4), 10) : null
  const venues = (meeting.venues ?? []) as Array<{ name?: string }>
  const venue = venues[0]?.name ?? ''
  return {
    urn,
    slug,
    title: opts.title ?? (year ? `Plenary ${year}` : 'Meeting'),
    ordinal: typeof meeting.ordinal === 'number' ? meeting.ordinal : null,
    type: meeting.type ?? '',
    status: meeting.status ?? '',
    year,
    start: dr.start ?? '',
    end: dr.end ?? '',
    venue,
    committee: meeting.committee ?? '',
  }
}
