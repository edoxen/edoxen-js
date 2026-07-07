// Action-type display labels — maps the canonical verb (Edoxen::Enums::ACTION_TYPE)
// to a human-readable label for UI badges.
//
// Lifted from tc184sc4's src/data/actionTypes.ts.

const LABELS: Record<string, string> = {
  adopts: 'Adopts',
  thanks: 'Thanks',
  approves: 'Approves',
  decides: 'Decides',
  declares: 'Declares',
  asks: 'Asks',
  invites: 'Invites',
  resolves: 'Resolves',
  confirms: 'Confirms',
  welcomes: 'Welcomes',
  recommends: 'Recommends',
  requests: 'Requests',
  congratulates: 'Congratulates',
  instructs: 'Instructs',
  urges: 'Urges',
  appoints: 'Appoints',
  'calls-upon': 'Calls Upon',
  encourages: 'Encourages',
  affirms: 'Affirms',
  elects: 'Elects',
  authorizes: 'Authorizes',
  charges: 'Charges',
  states: 'States',
  remarks: 'Remarks',
  judges: 'Judges',
  sanctions: 'Sanctions',
  abrogates: 'Abrogates',
  empowers: 'Empowers',
}

export function actionTypeLabel(type: string | null | undefined): string {
  if (!type) return ''
  return LABELS[type] ?? type.charAt(0).toUpperCase() + type.slice(1)
}

// Color category per action verb, for UI badges. Lifted from tc184sc4.
// Each entry is a Tailwind-friendly color name (consumer maps to CSS).
const COLOR_CATEGORIES: Record<string, string> = {
  adopts: 'green',
  approves: 'green',
  confirms: 'green',
  endorses: 'green',
  reaffirms: 'green',
  ratifies: 'green',
  decides: 'blue',
  determines: 'blue',
  establishes: 'blue',
  instructs: 'blue',
  directs: 'blue',
  mandates: 'blue',
  authorizes: 'blue',
  appoints: 'blue',
  elects: 'blue',
  assigns: 'blue',
  nominates: 'blue',
  empowers: 'blue',
  requests: 'amber',
  asks: 'amber',
  urges: 'amber',
  recommends: 'amber',
  suggests: 'amber',
  proposes: 'amber',
  invites: 'amber',
  encourages: 'amber',
  resolves: 'purple',
  declares: 'purple',
  states: 'purple',
  announces: 'purple',
  proclaims: 'purple',
  acknowledges: 'slate',
  notes: 'slate',
  recognises: 'slate',
  recognizes: 'slate',
  thanks: 'slate',
  appreciates: 'slate',
  congratulates: 'slate',
  welcomes: 'slate',
  abrogates: 'red',
  repeals: 'red',
  revokes: 'red',
  rescinds: 'red',
  supersedes: 'red',
  replaces: 'red',
  withdraws: 'red',
  rejects: 'red',
  denies: 'red',
  refuses: 'red',
  opposes: 'red',
}

export function actionTypeColor(type: string | null | undefined): string {
  if (!type) return 'slate'
  return COLOR_CATEGORIES[type] ?? 'slate'
}

export const ACTION_TYPE_LABELS: Readonly<Record<string, string>> = Object.freeze(LABELS)
