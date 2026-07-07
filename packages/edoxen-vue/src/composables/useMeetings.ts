// useMeetings — load + cache Meeting records.

import { computed, type ComputedRef } from 'vue'
import { createListCollection } from './createCollection.js'
import type { Meeting } from 'edoxen'

export interface UseMeetingsResult {
  items: ComputedRef<Meeting[]>
  isLoaded: ComputedRef<boolean>
  loadData: () => Promise<void>
  get: (urnOrSlug: string) => Meeting | undefined
}

export function useMeetings(url = '/data/meetings.json'): UseMeetingsResult {
  const collection = createListCollection<Meeting>({
    url,
    by: ['urn', 'slug', 'identifier'],
  })

  return {
    items: computed(() => collection.items.value),
    isLoaded: computed(() => collection.isLoaded.value),
    loadData: collection.loadData,
    get: collection.get,
  }
}
