<template>
  <div class="w-full">
    <form @submit.prevent="buscarLibro">
      <div
        class="relative flex items-center bg-white border border-slate-300 rounded-full shadow-sm px-3 py-1.5"
      >
        <input
          v-model="buscadorLibros"
          type="text"
          name="buscador-libros"
          id="buscador-libros"
          class="bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base flex-1 focus:outline-none"
          placeholder="Buscar por título, autor o carrera..."
        />
        <button
          type="submit"
          class="ml-2 px-3 py-1.5 text-xs sm:text-sm rounded-full bg-blue-900 text-white hover:bg-slate-800 transition-colors"
        >
          Buscar
        </button>
      </div>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
