<template class="h-full">
  <div class="flex">
    <FiltrosLibros :filtros="filtros" class="lg:w-1/4" />
    <ListaLibros :filtros="filtros" class="lg:w-3/4" />
  </div>
</template>
<script setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import FiltrosLibros from '@/components/libros/FiltrosLibros.vue'
import ListaLibros from '@/components/libros/ListaLibros.vue'

const route = useRoute()

const filtros = ref({
  carreras: [],
  autores: [],
  busqueda: '',
})

watchEffect(() => {
  filtros.value = {
    carreras: route.query.carrera ? route.query.carrera.split(',').map(Number) : [],
    autores: route.query.autor ? route.query.autor.split(',').map(Number) : [],
    busqueda: route.query.busqueda || '',
  }
})
</script>
