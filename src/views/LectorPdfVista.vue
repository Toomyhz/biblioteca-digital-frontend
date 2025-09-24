<template>
  <div class="min-h-screen bg-gray-200 flex flex-col">
    <!-- Header del lector -->
    <header class="px-6 py-4 flex items-center justify-between bg-white shadow-md z-10">
      <h1 class="text-lg font-bold text-gray-800">📖 Lector Privado</h1>
      <button
        @click="$router.back()"
        class="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
      >
        ← Volver
      </button>
    </header>

    <!-- Contenedor principal del flipbook -->
    <main class="flex-1 flex justify-center items-center px-4 py-10 bg-gray-100">
      <div
        class="w-full max-w-5xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden bg-white relative"
      >
        <!-- Flipbook -->
        <div class="relative z-10 h-full">
          <PrivatePdfFlipbook :pdfSrc="pdfSrc" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PrivatePdfFlipbook from '@/components/pdf/PrivatePdfFlipbook.vue'

const route = useRoute()

// Obtener la ruta del PDF desde los parámetros de la ruta
const pdfSrc = computed(() => route.params.archivo || '/public/100.pdf')
</script>
