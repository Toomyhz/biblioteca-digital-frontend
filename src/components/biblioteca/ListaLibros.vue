<template>
  <main class="p-3 sm:p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
    <!-- Estado de carga -->
    <div v-if="props.cargando" class="text-sm text-slate-500">Cargando libros...</div>
    <div v-else-if="!props.libros?.length" class="text-sm text-slate-500">
      No se encontraron libros.
    </div>

    <!-- Lista de libros -->
    <ul v-else class="flex flex-col gap-3">
      <li v-for="(libro, index) in props.libros" :key="libro.id_libro">
        <div
          class="flex gap-3 sm:gap-4 bg-slate-50 text-slate-900 rounded-lg border border-slate-200 hover:border-sky-500 hover:bg-white hover:shadow-md transition-all p-2.5 sm:p-3"
        >
          <img
            :src="
              libro.archivo_portada ? `${DO_URL}${libro.archivo_portada}` : '/LIBRO_SIN_PORTADA.png'
            "
            :alt="`Portada de ${libro.titulo}`"
            class="h-24 md:h-28 lg:h-32 w-auto aspect-[2/3] rounded-md object-cover flex-shrink-0 bg-slate-200"
            :loading="index < 4 ? 'eager' : 'lazy'"
          />

          <div class="flex flex-col justify-between flex-1 min-w-0">
            <div class="min-w-0">
              <p class="text-sm sm:text-base font-semibold text-slate-900 line-clamp-2">
                {{ libro.titulo }}
              </p>
              <p class="text-sm text-slate-400">{{ libro.anio_publicacion }}</p>

              <p class="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-1">
                <span v-if="libro.autores?.length">
                  {{
                    libro.autores.map((a) => a.nombre_completo || 'Autor desconocido').join(', ')
                  }}
                </span>
                <span v-else> Autor desconocido </span>
              </p>
            </div>

            <div class="mt-2 flex items-center justify-between gap-2">
              <!-- espacio para info extra (carrera, año, etc) -->
              <div class="text-[11px] text-slate-500 truncate">
                <!-- Por ahora vacío o pones carrera/tema si lo tienes -->
              </div>

              <RouterLink
                :to="`/leer/${libro.id_libro}`"
                class="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full bg-blue-900 text-white hover:bg-slate-800 transition-colors"
              >
                Ver en línea
                <span>⧉</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <!-- Controles de paginación -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
      <!-- Navegación -->
      <div v-if="paginacion.total_paginas > 1" class="flex items-center gap-2">
        <button
          @click="emit('cambiarPagina', paginacion.pagina_actual - 1)"
          :disabled="paginacion.pagina_actual === 1"
          class="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-slate-100 transition-colors"
        >
          Anterior
        </button>

        <span class="text-xs sm:text-sm text-slate-600">
          Página {{ props.paginacion.pagina_actual }}
          <span class="text-slate-400">/</span>
          {{ props.paginacion.total_paginas }}
        </span>

        <button
          @click="emit('cambiarPagina', paginacion.pagina_actual + 1)"
          :disabled="paginacion.pagina_actual === paginacion.total_paginas"
          class="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-slate-100 transition-colors"
        >
          Siguiente
        </button>
      </div>

      <!-- Selector de límite -->
      <div class="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
        <span>Libros por página:</span>
        <select
          :value="paginacion.limite"
          @change="emit('cambiarLimite', Number($event.target.value))"
          class="border border-slate-300 rounded-md px-2 py-1 text-xs sm:text-sm bg-white"
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
import { DO_URL } from '@/data/api'
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
