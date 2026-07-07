// useDecisions — load + cache DecisionCollection records.
//
// Wraps createCollection around `/data/decisions.json` (the file the
// edoxen-build CLI emits). Returns typed Decision[] records via the
// `presentDecision` view-model from the data package.

import { computed, type ComputedRef } from 'vue'
import { createListCollection } from './createCollection.js'
import type { Decision } from '@edoxen/edoxen'

export interface UseDecisionsResult {
  items: ComputedRef<Decision[]>
  isLoaded: ComputedRef<boolean>
  loadData: () => Promise<void>
  get: (id: string) => Decision | undefined
}

export function useDecisions(url = '/data/decisions.json'): UseDecisionsResult {
  const collection = createListCollection<Decision>({
    url,
    by: ['id', 'urn', 'identifier'],
  })

  return {
    items: computed(() => collection.items.value),
    isLoaded: computed(() => collection.isLoaded.value),
    loadData: collection.loadData,
    get: collection.get,
  }
}
