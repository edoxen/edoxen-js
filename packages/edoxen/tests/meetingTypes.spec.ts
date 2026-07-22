// Drift detection: MEETING_TYPE_LABELS must cover the canonical
// MeetingType enum mirrored from Edoxen::Enums::MEETING_TYPE. When the
// gem adds a new value, this spec fails until the labels map catches up.
//
// The canonical list lives in
// /Users/mulgogi/src/edoxen/edoxen-model/models/meeting_type.lutaml and
// propagates: gem (lib/edoxen/enums.rb) → schema ($defs/MeetingType)
// → generated TS type (MeetingType). The labels map is hand-maintained
// here; this spec is the guardrail.

import { describe, expect, it } from 'vitest'

import { MEETING_TYPE_LABELS, meetingTypeLabel } from '../src/data/meetingTypes.js'

const CANONICAL_MEETING_TYPES = [
  'plenary',
  'working_group',
  'task_group',
  'ad_hoc',
  'joint',
  'general_assembly',
  'committee',
  'subcommittee',
  'conference',
  'workshop',
  'seminar',
  'webinar',
  'hearing',
  'markup',
  'board_meeting',
  'annual_general_meeting',
  'other',
] as const

describe('meetingTypeLabel / MEETING_TYPE_LABELS', () => {
  it('covers every canonical MeetingType enum value', () => {
    const missing = CANONICAL_MEETING_TYPES.filter((t) => !(t in MEETING_TYPE_LABELS))
    expect(missing, `Missing labels for: ${missing.join(', ')}`).toEqual([])
  })

  it('does not carry labels for unknown values (catches typos)', () => {
    const extras = Object.keys(MEETING_TYPE_LABELS).filter(
      (k) => !CANONICAL_MEETING_TYPES.includes(k as (typeof CANONICAL_MEETING_TYPES)[number]),
    )
    expect(extras, `Unknown labels for: ${extras.join(', ')}`).toEqual([])
  })

  it('returns an empty string for nullish input', () => {
    expect(meetingTypeLabel(null)).toBe('')
    expect(meetingTypeLabel(undefined)).toBe('')
    expect(meetingTypeLabel('')).toBe('')
  })

  it('humanizes unknown enum values as a fallback', () => {
    expect(meetingTypeLabel('some_future_type')).toBe('Some Future Type')
  })

  it('returns the curated label for known values', () => {
    expect(meetingTypeLabel('plenary')).toBe('Plenary')
    expect(meetingTypeLabel('working_group')).toBe('Working Group')
    expect(meetingTypeLabel('annual_general_meeting')).toBe('Annual General Meeting')
  })
})
