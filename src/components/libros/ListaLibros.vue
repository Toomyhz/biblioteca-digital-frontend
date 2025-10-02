<template>
  <main class="p-2">
    <h2>Filtrando por {{ props.filtros }}</h2>
    <h2>{{ librosPorPagina }}</h2>

    <button @click="limpiarFiltros" class="cursor-pointer">Limpiar filtros</button>
    <div v-if="cargando">Cargando libros...</div>
    <div v-else class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
      <div v-for="libro_servido in libros" :key="libro_servido.id">
        <div
          class="text-xl bg-[#fff] text-[#000] rounded border-2 border-transparent hover:border-blue-800 hover:shadow-lg transition-all"
        >
          <RouterLink
            :to="`/info/${libro_servido.id}`"
            class="flex flex-col items-center p-1 w-[100%]"
          >
            <img
              :src="libro_servido.portada ? libro_servido.portada : '/LIBRO_SIN_PORTADA.png'"
              alt="Portada"
              class="h-36 md:h-40 lg:h-64 rounded"
            />
            <p class="text-sm md:text-base self-start line-clamp-2 md:line-clamp-2 h-10 md:h-12">
              {{ libro_servido.titulo }}
            </p>
          </RouterLink>
        </div>
      </div>
    </div>
    <div class="flex gap-4 mt-4">
      <div class="flex items-center gap-2 border rounded">
        <button
          @click="paginaActual--"
          :disabled="paginaActual === 1"
          class="p-1 bg-blue-950 text-white transition-all duration-200 ease-in-out hover:bg-blue-900"
        >
          Anterior
        </button>
        <span>Página {{ paginaActual }}</span>
        <button
          @click="paginaActual++"
          :disabled="libros.length < librosPorPagina"
          :class="{
            'p-1 bg-blue-950 text-white transition-all duration-200 ease-in-out hover:bg-blue-900': true,
            'bg-gray-400 opacity-50 cursor-not-allowed hover:bg-gray-400':
              libros.length < librosPorPagina,
          }"
        >
          Siguiente
        </button>
      </div>
      <div class="flex border rounded">
        <span class="p-1">Libros por página:</span>
        <select v-model="librosPorPagina">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, watch, toRaw, onMounted } from 'vue'
import { getLibros } from '@/data/api'

const props = defineProps({
  filtros: {
    type: Object,
    required: true,
  },
})

const paginaActual = ref(1)
const librosPorPagina = ref(10)

const libros = ref([])
const cargando = ref(false)

const actualizarLibros = async () => {
  cargando.value = true
  const filtros = toRaw(props.filtros)

  try {
    const respuesta = await getLibros({
      page: paginaActual.value,
      limit: librosPorPagina.value,
      filtros: filtros,
    })

    libros.value = respuesta.data || respuesta.libros || respuesta.results || []
  } catch (error) {
    console.error('Error obteniendo libros:', error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  actualizarLibros()
})

watch(
  () => props.filtros,
  () => {
    paginaActual.value = 1 // Reiniciar paginación al cambiar filtros
    libros.value = []
    actualizarLibros()
  },
  { deep: true },
)

watch(paginaActual, () => {
  libros.value = []
  actualizarLibros()
})
watch(librosPorPagina, () => {
  paginaActual.value = 1
  libros.value = []
  actualizarLibros()
})
</script>
