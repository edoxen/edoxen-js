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

export const ACTION_TYPE_LABELS: Readonly<Record<string, string>> = Object.freeze(LABELS)
