<script lang="ts">
export interface FilterFacet {
  id: string
  label: string
  values: string[]
  selected: string[]
  multiple?: boolean
}
</script>

<script setup lang="ts">
// FilterBar — generic facet filter UI. Renders one chip rail per
// declared facet; chips toggle inclusion in the parent's selection.

import { computed } from 'vue'

const props = defineProps<{
  facets: FilterFacet[]
}>()

const emit = defineEmits<{
  (e: 'toggle', facetId: string, value: string): void
}>()

const displayValues = computed(() =>
  props.facets.map((f) => ({
    ...f,
    selectedSet: new Set(f.selected),
  })),
)
</script>

<template>
  <div class="edoxen-filter-bar">
    <div v-for="f in displayValues" :key="f.id" class="edoxen-filter-bar__facet">
      <span class="edoxen-filter-bar__label">{{ f.label }}</span>
      <button
        v-for="v in f.values"
        :key="v"
        type="button"
        class="edoxen-filter-bar__chip"
        :class="{ 'edoxen-filter-bar__chip--active': f.selectedSet.has(v) }"
        @click="emit('toggle', f.id, v)"
      >
        {{ v }}
      </button>
    </div>
  </div>
</template>

<style>
.edoxen-filter-bar { display: flex; flex-direction: column; gap: 0.5rem; padding: 0.5rem 0; }
.edoxen-filter-bar__facet { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
.edoxen-filter-bar__label { font-size: 0.8rem; color: #6b7280; min-width: 5rem; }
.edoxen-filter-bar__chip {
  border: 1px solid var(--edoxen-border, #e5e7eb);
  background: var(--edoxen-chip-bg, #fff);
  color: var(--edoxen-chip-fg, #374151);
  padding: 0.2rem 0.6rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  cursor: pointer;
}
.edoxen-filter-bar__chip:hover { background: var(--edoxen-chip-hover, #f9fafb); }
.edoxen-filter-bar__chip--active {
  background: var(--edoxen-chip-active-bg, #1f2937);
  color: var(--edoxen-chip-active-fg, #fff);
  border-color: var(--edoxen-chip-active-bg, #1f2937);
}
</style>
