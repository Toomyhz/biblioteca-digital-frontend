<template class="h-full">
  <div class="flex">
    <FiltrosLibros
      :carreras="carreras"
      :autores="autores"
      :filtros="filtros"
      class="lg:w-1/4"
      @update-filtros="onUpdateFiltros"
    />
    <ListaLibros
      :libros="libros"
      :paginacion="paginacion"
      @cambiarPagina="(nuevaPagina) => actualizarPagina(nuevaPagina)"
      @cambiarLimite="(nuevoLimite) => actualizarLimite(nuevoLimite)"
      class="lg:w-3/4"
    />
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBiblioteca } from '@/data/api'
import FiltrosLibros from '@/components/libros/FiltrosLibros.vue'
import ListaLibros from '@/components/libros/ListaLibros.vue'

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
</script>
