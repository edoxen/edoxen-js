// useNeighborNav — prev/next navigation for a list of items.

import { computed, type ComputedRef, type Ref } from 'vue'

export interface NeighborNav<T> {
  prev: ComputedRef<T | null>
  next: ComputedRef<T | null>
}

export function useNeighborNav<T extends { id: string }>(
  items: Ref<T[]>,
  currentId: ComputedRef<string | null>,
): NeighborNav<T> {
  const index = computed(() => {
    const id = currentId.value
    if (!id) return -1
    return items.value.findIndex((i) => i.id === id)
  })

  return {
    prev: computed(() => (index.value > 0 ? items.value[index.value - 1] : null)),
    next: computed(() =>
      index.value >= 0 && index.value < items.value.length - 1
        ? items.value[index.value + 1]
        : null,
    ),
  }
}
