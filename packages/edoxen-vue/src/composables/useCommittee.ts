// useCommittee — load a MeetingSeries fixture (committee metadata).

import { computed, type ComputedRef } from 'vue'
import { ref } from 'vue'
import { createCollection } from './createCollection.js'
import type { MeetingSeries } from '@edoxen/edoxen'

export interface UseCommitteeResult {
  committee: ComputedRef<MeetingSeries | null>
  isLoaded: ComputedRef<boolean>
  loadData: () => Promise<void>
}

export function useCommittee(url = '/data/committee.json'): UseCommitteeResult {
  const collection = createCollection<MeetingSeries | null>({
    url,
    key: 'edoxen:committee',
    initial: null,
  })

  return {
    committee: computed(() => collection.items.value),
    isLoaded: computed(() => collection.isLoaded.value),
    loadData: collection.loadData,
  }
}

// Placeholder export so ref is "used" (avoids tree-shake of vue ref
// in type-only mode). Real uses happen inside createCollection.
export const _ref = ref
