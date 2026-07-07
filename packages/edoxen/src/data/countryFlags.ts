// Country flag emoji — maps ISO 3166-1 alpha-2 codes (or country
// names) to regional-indicator-symbol emoji.
//
// Lifted from tc184sc4's src/data/countryFlags.ts.

const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  germany: 'DE',
  'united states': 'US',
  usa: 'US',
  'united kingdom': 'GB',
  uk: 'GB',
  china: 'CN',
  france: 'FR',
  korea: 'KR',
  'south korea': 'KR',
  japan: 'JP',
  italy: 'IT',
  switzerland: 'CH',
  australia: 'AU',
  sweden: 'SE',
  norway: 'NO',
  canada: 'CA',
  portugal: 'PT',
  'south africa': 'ZA',
  spain: 'ES',
  netherlands: 'NL',
  'the netherlands': 'NL',
}

function codeToEmoji(code: string): string {
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('')
}

// Accepts either a country name (e.g. "Japan") or an ISO 3166-1
// alpha-2 code (e.g. "JP"). Returns the flag emoji or '' on no match.
export function countryFlag(input: string | null | undefined): string {
  if (!input) return ''
  const lower = input.toLowerCase().trim()
  if (/^[a-z]{2}$/.test(lower)) return codeToEmoji(lower)
  const code = COUNTRY_NAME_TO_CODE[lower]
  return code ? codeToEmoji(code) : ''
}

// "City, Country" → flag for the country segment. Useful for venue
// strings stored as "Nagasaki, Japan".
export function flagFromVenue(venue: string | null | undefined): string {
  if (!venue) return ''
  const parts = venue.split(',')
  return countryFlag(parts[parts.length - 1])
}
