// Composable tests covering SSR data injection, i18n reactive state,
// localized routing, and filtered collections.

import { describe, it, expect, beforeEach } from 'vitest'
import { ref, computed, nextTick } from 'vue'
import {
  createCollection,
  createListCollection,
  injectSsrData,
  resetSsrRegistry,
  useI18n,
  useLocalizedRoute,
} from '../src/composables/index.js'

// --- createCollection SSR + fetch ------------------------------------

describe('createCollection', () => {
  beforeEach(() => {
    resetSsrRegistry()
  })

  it('returns initial value before load', () => {
    const col = createCollection<number>({ url: '/test.json', initial: 0 })
    expect(col.items.value).toBe(0)
    expect(col.isLoaded.value).toBe(false)
  })

  it('reads from SSR registry when available', () => {
    injectSsrData('/ssr.json', { count: 42 })
    const col = createCollection<{ count: number }>({
      url: '/ssr.json',
      initial: { count: 0 },
    })
    return col.loadData().then(() => {
      expect(col.items.value.count).toBe(42)
      expect(col.isLoaded.value).toBe(true)
    })
  })

  it('dedupes concurrent loads (SSR path)', async () => {
    injectSsrData('/dedupe.json', { ok: true })
    const col = createCollection<{ ok: boolean }>({
      url: '/dedupe.json',
      initial: { ok: false },
    })
    const p1 = col.loadData()
    const p2 = col.loadData()
    await Promise.all([p1, p2])
    expect(col.isLoaded.value).toBe(true)
    expect(col.items.value.ok).toBe(true)
  })
})

describe('createListCollection', () => {
  beforeEach(() => resetSsrRegistry())

  it('provides all() + get() lookup', () => {
    injectSsrData('/list.json', [
      { id: 'a', name: 'Alpha' },
      { id: 'b', name: 'Beta' },
    ])
    const col = createListCollection<{ id: string; name: string }>({
      url: '/list.json',
      by: 'id',
    })
    return col.loadData().then(() => {
      expect(col.all()).toHaveLength(2)
      expect(col.get('a')?.name).toBe('Alpha')
      expect(col.get('z')).toBeUndefined()
    })
  })

  it('supports multi-key lookup', () => {
    injectSsrData('/multi.json', [{ slug: 'x', urn: 'urn:t:x' }])
    const col = createListCollection<{ slug: string; urn: string }>({
      url: '/multi.json',
      by: ['slug', 'urn'],
    })
    return col.loadData().then(() => {
      expect(col.get('x')?.urn).toBe('urn:t:x')
      expect(col.get('urn:t:x')?.slug).toBe('x')
    })
  })
})

// --- useI18n ----------------------------------------------------------

describe('useI18n', () => {
  const config = {
    locales: ['en', 'fr'] as const,
    defaultLocale: 'en' as const,
    translations: {
      greeting: { en: 'Hello', fr: 'Bonjour' },
      count: { en: '{n} items', fr: '{n} articles' },
    },
  }

  it('translates to the current locale', () => {
    const { t, lang } = useI18n({ config })
    expect(t.value('greeting')).toBe('Hello')
    lang.value = 'fr'
    expect(t.value('greeting')).toBe('Bonjour')
  })

  it('interpolates placeholders', () => {
    const { t } = useI18n({ config })
    expect(t.value('count', { n: 5 })).toBe('5 items')
  })

  it('setLang + toggleLang', async () => {
    const { lang, setLang, toggleLang } = useI18n({ config })
    expect(lang.value).toBe('en')
    setLang('fr')
    expect(lang.value).toBe('fr')
    toggleLang()
    expect(lang.value).toBe('en')
  })
})

// --- useLocalizedRoute ------------------------------------------------

describe('useLocalizedRoute', () => {
  it('prefixes path with locale', () => {
    const lang = ref('en')
    const { localizedPath } = useLocalizedRoute({ lang })
    expect(localizedPath('about')).toBe('/en/about')
  })

  it('respects routeMap for non-canonical paths', () => {
    const lang = ref('fr')
    const { localizedPath } = useLocalizedRoute({
      lang,
      routeMap: {
        fr: { about: 'a-propos' },
      },
    })
    expect(localizedPath('about')).toBe('/fr/a-propos')
  })

  it('includes base prefix', () => {
    const lang = ref('en')
    const { localizedPath } = useLocalizedRoute({ lang, base: '/site' })
    expect(localizedPath('home')).toBe('/site/en/home')
  })

  it('currentPrefix reacts to lang', () => {
    const lang = ref('en')
    const { currentPrefix } = useLocalizedRoute({ lang })
    expect(currentPrefix.value).toBe('/en')
    lang.value = 'fr'
    expect(currentPrefix.value).toBe('/fr')
  })
})
