<!-- src/components/PdfControls.vue -->
<template>
  <div class="pdf-controls">
    <button @click="$emit('prev')" :disabled="currentPage <= 1">Anterior</button>
    <span>Página {{ currentPage }} / {{ totalPages }}</span>
    <button @click="$emit('next')" :disabled="currentPage >= totalPages">Siguiente</button>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: Number,
    totalPages: Number,
  },
}
</script>

<style scoped>
.pdf-controls {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}
</style>
