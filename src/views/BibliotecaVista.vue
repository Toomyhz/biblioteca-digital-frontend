<template>
  <div>
    <div class="max-w-6xl mx-auto flex flex-col px-3 sm:px-4 lg:px-6 py-4 sm:py-6 gap-4">
      <!-- Header / título -->
      <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 class="text-xl sm:text-2xl font-semibold text-slate-900">Biblioteca digital</h1>
          <p class="text-sm text-slate-500">Busca libros por título, autor o carrera.</p>
        </div>

        <!-- Buscador alineado a la derecha en desktop -->
        <div class="w-full sm:w-80">
          <BuscadorLibros />
        </div>
      </header>

      <!-- Fila: botón filtros + resumen -->
      <div class="flex items-center justify-between gap-2">
        <button
          @click="toggleFiltros"
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border border-slate-300 bg-white shadow-sm hover:bg-slate-100 transition-colors"
        >
          <span>{{ showFiltros ? 'Ocultar filtros' : 'Mostrar filtros' }}</span>
        </button>

        <p v-if="paginacion.total" class="hidden sm:inline text-xs text-slate-500">
          {{ paginacion.total }} libro(s) encontrado(s)
        </p>
      </div>

      <!-- Contenedor principal -->
      <div class="flex flex-1 gap-4">
        <!-- Sidebar lateral -->
        <SidebarFiltros
          v-if="showFiltros"
          v-model:visible="showFiltros"
          @limpiar="limpiarFiltros"
          :carreras="carreras"
          :autores="autores"
          :filtros="filtros"
          @update-filtros="onUpdateFiltros"
        />

        <!-- Listado ocupa el resto -->
        <div class="flex-1">
          <ListaLibros
            :libros="libros"
            :paginacion="paginacion"
            @cambiarPagina="(nuevaPagina) => actualizarPagina(nuevaPagina)"
            @cambiarLimite="(nuevoLimite) => actualizarLimite(nuevoLimite)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCatalogBibliotecaStore } from '@/stores/catalog'

// 🧩 Componentes
import BuscadorLibros from '@/components/biblioteca/BuscadorLibros.vue'
import ListaLibros from '@/components/biblioteca/ListaLibros.vue'
import SidebarFiltros from '@/components/biblioteca/SidebarFiltros.vue'

// 🌐 API
import { getBiblioteca } from '@/data/api'

const router = useRouter()
const route = useRoute()

// 🧠 Estado reactivo
const filtros = ref({
  autores: route.query.autor ? route.query.autor.split(',') : [],
  carreras: route.query.carrera ? route.query.carrera.split(',') : [],
  busqueda: route.query.busqueda || '',
})

const catalog = useCatalogBibliotecaStore()
const autores = computed(() => catalog.autores)
const carreras = computed(() => catalog.carreras)

const libros = ref([])
const paginacion = ref({
  pagina_actual: 1,
  limite: 10,
  total: 0,
  total_paginas: 0,
})

const showFiltros = ref(false)

// 🚀 Cargar datos iniciales
onMounted(async () => {
  await catalog.load()
  await fetchLibros()
})

//  Obtener libros desde API
const fetchLibros = async () => {
  try {
    const data = await getBiblioteca({
      pagina: paginacion.value.pagina_actual,
      limite: paginacion.value.limite,
      filtros: filtros.value,
    })
    libros.value = data.libros.data || []
    paginacion.value.pagina_actual = data.libros.paginacion.pagina
    paginacion.value.limite = data.libros.paginacion.limite
    paginacion.value.total = data.libros.paginacion.total
    paginacion.value.total_paginas = data.libros.paginacion.total_paginas
  } catch (err) {
    console.error('Error al cargar libros:', err)
  }
}

// 🔄 Cuando el Sidebar emite nuevos filtros
const onUpdateFiltros = (val) => {
  if (JSON.stringify(filtros.value) === JSON.stringify(val)) return

  filtros.value = val

  // Actualizar query params en la URL
  router.replace({
    path: route.path,
    query: {
      carrera: val.carreras?.length ? val.carreras.join(',') : undefined,
      autor: val.autores?.length ? val.autores.join(',') : undefined,
      busqueda: val.busqueda || undefined,
      pagina: 1,
    },
  })
}

// 📄 Cambiar de página
const actualizarPagina = (nuevaPagina) => {
  router.replace({ query: { ...route.query, pagina: nuevaPagina } })
}

// 🔢 Cambiar límite por página
const actualizarLimite = (nuevoLimite) => {
  router.replace({ query: { ...route.query, limite: nuevoLimite, pagina: 1 } })
}

// 👀 Vigilar cambios en la URL y actualizar datos
watch(
  () => route.query,
  async (query) => {
    let carreras_filtro = []
    let carreras_encontradas = query.carrera ? query.carrera.split(',') : []
    for (let index in carreras_encontradas) {
      let carrera_encontrada = carreras.value.find(
        (c) => c.slug_carrera == carreras_encontradas[index],
      )
      carreras_filtro.push(carrera_encontrada['id_carrera'])
    }
    filtros.value = {
      carreras: carreras_filtro,
      autores: query.autor ? query.autor.split(',') : [],
      busqueda: query.busqueda || '',
    }
    paginacion.value.pagina_actual = Number(query.pagina) || 1
    paginacion.value.limite = Number(query.limite) || 10
    await fetchLibros()
  },
  { immediate: true },
)

// 🎚 Control de sidebar
function toggleFiltros() {
  showFiltros.value = !showFiltros.value
}

// 🧹 Limpiar filtros
function limpiarFiltros() {
  filtros.value = { autores: [], carreras: [], busqueda: '' }
  router.replace({ path: route.path })
}
</script>
