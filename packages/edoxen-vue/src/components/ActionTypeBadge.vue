<script setup lang="ts">
// ActionTypeBadge — pill that renders the action verb in title-case.

import { computed } from 'vue'
import { actionTypeLabel } from '@edoxen/edoxen'

const props = defineProps<{ type?: string | null }>()

const label = computed(() => actionTypeLabel(props.type ?? ''))
</script>

<template>
  <span v-if="label" class="edoxen-action-badge">{{ label }}</span>
</template>

<style>
.edoxen-action-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--edoxen-action-fg, #1f2937);
  background: var(--edoxen-action-bg, #f3f4f6);
  border-radius: 0.25rem;
}
</style>
