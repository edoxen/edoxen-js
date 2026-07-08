<script setup lang="ts">
// MeetingList — table-like list of MeetingViewModel with year filter.

import { computed } from 'vue'
import type { MeetingViewModel } from '@edoxen/edoxen'

const props = defineProps<{
  meetings: MeetingViewModel[]
  selectedYears?: string[]
}>()

const emit = defineEmits<{
  (e: 'select', urn: string): void
}>()

const filtered = computed(() => {
  if (!props.selectedYears?.length) return props.meetings
  const years = new Set(props.selectedYears)
  return props.meetings.filter((m) => m.year != null && years.has(String(m.year)))
})

const sorted = computed(() =>
  [...filtered.value].sort((a, b) => (b.year ?? 0) - (a.year ?? 0)),
)
</script>

<template>
  <ul class="edoxen-meeting-list" role="list">
    <li
      v-for="m in sorted"
      :key="m.urn"
      class="edoxen-meeting-list__item"
      @click="emit('select', m.urn)"
    >
      <span class="edoxen-meeting-list__year">{{ m.year ?? '—' }}</span>
      <span class="edoxen-meeting-list__title">{{ m.title }}</span>
      <span v-if="m.venue" class="edoxen-meeting-list__venue">{{ m.venue }}</span>
    </li>
  </ul>
</template>

<style>
.edoxen-meeting-list { list-style: none; padding: 0; margin: 0; }
.edoxen-meeting-list__item {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--edoxen-border, #e5e7eb);
  cursor: pointer;
  display: flex;
  gap: 1rem;
  align-items: baseline;
}
.edoxen-meeting-list__item:hover { background: var(--edoxen-hover, #f9fafb); }
.edoxen-meeting-list__year { font-weight: 600; min-width: 3rem; color: #6b7280; }
.edoxen-meeting-list__title { flex: 1; }
.edoxen-meeting-list__venue { color: #6b7280; font-size: 0.85rem; }
</style>
