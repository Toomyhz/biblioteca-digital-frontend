<template>
  <div class="text-black w-screen md:w-auto">
    <h1 class="text-2xl mb-4">Libros</h1>
    <div class="py-5">
      <div class="flex mb-4 group">
        <label
          for="buscador-libros"
          class="px-4 py-2 bg-gray-200 rounded-s-full flex items-center justify-center text-sm text-black"
        >
          Buscar Libro
        </label>
        <input
          id="buscador-libros"
          type="text"
          placeholder="Escribir un título, por ejemplo: 'Cosmos'"
          class="bg-white rounded-e-full px-4 py-2 w-1/3 border border-gray-300 focus:outline-none"
        />
      </div>
    </div>
    <div class="overflow-x-auto rounded-lg shadow-md">
      <table class="md:min-w-full divide-y divide-gray-200 bg-white text-sm">
        <thead class="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th class="px-2 md:px-6 py-3 text-left"><strong>Título</strong></th>
            <th class="px-2 md:px-6 py-3 text-left hidden md:table-cell">Autor</th>
            <th class="px-2 md:px-6 py-3 text-left hidden md:table-cell">Carrera</th>
            <th class="px-2 md:px-6 py-3 text-left hidden md:table-cell">Disponibilidad</th>
            <th class="px-2 md:px-6 py-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="libro in libros" :key="libro.id" class="hover:bg-gray-50">
            <td class="px-2 md:px-6 py-4">{{ libro.titulo }}</td>
            <td class="px-2 md:px-6 py-4 hidden md:table-cell">
              {{ libro.nombre_autor }}
            </td>
            <td class="px-2 md:px-6 py-4 hidden md:table-cell">{{ libro.nombre_carrera }}</td>
            <td
              class="px-2 md:px-6 py-4 font-semibold hidden md:table-cell"
              :class="libro.estado === 'Disponible' ? 'text-green-600' : 'text-red-600'"
            >
              {{ libro.estado }}
            </td>
            <td class="px-2 md:px-2 py-4 flex w-40 justify-between">
              <button class="w-15 hover:text-indigo-900 bg-amber-400">Editar</button>
              <button class="w-15 hover:text-red-900 bg-red-700">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex gap-4 mt-4">
      <div class="flex items-center gap-2 border rounded">
        <button
          @click="pagina_actual--"
          :disabled="pagina_actual === 1"
          class="p-1 bg-blue-950 text-white transition-all duration-200 ease-in-out hover:bg-blue-900"
        >
          Anterior
        </button>
        <span>Página {{ pagina_actual }}</span>
        <button
          @click="pagina_actual++"
          :disabled="libros.length < libros_por_pagina"
          :class="{
            'p-1 bg-blue-950 text-white transition-all duration-200 ease-in-out hover:bg-blue-900': true,
            'bg-gray-400 opacity-50 cursor-not-allowed hover:bg-gray-400':
              libros.length < libros_por_pagina,
          }"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getLibros, getAutores } from '@/data/api'
import { ref, onMounted, watch } from 'vue'

const pagina_actual = ref(1)
const libros_por_pagina = ref(10)
const libros = ref([])
const autores = ref([])

const cargando = ref(false)

onMounted(async () => {
  await actualizarLibros()
  await cargarAutores()
  libros.value = await getLibros()
})

const actualizarLibros = async () => {
  cargando.value = true
  try {
    libros.value = getLibros({
      page: pagina_actual.value,
      limit: libros_por_pagina.value,
    })
    console.log('Libros:', libros.value)
  } catch (error) {
    console.error('Error obteniendo libros:', error)
  } finally {
    cargando.value = false
  }
}

const cargarAutores = async () => {
  cargando.value = true
  try {
    autores.value = await getAutores()
  } catch (error) {
    console.error('Error obteniendo autores:', error)
  } finally {
    cargando.value = false
  }
}

watch(pagina_actual, () => {
  libros.value = []
  actualizarLibros()
})
watch(libros_por_pagina, () => {
  pagina_actual.value = 1
  libros.value = []
  actualizarLibros()
})
</script>
<style scoped></style>
