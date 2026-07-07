// i18n — localization helpers shared across all consumers.
//
// Per the v2.1 design, every translatable entity (Decision, Meeting,
// MeetingSeries, MeetingComponent, etc.) carries a `localizations[]`
// array with one entry per available language. This module picks the
// right entry per consumer locale.

// Locale — branded ISO 639 code (3-letter ISO 639-3 or 2-letter
// ISO 639-1). Branded to prevent passing arbitrary strings where a
// locale is expected.
const LOCALE_RE = /^[a-z]{2,3}$/

export type Locale = string & { readonly __brand: 'Locale' }

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && LOCALE_RE.test(value)
}

export function buildLocale(value: string): Locale {
  if (!LOCALE_RE.test(value)) {
    throw new Error(`Invalid locale: ${value}`)
  }
  return value as Locale
}

export interface Localized<T = unknown> {
  language_code: string
  script?: string
  [key: string]: unknown
  readonly __localizationOf?: T
}

export function pickLocalization<T extends { language_code: string }>(
  list: T[] | null | undefined,
  preferred: Locale | string,
  fallback = true,
): T | null {
  if (!Array.isArray(list) || list.length === 0) return null
  const match = list.find((l) => l.language_code === preferred)
  if (match) return match
  return fallback ? (list[0] ?? null) : null
}

// ISO 639-3 → ISO 639-1 (best-effort). Falls back to the input.
const THREE_TO_TWO: Record<string, string> = {
  eng: 'en', fra: 'fr', deu: 'de', spa: 'es', ita: 'it',
  jpn: 'ja', zho: 'zh', kor: 'ko', rus: 'ru', por: 'pt',
  nld: 'nl', swe: 'sv', pol: 'pl', tur: 'tr', ara: 'ar',
  heb: 'he', hin: 'hi',
}

export function iso6393To6391(code: string): string {
  return THREE_TO_TWO[code] ?? code
}

export function formatDate(
  date: string | Date | null | undefined,
  locale: Locale | string = 'en',
  opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' },
): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''
  // Intl expects BCP-47 ('en', 'fr-CA'); we get ISO 639-3 by default.
  const tag = locale.length === 3 ? iso6393To6391(locale) : locale
  return new Intl.DateTimeFormat(tag, opts).format(d)
}

// Compact date for timeline rows: "Oct 18".
export function formatDateShort(
  date: string | Date | null | undefined,
  locale: Locale | string = 'en',
): string {
  return formatDate(date, locale, { month: 'short', day: 'numeric' })
}
