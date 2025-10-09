<template>
  <div class="py-4">
    <div class="flex justify-center">
      <input
        v-model="buscadorLibros"
        type="text"
        name="buscador-libros"
        id="buscador-libros"
        class="bg-gray-100 text-gray-900 rounded-full p-2 w-3/4"
        placeholder="Ingrese un libro a buscar.."
        @keydown.enter="buscarLibro"
      />
    </div>
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
