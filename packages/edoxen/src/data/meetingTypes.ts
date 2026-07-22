// Meeting-type display labels — maps the canonical MeetingType enum
// (Edoxen::Enums::MEETING_TYPE, mirrored as MeetingType in the generated
// types) to a human-readable label for UI badges. English only; consumers
// that need other locales carry their own i18n table keyed by enum value.

const LABELS: Record<string, string> = {
  plenary: 'Plenary',
  working_group: 'Working Group',
  task_group: 'Task Group',
  ad_hoc: 'Ad Hoc',
  joint: 'Joint',
  general_assembly: 'General Assembly',
  committee: 'Committee',
  subcommittee: 'Subcommittee',
  conference: 'Conference',
  workshop: 'Workshop',
  seminar: 'Seminar',
  webinar: 'Webinar',
  hearing: 'Hearing',
  markup: 'Markup',
  board_meeting: 'Board Meeting',
  annual_general_meeting: 'Annual General Meeting',
  other: 'Other',
}

export function meetingTypeLabel(type: string | null | undefined): string {
  if (!type) return ''
  return LABELS[type] ?? type
    .split('_')
    .map((part) => (part.length === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join(' ')
}

export const MEETING_TYPE_LABELS: Readonly<Record<string, string>> = Object.freeze(LABELS)
