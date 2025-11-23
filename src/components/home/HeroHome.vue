<template>
  <section class="relative overflow-hidden">
    <div
      class="relative min-h-[260px] md:min-h-[320px] bg-[url('/biblioteca_header.webp')] bg-cover bg-center"
    >
      <!-- Capa oscura -->
      <div class="absolute inset-0 bg-slate-950/70"></div>

      <!-- Contenido -->
      <div
        class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col gap-6"
      >
        <!-- Texto -->
        <div class="max-w-xl">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight">
            Catálogo digital
          </h1>
          <p class="mt-3 text-sm sm:text-base text-slate-200">
            Explora los libros digitalizados que la biblioteca UMCE ofrece.
          </p>
        </div>

        <!-- Buscador principal -->
        <div class="w-full sm:max-w-xl">
          <form @submit.prevent="buscarLibro">
            <div
              class="relative flex items-center bg-white border border-slate-200 rounded-full shadow-md px-3 py-1.5"
            >
              <input
                v-model="buscadorLibros"
                type="text"
                placeholder="Buscar en la biblioteca digital..."
                class="bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base flex-1 focus:outline-none"
              />
              <button
                type="submit"
                class="ml-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full bg-blue-900 text-white hover:bg-slate-800 transition-colors"
              >
                Buscar
              </button>
            </div>
          </form>
          <p class="mt-2 text-[11px] sm:text-xs text-slate-200">
            Presiona Enter para ver los resultados en la biblioteca.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const buscadorLibros = ref('')
const router = useRouter()

const buscarLibro = () => {
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
