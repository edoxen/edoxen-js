<script setup lang="ts">
// ResolutionList — table-like list of decision view-models with
// optional filter chips by year and action type.
//
// Pure presentational component; data + filter state come from the
// parent. Built on the shared `DecisionViewModel` from edoxen.

import { computed } from 'vue'
import type { DecisionViewModel, DecisionSortOrder } from 'edoxen'
import { compareDecisions, actionTypeLabel } from 'edoxen'
import ActionTypeBadge from './ActionTypeBadge.vue'
import PrevNextNav from './PrevNextNav.vue'

interface ActionLike { type?: string }

const props = defineProps<{
  decisions: DecisionViewModel[]
  selectedYears?: string[]
  selectedActionTypes?: string[]
  query?: string
  sort?: DecisionSortOrder
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
}>()

const filtered = computed(() => {
  let out = props.decisions
  if (props.selectedYears?.length) {
    out = out.filter((d) => props.selectedYears!.includes(d.year))
  }
  if (props.selectedActionTypes?.length) {
    const wanted = new Set(props.selectedActionTypes)
    out = out.filter((d) =>
      d.actions.some((a: unknown) => wanted.has((a as ActionLike).type ?? '')),
    )
  }
  if (props.query) {
    const q = props.query.toLowerCase()
    out = out.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.subject.toLowerCase().includes(q) ||
        d.identifier.toLowerCase().includes(q),
    )
  }
  return [...out].sort(compareDecisions(props.sort ?? 'newest'))
})

// Pre-cast actions for template consumption; TS assertions don't
// work directly inside Vue template expressions.
function actionType(action: unknown): string {
  return (action as ActionLike).type ?? ''
}
</script>

<template>
  <ul class="edoxen-resolution-list" role="list">
    <li
      v-for="d in filtered"
      :key="d.id"
      class="edoxen-resolution-list__item"
      @click="emit('select', d.id)"
    >
      <div class="edoxen-resolution-list__meta">
        <span class="edoxen-resolution-list__year">{{ d.year }}</span>
        <span class="edoxen-resolution-list__id">{{ d.identifier }}</span>
      </div>
      <h3 class="edoxen-resolution-list__title">{{ d.title || d.snippet || actionTypeLabel(actionType(d.actions[0])) }}</h3>
      <p v-if="d.snippet" class="edoxen-resolution-list__snippet">{{ d.snippet }}</p>
      <div v-if="d.actions.length" class="edoxen-resolution-list__actions">
        <ActionTypeBadge
          v-for="a in d.actions.slice(0, 3)"
          :key="actionType(a)"
          :type="actionType(a)"
        />
      </div>
    </li>
  </ul>
  <PrevNextNav v-if="filtered.length === 0" :prev="null" :next="null">
    <template #empty>No resolutions match the current filters.</template>
  </PrevNextNav>
</template>

<style>
.edoxen-resolution-list { list-style: none; padding: 0; margin: 0; }
.edoxen-resolution-list__item {
  padding: 1rem;
  border-bottom: 1px solid var(--edoxen-border, #e5e7eb);
  cursor: pointer;
}
.edoxen-resolution-list__item:hover { background: var(--edoxen-hover, #f9fafb); }
.edoxen-resolution-list__meta { display: flex; gap: 1rem; font-size: 0.875rem; color: #6b7280; }
.edoxen-resolution-list__year { font-weight: 600; }
.edoxen-resolution-list__title { margin: 0.5rem 0 0.25rem; font-size: 1.05rem; }
.edoxen-resolution-list__snippet { margin: 0; color: #4b5563; font-size: 0.9rem; line-height: 1.4; }
.edoxen-resolution-list__actions { display: flex; gap: 0.25rem; margin-top: 0.5rem; flex-wrap: wrap; }
</style>
