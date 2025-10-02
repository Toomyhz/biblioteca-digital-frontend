<template>
  <main class="p-2">
    <!-- Estado de carga -->
    <div v-if="props.cargando" class="text-gray-500">Cargando libros...</div>
    <div v-else-if="!props.libros.length" class="text-gray-500">No se encontraron libros</div>

    <!-- Grilla de libros -->
    <div v-else class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
      <div v-for="libro in libros" :key="libro.id_libro">
        <div
          class="text-xl bg-white text-black rounded border-2 border-transparent hover:border-blue-800 hover:shadow-lg transition-all"
        >
          <RouterLink :to="`/info/${libro.id_libro}`" class="flex flex-col items-center p-1 w-full">
            <img
              :src="libro.portada || '/LIBRO_SIN_PORTADA.png'"
              :alt="`Portada de ${libro.titulo}`"
              class="h-36 md:h-40 lg:h-64 rounded object-cover"
              loading="lazy"
            />
            <p class="text-sm md:text-base self-start line-clamp-2 h-10 md:h-12">
              {{ libro.titulo }}
            </p>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Controles de paginación -->
    <div class="flex gap-4 mt-4">
      <!-- Navegación -->
      <div v-if="paginacion.total_paginas > 1" class="flex items-center gap-2 border rounded px-2">
        <button
          @click="emit('cambiarPagina', paginacion.pagina - 1)"
          :disabled="paginacion.pagina === 1"
          class="p-1 px-2 bg-blue-950 text-white transition-all duration-200 hover:bg-blue-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span>Página {{ props.paginacion.pagina }} / {{ props.paginacion.total_paginas }}</span>
        <button
          @click="emit('cambiarPagina', paginacion.pagina + 1)"
          :disabled="paginacion.pagina === paginacion.total_paginas"
          class="p-1 px-2 bg-blue-950 text-white transition-all duration-200 hover:bg-blue-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>

      <!-- Selector de límite -->
      <div class="flex items-center border rounded px-2">
        <span class="mr-2">Libros por página:</span>
        <select
          :value="paginacion.limite"
          @change="emit('cambiarLimite', Number($event.target.value))"
          class="border rounded px-1"
        >
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </div>
    </div>
  </main>
</template>

<script setup>
const props = defineProps({
  libros: {
    type: Array,
    required: true,
  },
  paginacion: {
    type: Object,
    required: true,
  },
  cargando: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['cambiarPagina', 'cambiarLimite'])
</script>
