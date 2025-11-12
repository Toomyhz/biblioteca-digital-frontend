<template>
  <main class="p-2 transition-all duration-300 border border-gray-400 rounded">
    <!-- Estado de carga -->
    <div v-if="props.cargando" class="text-gray-500">Cargando libros...</div>
    <div v-else-if="!props.libros?.length" class="text-gray-500">No se encontraron libros</div>

    <!-- Lista de libros -->
    <ul v-else class="flex flex-col gap-2">
      <li v-for="libro in props.libros" :key="libro.id_libro">
        <div
          class="flex items-center gap-4 bg-white text-black rounded border-2 border-transparent hover:border-blue-800 hover:shadow-lg transition-all p-2"
        >
          <img
            :src="
              libro.archivo_portada
                ? `${BASE_URL}/static/portadas/${libro.archivo_portada}`
                : '/LIBRO_SIN_PORTADA.png'
            "
            :alt="`Portada de ${libro.titulo}`"
            class="h-24 md:h-28 lg:h-32 rounded object-cover flex-shrink-0"
            loading="lazy"
          />
          <div class="flex flex-col">
            <p class="text-base font-semibold line-clamp-2">
              {{ libro.titulo }}
            </p>
            <p class="text-sm text-gray-600 mt-1">
              <span v-for="autor in libro.autores" :key="autor.id_autor">
                {{ autor.nombre_completo || 'Autor desconocido' }}
              </span>
            </p>
            <RouterLink :to="`/leer/${libro.id_libro}`">
              <span>Ver en línea</span>
            </RouterLink>
          </div>
        </div>
      </li>
    </ul>

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
import { BASE_URL } from '@/data/api'
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
