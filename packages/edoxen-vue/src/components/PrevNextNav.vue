<script setup lang="ts">
// PrevNextNav — previous / next navigation between sibling pages.

defineProps<{
  prev: { id: string; title?: string } | null
  next: { id: string; title?: string } | null
}>()

const emit = defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
}>()
</script>

<template>
  <nav class="edoxen-prev-next">
    <slot name="empty" />
    <button
      v-if="prev"
      type="button"
      class="edoxen-prev-next__btn"
      @click="emit('prev')"
    >
      ← {{ prev.title || prev.id }}
    </button>
    <span v-else />
    <button
      v-if="next"
      type="button"
      class="edoxen-prev-next__btn"
      @click="emit('next')"
    >
      {{ next.title || next.id }} →
    </button>
  </nav>
</template>

<style>
.edoxen-prev-next {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
  border-top: 1px solid var(--edoxen-border, #e5e7eb);
}
.edoxen-prev-next__btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--edoxen-link, #2563eb);
  font-size: 0.95rem;
  padding: 0.25rem 0;
}
.edoxen-prev-next__btn:hover { text-decoration: underline; }
</style>
