// createCollection — SSR-aware async data loader for Vue 3.
//
// Lifted from tc154's src/composables/createCollection.ts (95 LOC).
// Behaviour:
//   * SSR pass: callers injectSsrData(key, data); the collection reads
//     from the in-memory registry, skipping the fetch.
//   * Client pass: fetch with cache-bust (`?t=${BUILD_TIME}`); dedupes
//     concurrent loads via a shared Promise.
//
// Sites can either call this generic collection directly or use the
// pre-built `useDecisions` / `useMeetings` / `useCommittee` wrappers.

import { ref, type Ref } from 'vue'

const BUILD_TIME = Date.now()
const ssrRegistry = new Map<string, unknown>()

export function injectSsrData(key: string, data: unknown): void {
  ssrRegistry.set(key, data)
}

export function resetSsrRegistry(): void {
  ssrRegistry.clear()
}

export interface Collection<T> {
  items: Ref<T>
  isLoaded: Ref<boolean>
  loadData: () => Promise<void>
}

export function createCollection<T>(opts: {
  url: string
  key?: string
  initial: T
  onLoad?: (data: T) => void
}): Collection<T> {
  const { url, key = url, initial, onLoad } = opts

  const items = ref(initial) as Ref<T>
  const isLoaded = ref(false)
  let loadPromise: Promise<void> | null = null

  const loadData = async (): Promise<void> => {
    if (isLoaded.value) return
    if (loadPromise) {
      await loadPromise
      return
    }

    if (ssrRegistry.has(key)) {
      const data = ssrRegistry.get(key) as T
      items.value = data
      onLoad?.(data)
      isLoaded.value = true
      return
    }

    loadPromise = (async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}${url}?t=${BUILD_TIME}`)
        const data = (await response.json()) as T
        items.value = data
        onLoad?.(data)
        isLoaded.value = true
      } catch (e) {
        console.error(`Failed to load ${url}`, e)
        loadPromise = null
      }
    })()

    await loadPromise
  }

  return { items, isLoaded, loadData }
}

export interface ListCollection<E> extends Collection<E[]> {
  all: () => E[]
  get: (key: string) => E | undefined
}

export function createListCollection<E>(opts: {
  url: string
  key?: string
  by: string | string[]
  onLoad?: (data: E[]) => void
}): ListCollection<E> {
  const { by, onLoad: userOnLoad } = opts
  const keys = Array.isArray(by) ? by : [by]

  const base = createCollection<E[]>({
    url: opts.url,
    key: opts.key,
    initial: [],
    onLoad: userOnLoad,
  })

  const all = (): E[] => base.items.value
  const get = (lookup: string): E | undefined =>
    base.items.value.find((item) =>
      keys.some((k) => (item as Record<string, unknown>)[k] === lookup),
    )

  return { ...base, all, get }
}
