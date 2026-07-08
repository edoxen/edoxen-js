// useLocalizedRoute — Vue composable that prefixes paths with the
// active locale segment (`/en/about`, `/fr/a-propos`).
//
// Lifted from OIML's useLocalizedRoute (31 LOC), genericised.

import { computed, type ComputedRef, type Ref } from 'vue'

export interface UseLocalizedRouteOptions<T extends string> {
  lang: Ref<T>
  /** Optional path-mapping per locale for non-canonical routes. */
  routeMap?: Partial<Record<T, Record<string, string>>>
  /** Prefix added to all localized paths (e.g. site base path). */
  base?: string
}

export interface UseLocalizedRouteResult<T extends string> {
  localizedPath(path: string): string
  currentPrefix: ComputedRef<string>
  swapLangPath(target: T): string
}

export function useLocalizedRoute<T extends string>(
  opts: UseLocalizedRouteOptions<T>,
): UseLocalizedRouteResult<T> {
  const { lang, routeMap, base = '' } = opts

  function localizedPath(path: string): string {
    const l = lang.value
    const trimmed = path.replace(/^\/+/, '')
    const mapped = routeMap?.[l]?.[trimmed] ?? trimmed
    const segs = [base, l, mapped].filter((s) => s !== '' && s != null)
    return '/' + segs.join('/')
  }

  const currentPrefix = computed(() => `/${lang.value}`)

  function swapLangPath(target: T): string {
    // Caller is responsible for calling window.history.pushState.
    return `/${target}`
  }

  return { localizedPath, currentPrefix, swapLangPath }
}
