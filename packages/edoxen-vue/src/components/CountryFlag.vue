<script setup lang="ts">
// CountryFlag — render a flag emoji for an ISO 3166-1 alpha-2 code
// or country name.

import { computed } from 'vue'
import { countryFlag } from 'edoxen'

const props = defineProps<{ country?: string | null }>()
const flag = computed(() => countryFlag(props.country ?? null))
</script>

<template>
  <span v-if="flag" class="edoxen-flag" :aria-label="props.country ?? ''">{{ flag }}</span>
</template>

<style>
.edoxen-flag { font-size: 1.1em; }
</style>
