<template>
  <div class="relative h-50 md:h-75 bg-[url('/biblioteca_header.webp')] bg-cover bg-center bg">
    <div class="absolute inset-0 bg-blue-950/60"></div>
    <div class="relative flex-col justify-center">
      <h2 class="text-4xl md:text-5xl text-center p-8 text-white"><b>Catálogo Digital</b></h2>
      <div class="flex w-full justify-center">
        <div class="relative w-9/12 md:w-2/5">
          <input
            v-model="buscadorLibros"
            type="text"
            placeholder="Buscar todo"
            class="w-full h-10 pl-4 pr-4 rounded-full bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keydown.enter="buscarLibro"
          />
          <button
            @click="buscarLibro"
            class="absolute inset-y-0 right-0 flex items-center w-15 text-gray-500 hover:text-gray-700 rounded-full hover:bg-blue-950/40"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-full"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const buscadorLibros = ref('')
const router = useRouter()
const buscarLibro = () => {
  // Evitar la búsqueda si el campo está vacío
  if (buscadorLibros.value.trim() === '') {
    router.push({ path: '/biblioteca' })
  } else {
    const query = buscadorLibros.value.trim()
    if (query) {
      router.push({ path: '/biblioteca', query: { busqueda: query } })
    }
  }
}
</script>
