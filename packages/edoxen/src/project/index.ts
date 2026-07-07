// EdoxenProject — unified join of committee + decisions + meetings.
//
// Sites today juggle three fetches (decisions, meetings, committee)
// and re-derive joins per view. This value object captures the
// project graph once and offers O(1) lookups via memoised indexes.

import type { Decision } from '../types/generated/edoxen.js'
import type { Meeting, MeetingSeries } from '../types/generated/meeting.js'
import type { Urn } from '../urn/index.js'

export interface EdoxenProject {
  readonly committee: MeetingSeries | null
  readonly decisions: readonly Decision[]
  readonly meetings: readonly Meeting[]

  decisionsByMeeting(): ReadonlyMap<string, readonly Decision[]>
  decisionsByYear(): ReadonlyMap<string, readonly Decision[]>
  meetingByUrn(urn: Urn | string): Meeting | undefined
  decisionsForMeeting(urn: Urn | string): readonly Decision[]
}

export interface BuildProjectOpts {
  committee?: MeetingSeries | null
  decisions?: readonly Decision[]
  meetings?: readonly Meeting[]
}

function meetingUrnOfDecision(d: Decision): string {
  const m = d.meeting as { venue?: string; date?: string } | undefined
  return m?.date || m?.venue || ''
}

function yearOfDecision(d: Decision): string {
  const dates = d.dates ?? []
  for (const dt of dates) {
    const v = (dt as { date?: string }).date
    if (typeof v === 'string' && v) return v.slice(0, 4)
  }
  return ''
}

export function buildProject(opts: BuildProjectOpts = {}): EdoxenProject {
  const decisions = opts.decisions ?? []
  const meetings = opts.meetings ?? []
  const committee = opts.committee ?? null

  let byMeeting: ReadonlyMap<string, readonly Decision[]> | null = null
  let byYear: ReadonlyMap<string, readonly Decision[]> | null = null
  let meetingByUrnMap: ReadonlyMap<string, Meeting> | null = null

  function ensureByMeeting(): ReadonlyMap<string, readonly Decision[]> {
    if (byMeeting) return byMeeting
    const m = new Map<string, Decision[]>()
    for (const d of decisions) {
      const key = meetingUrnOfDecision(d)
      if (!key) continue
      const list = m.get(key)
      if (list) list.push(d)
      else m.set(key, [d])
    }
    byMeeting = m
    return m
  }

  function ensureByYear(): ReadonlyMap<string, readonly Decision[]> {
    if (byYear) return byYear
    const m = new Map<string, Decision[]>()
    for (const d of decisions) {
      const key = yearOfDecision(d)
      if (!key) continue
      const list = m.get(key)
      if (list) list.push(d)
      else m.set(key, [d])
    }
    byYear = m
    return m
  }

  function ensureMeetingByUrn(): ReadonlyMap<string, Meeting> {
    if (meetingByUrnMap) return meetingByUrnMap
    const m = new Map<string, Meeting>()
    for (const meeting of meetings) {
      const urn = meeting.urn
      if (urn) m.set(urn, meeting)
    }
    meetingByUrnMap = m
    return m
  }

  return {
    committee,
    decisions,
    meetings,

    decisionsByMeeting: () => ensureByMeeting(),
    decisionsByYear: () => ensureByYear(),

    meetingByUrn: (urn) => ensureMeetingByUrn().get(urn),

    decisionsForMeeting: (urn) => ensureByMeeting().get(urn) ?? [],
  }
}
