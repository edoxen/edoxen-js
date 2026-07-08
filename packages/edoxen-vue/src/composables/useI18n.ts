// useI18n — Vue composable wrapping an I18nInstance with reactive
// current-locale state. Lifted from OIML's useI18n (71 LOC), genericised.

import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'
import { defineI18n, detectLocale, type I18nConfig, type I18nInstance } from '@edoxen/edoxen'

export interface UseI18nOptions<T extends string> {
  config: I18nConfig<T>
  storageKey?: string
  applyHtmlLang?: boolean
}

export interface UseI18nResult<T extends string> {
  readonly instance: I18nInstance<T>
  readonly lang: Ref<T>
  readonly t: ComputedRef<(key: string, vars?: Record<string, string | number>) => string>
  setLang(lang: T): void
  toggleLang(): void
}

export function useI18n<T extends string>(opts: UseI18nOptions<T>): UseI18nResult<T> {
  const { config, storageKey, applyHtmlLang = true } = opts
  const instance = defineI18n(config)

  const lang = ref(detectLocale(config.locales, config.defaultLocale, { storageKey })) as Ref<T>

  function applyHtml(tag: T) {
    if (applyHtmlLang && typeof document !== 'undefined') {
      document.documentElement.lang = tag
    }
  }
  applyHtml(lang.value)

  watch(lang, (l) => {
    if (typeof window !== 'undefined' && storageKey) {
      window.localStorage.setItem(storageKey, l)
    }
    applyHtml(l)
  })

  const t = computed(() => (key: string, vars?: Record<string, string | number>) =>
    instance.t(lang.value, key, vars),
  )

  function setLang(l: T): void {
    lang.value = l
  }

  function toggleLang(): void {
    const idx = config.locales.indexOf(lang.value)
    const next = config.locales[(idx + 1) % config.locales.length]
    setLang(next)
  }

  return { instance, lang, t, setLang, toggleLang }
}
