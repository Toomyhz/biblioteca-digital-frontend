<template>
  <div class="max-w-3/4 mx-auto flex flex-col">
    <!-- Buscador arriba -->
    <BuscadorLibros />

    <!-- Botón de filtros arriba -->
    <div class="mb-4">
      <button @click="toggleFiltros" class="px-4 py-2 bg-gray-300 rounded">
        {{ showFiltros ? 'Ocultar filtros' : 'Mostrar filtros' }}
      </button>
    </div>

    <!-- Contenedor principal: sidebar + listado -->
    <div class="flex flex-1">
      <!-- Sidebar lateral -->
      <SidebarFiltros
        v-model:visible="showFiltros"
        @limpiar="limpiarFiltros"
        :carreras="carreras"
        :autores="autores"
        :filtros="filtros"
        @update-filtros="onUpdateFiltros"
        class="h-full"
      />
      <!-- <NuevosFiltros
        :carreras="carreras"
        :autores="autores"
        :filtros="filtros"
        @update-filtros="onUpdateFiltros"
      /> -->
      <!-- Listado ocupa todo el resto -->
      <div class="flex-1 p-4 overflow-auto">
        <ListaLibros
          :libros="libros"
          :paginacion="paginacion"
          @cambiarPagina="(nuevaPagina) => actualizarPagina(nuevaPagina)"
          @cambiarLimite="(nuevoLimite) => actualizarLimite(nuevoLimite)"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBiblioteca } from '@/data/api'
import BuscadorLibros from '@/components/biblioteca/BuscadorLibros.vue'
import ListaLibros from '@/components/biblioteca/ListaLibros.vue'
import SidebarFiltros from '@/components/biblioteca/SidebarFiltros.vue'

const route = useRoute()
const router = useRouter()

const filtros = ref({
  carreras: [],
  autores: [],
  busqueda: '',
})
const onUpdateFiltros = (val) => {
  if (JSON.stringify(filtros.value) === JSON.stringify(val)) return

  filtros.value = val
  // Actualizar query params
  router.replace({
    path: '/biblioteca',
    query: {
      carrera: val.carreras && val.carreras.length ? val.carreras.join(',') : undefined,
      autor: val.autores && val.autores.length ? val.autores.join(',') : undefined,
      busqueda: val.busqueda || undefined,
      pagina: 1,
    },
  })
}

const libros = ref([])
const paginacion = ref({})
const carreras = ref([])
const autores = ref([])

const fetchBiblioteca = async () => {
  const data = await getBiblioteca({
    pagina: Number(route.query.pagina) || 1,
    limite: Number(route.query.limite) || 10,
    filtros: filtros.value,
  })

  libros.value = data.libros.data
  paginacion.value = data.libros.paginacion
  carreras.value = data.carreras.visibles
  autores.value = data.autores.visibles
}

// 👇 Handlers para eventos del hijo
const actualizarPagina = (nuevaPagina) => {
  router.replace({ query: { ...route.query, pagina: nuevaPagina } })
}

const actualizarLimite = (nuevoLimite) => {
  router.replace({ query: { ...route.query, limite: nuevoLimite, pagina: 1 } })
}

watch(
  () => route.query,
  (query) => {
    filtros.value = {
      carreras: query.carrera ? query.carrera.split(',') : [],
      autores: query.autor ? query.autor.split(',') : [],
      busqueda: query.busqueda || '',
    }
    fetchBiblioteca()
  },
  { immediate: true },
)

const showFiltros = ref(false)
const filtroNombre = ref('')
function toggleFiltros() {
  showFiltros.value = !showFiltros.value
}
function limpiarFiltros() {
  filtroNombre.value = ''
}
</script>
