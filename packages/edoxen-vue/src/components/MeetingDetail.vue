<script setup lang="ts">
// MeetingDetail — single-meeting view model renderer.

import type { MeetingViewModel } from '@edoxen/edoxen'

defineProps<{
  meeting: MeetingViewModel
}>()
</script>

<template>
  <article class="edoxen-meeting-detail">
    <header class="edoxen-meeting-detail__header">
      <h1>{{ meeting.title }}</h1>
      <p class="edoxen-meeting-detail__meta">
        <span v-if="meeting.venue">{{ meeting.venue }}</span>
        <span v-if="meeting.start && meeting.end">{{ meeting.start }} → {{ meeting.end }}</span>
        <span v-else-if="meeting.start">{{ meeting.start }}</span>
        <span v-if="meeting.committee">{{ meeting.committee }}</span>
      </p>
      <p v-if="meeting.urn" class="edoxen-meeting-detail__urn">{{ meeting.urn }}</p>
    </header>
    <slot />
  </article>
</template>

<style>
.edoxen-meeting-detail { font-family: var(--edoxen-font, system-ui); }
.edoxen-meeting-detail__header { border-bottom: 1px solid var(--edoxen-border, #e5e7eb); padding-bottom: 1rem; margin-bottom: 1rem; }
.edoxen-meeting-detail__header h1 { margin: 0 0 0.5rem; font-size: 1.5rem; }
.edoxen-meeting-detail__meta { margin: 0; color: #6b7280; font-size: 0.9rem; display: flex; gap: 0.5rem; flex-wrap: wrap; }
.edoxen-meeting-detail__urn { margin: 0.25rem 0 0; font-size: 0.8rem; color: #6b7280; font-family: var(--edoxen-mono, ui-monospace); }
</style>
