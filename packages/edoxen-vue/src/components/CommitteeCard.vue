<script setup lang="ts">
// CommitteeCard — small card showing committee name + a few stats.

defineProps<{
  name: string
  title?: string
  established?: number | null
  stats?: Array<{ label: string; value: string | number | null }>
}>()
</script>

<template>
  <div class="edoxen-committee-card">
    <h2 class="edoxen-committee-card__name">{{ name }}</h2>
    <p v-if="title" class="edoxen-committee-card__title">{{ title }}</p>
    <div v-if="stats?.length || established" class="edoxen-committee-card__stats">
      <div v-if="established" class="edoxen-committee-card__stat">
        <span class="edoxen-committee-card__stat-value">{{ established }}</span>
        <span class="edoxen-committee-card__stat-label">Established</span>
      </div>
      <div v-for="s in stats" :key="s.label" class="edoxen-committee-card__stat">
        <span class="edoxen-committee-card__stat-value">{{ s.value ?? '—' }}</span>
        <span class="edoxen-committee-card__stat-label">{{ s.label }}</span>
      </div>
    </div>
  </div>
</template>

<style>
.edoxen-committee-card { font-family: var(--edoxen-font, system-ui); padding: 1rem; border: 1px solid var(--edoxen-border, #e5e7eb); border-radius: 0.5rem; }
.edoxen-committee-card__name { margin: 0; font-size: 1.2rem; }
.edoxen-committee-card__title { margin: 0.25rem 0 0; color: #6b7280; font-size: 0.9rem; }
.edoxen-committee-card__stats { display: flex; gap: 1.5rem; margin-top: 1rem; flex-wrap: wrap; }
.edoxen-committee-card__stat { display: flex; flex-direction: column; }
.edoxen-committee-card__stat-value { font-size: 1.5rem; font-weight: 600; color: #111827; }
.edoxen-committee-card__stat-label { font-size: 0.8rem; color: #6b7280; }
</style>
