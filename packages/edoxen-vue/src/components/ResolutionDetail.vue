<script setup lang="ts">
// ResolutionDetail — full single-decision view model renderer.
// Pure presentational; data via parent.

import type { DecisionViewModel } from '@edoxen/edoxen'
import ActionTypeBadge from './ActionTypeBadge.vue'

defineProps<{
  decision: DecisionViewModel
}>()
</script>

<template>
  <article class="edoxen-resolution-detail">
    <header class="edoxen-resolution-detail__header">
      <p class="edoxen-resolution-detail__id">{{ decision.identifier }}</p>
      <h1 class="edoxen-resolution-detail__title">{{ decision.title || 'Untitled' }}</h1>
      <p v-if="decision.subject" class="edoxen-resolution-detail__subject">{{ decision.subject }}</p>
      <p v-if="decision.urn" class="edoxen-resolution-detail__urn">{{ decision.urn }}</p>
    </header>

    <section v-if="decision.considerations.length" class="edoxen-resolution-detail__block">
      <h2>Considerations</h2>
      <ul>
        <li v-for="(c, i) in decision.considerations" :key="i">
          <ActionTypeBadge :type="(c as { type?: string }).type" />
          <span>{{ (c as { message?: string }).message }}</span>
        </li>
      </ul>
    </section>

    <section v-if="decision.actions.length" class="edoxen-resolution-detail__block">
      <h2>Actions</h2>
      <ul>
        <li v-for="(a, i) in decision.actions" :key="i">
          <ActionTypeBadge :type="(a as { type?: string }).type" />
          <span>{{ (a as { message?: string }).message }}</span>
        </li>
      </ul>
    </section>

    <section v-if="decision.approvals.length" class="edoxen-resolution-detail__block">
      <h2>Approvals</h2>
      <ul>
        <li v-for="(a, i) in decision.approvals" :key="i">
          {{ (a as { degree?: string }).degree }} — {{ (a as { type?: string }).type }}
        </li>
      </ul>
    </section>
  </article>
</template>

<style>
.edoxen-resolution-detail { font-family: var(--edoxen-font, system-ui); }
.edoxen-resolution-detail__header { margin-bottom: 1.5rem; border-bottom: 1px solid var(--edoxen-border, #e5e7eb); padding-bottom: 1rem; }
.edoxen-resolution-detail__id { color: #6b7280; font-size: 0.875rem; margin: 0; }
.edoxen-resolution-detail__title { margin: 0.5rem 0 0.25rem; font-size: 1.5rem; }
.edoxen-resolution-detail__subject { margin: 0.25rem 0; color: #374151; }
.edoxen-resolution-detail__urn { margin: 0.25rem 0; font-size: 0.8rem; color: #6b7280; font-family: var(--edoxen-mono, ui-monospace); }
.edoxen-resolution-detail__block { margin-top: 1.5rem; }
.edoxen-resolution-detail__block h2 { font-size: 1.05rem; margin: 0 0 0.5rem; }
.edoxen-resolution-detail__block ul { list-style: none; padding: 0; margin: 0; }
.edoxen-resolution-detail__block li { padding: 0.5rem 0; border-bottom: 1px solid var(--edoxen-border, #f3f4f6); display: flex; gap: 0.5rem; align-items: flex-start; }
</style>
