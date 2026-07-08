// i18n — per-field localization helpers for v3.0.
//
// Per the v3.0 design, every translatable field on every entity is
// `Localized<String/Name>[]` — an array of `{ spelling, value }`
// entries, one per ISO 24229 spelling/conversion system code. There
// is no separate `localizations[]` collection; each field carries its
// own language tags.
//
// `spelling` accepts both spelling-system codes (`zho-Hans`,
// `ind-Latn-pre1972`) and conversion-system codes
// (`acadsin:zho-Hani:Latn:2002`). Helpers below pick the right entry
// per consumer spelling.

// Spelling — branded ISO 24229 code. Branded to prevent passing
// arbitrary strings where a spelling code is expected.
const SPELLING_RE = /^[a-z0-9][a-z0-9-]*(?::[a-z0-9][a-z0-9-]*){0,3}$/i

export type Spelling = string & { readonly __brand: 'Spelling' }

export function isSpelling(value: unknown): value is Spelling {
  return typeof value === 'string' && SPELLING_RE.test(value)
}

export function buildSpelling(value: string): Spelling {
  if (!SPELLING_RE.test(value)) {
    throw new Error(`Invalid spelling code: ${value}`)
  }
  return value as Spelling
}

// Locale kept for backward compatibility with consumer date/number
// formatting code (Intl uses BCP-47 tags).
const LOCALE_RE = /^[a-z]{2,3}(-[A-Z][a-z]{3})?(-[A-Z]{2})?$/

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

// Localized — one entry of a per-field Localized collection.
// `value` is the field's value for the given `spelling`.
export interface Localized<TValue = string> {
  spelling: string
  value: TValue
  extensions?: unknown[]
}

// Pick the right entry out of a per-field Localized collection.
// Returns `null` when no match and no fallback is allowed.
export function pickLocalized<TValue>(
  list: Localized<TValue>[] | null | undefined,
  preferred: Spelling | string,
  fallback = true,
): Localized<TValue> | null {
  if (!Array.isArray(list) || list.length === 0) return null
  const want = String(preferred)
  const exact = list.find((l) => l.spelling === want)
  if (exact) return exact
  const lang = want.split('-')[0]
  if (lang && lang.length <= 3) {
    const langMatch = list.find((l) => l.spelling.split('-')[0] === lang)
    if (langMatch) return langMatch
  }
  return fallback ? (list[0] ?? null) : null
}

export function pickLocalizedValue(
  list: Localized<string>[] | null | undefined,
  preferred: Spelling | string,
  fallback = true,
): string {
  return pickLocalized(list, preferred, fallback)?.value ?? ''
}

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
  const tag = locale.length === 3 ? iso6393To6391(locale) : locale
  return new Intl.DateTimeFormat(tag, opts).format(d)
}

export function formatDateShort(
  date: string | Date | null | undefined,
  locale: Locale | string = 'en',
): string {
  return formatDate(date, locale, { month: 'short', day: 'numeric' })
}

export { defineI18n, interpolate, detectLocale, type I18nConfig, type I18nInstance } from './define.js'
