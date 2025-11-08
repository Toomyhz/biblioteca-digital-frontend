<template>
  <div class="max-w-[80%] mx-auto flex flex-col">
    <!-- 🔍 Buscador arriba -->
    <BuscadorLibros />

    <!-- Botón de filtros -->
    <div class="mb-4">
      <button @click="toggleFiltros" class="px-4 py-2 bg-gray-300 rounded">
        {{ showFiltros ? 'Ocultar filtros' : 'Mostrar filtros' }}
      </button>
    </div>

    <!--  Contenedor principal -->
    <div class="flex flex-1">
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

      <!--  Listado ocupa el resto -->
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
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 🧩 Componentes
import BuscadorLibros from '@/components/biblioteca/BuscadorLibros.vue'
import ListaLibros from '@/components/biblioteca/ListaLibros.vue'
import SidebarFiltros from '@/components/biblioteca/SidebarFiltros.vue'

// 🌐 API
import { getAutores, getCarreras, getBiblioteca } from '@/data/api'

const router = useRouter()
const route = useRoute()

// 🧠 Estado reactivo
const filtros = ref({
  autores: route.query.autor ? route.query.autor.split(',') : [],
  carreras: route.query.carrera ? route.query.carrera.split(',') : [],
  busqueda: route.query.busqueda || '',
})

const libros = ref([])
const paginacion = ref({
  pagina_actual: 1,
  limite: 10,
  total: 0,
})
const carreras = ref([])
const autores = ref([])
const showFiltros = ref(false)

// 🚀 Cargar datos iniciales
onMounted(async () => {
  autores.value = await getAutores()
  carreras.value = await getCarreras()
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
    libros.value = data.resultados || []
    paginacion.value.total = data.total // <- viene del backend
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
