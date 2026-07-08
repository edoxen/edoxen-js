// defineI18n — generic factory for typed i18n instances. Lifted from
// OIML's useI18n pattern, generalized so any site can use it.
//
// Sites call `defineI18n({ locales: ['en', 'fr'], defaultLocale: 'en',
// translations: { greeting: { en: 'Hello', fr: 'Bonjour' } } })` and
// get back an instance with `t(locale, key, vars?)`.

export interface I18nConfig<T extends string = string> {
  readonly locales: readonly T[]
  readonly defaultLocale: T
  readonly translations: Readonly<Record<string, Partial<Record<T, string>>>>
}

export interface I18nInstance<T extends string = string> {
  readonly config: I18nConfig<T>
  t(locale: T, key: string, vars?: Record<string, string | number>): string
  has(locale: T, key: string): boolean
  interpolate(template: string, vars: Record<string, string | number>): string
}

export function defineI18n<T extends string>(config: I18nConfig<T>): I18nInstance<T> {
  return {
    config,
    t(locale, key, vars) {
      const entry = config.translations[key]
      if (!entry) return key
      const raw = entry[locale] ?? entry[config.defaultLocale] ?? key
      return vars ? interpolate(raw, vars) : raw
    },
    has(locale, key) {
      const entry = config.translations[key]
      return !!(entry && (entry[locale] || entry[config.defaultLocale]))
    },
    interpolate,
  }
}

// Replace {placeholder} tokens in a template string. The `&` `<` `>`
// chars are not escaped — callers HTML-escape user-supplied values.
export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => {
    const v = vars[k]
    return v === undefined ? `{${k}}` : String(v)
  })
}

// Detect the user's preferred locale from localStorage + navigator.
// Returns the first locale from `preferred` that the user agent
// signals support for, else `fallback`.
export function detectLocale<T extends string>(
  preferred: readonly T[],
  fallback: T,
  opts: { storageKey?: string } = {},
): T {
  if (typeof window === 'undefined') return fallback
  const saved = opts.storageKey ? window.localStorage.getItem(opts.storageKey) : null
  if (saved && preferred.includes(saved as T)) return saved as T
  const nav = (typeof navigator !== 'undefined' && navigator.language || '').toLowerCase()
  for (const loc of preferred) {
    if (nav.startsWith(loc.toLowerCase())) return loc
  }
  return fallback
}
