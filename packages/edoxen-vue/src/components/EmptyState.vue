<script setup lang="ts">
// EmptyState — placeholder shown when a list has no items.

defineProps<{ message?: string }>()
</script>

<template>
  <div class="edoxen-empty">
    <p>{{ message ?? 'Nothing to show.' }}</p>
  </div>
</template>

<style>
.edoxen-empty {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
}
</style>
