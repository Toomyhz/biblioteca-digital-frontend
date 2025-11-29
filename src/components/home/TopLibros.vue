<template>
  <section class="bg-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <!-- Header -->
      <header class="mb-6">
        <h2 class="text-xl sm:text-2xl font-semibold text-slate-900">Libros recientes</h2>
        <p class="text-sm text-slate-600 mt-1">
          Últimas incorporaciones a nuestra biblioteca digital
        </p>
      </header>

      <!-- Loading State -->
      <div v-if="cargando" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 text-sm">{{ error }}</p>
      </div>

      <!-- Libros Grid -->
      <div
        v-else-if="libros && libros.length > 0"
        class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-5"
      >
        <article
          v-for="(libro, index) in libros"
          :key="libro.id_libro"
          class="group cursor-pointer"
          @click="irALibro(libro.slug_titulo)"
        >
          <!-- Portada -->
          <div
            class="relative aspect-[2/3] rounded-lg overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-md transition-all"
          >
            <img
              :src="
                libro.archivo_portada
                  ? `${DO_URL}${libro.archivo_portada}`
                  : '/LIBRO_SIN_PORTADA.png'
              "
              :alt="`Portada de ${libro.titulo}`"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              :loading="index < 4 ? 'eager' : 'lazy'"
            />

            <!-- Badge de nuevo -->
            <div v-if="esReciente(libro.fecha_creacion)" class="absolute top-1.5 right-1.5">
              <span
                class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-green-100 text-green-800"
              >
                Nuevo
              </span>
            </div>
          </div>

          <!-- Info del libro -->
          <div class="mt-2.5 space-y-0.5">
            <h3
              class="text-xs font-medium text-slate-900 line-clamp-2 group-hover:text-blue-900 transition-colors leading-tight"
            >
              {{ libro.titulo }}
            </h3>

            <!-- Autores -->
            <p
              v-if="libro.autores && libro.autores.length > 0"
              class="text-[10px] text-slate-500 line-clamp-1"
            >
              {{ mostrarAutores(libro.autores) }}
            </p>
            <p v-else class="text-[10px] text-slate-400 italic">Sin autor</p>

            <!-- Año de publicación -->
            <p v-if="libro.anio_publicacion" class="text-[10px] text-slate-400">
              {{ libro.anio_publicacion }}
            </p>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-slate-500 text-sm">No hay libros recientes disponibles</p>
      </div>

      <!-- Ver más -->
      <div v-if="libros && libros.length > 0" class="mt-8 text-center">
        <router-link
          to="/biblioteca"
          class="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
        >
          Ver todos los libros
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getLibrosRecientes, DO_URL } from '@/data/api'

const router = useRouter()
const libros = ref([])
const cargando = ref(true)
const error = ref(null)

const obtenerLibrosRecientes = async () => {
  try {
    cargando.value = true
    error.value = null

    const response = await getLibrosRecientes(6) // Cantidad de libros, 6 por defecto

    if (response.data && Array.isArray(response.data)) {
      libros.value = response.data
    } else if (Array.isArray(response)) {
      libros.value = response
    } else {
      libros.value = []
    }
  } catch (err) {
    console.error('Error al obtener libros recientes:', err)
    error.value = 'No se pudieron cargar los libros recientes'
  } finally {
    cargando.value = false
  }
}

const mostrarAutores = (autores) => {
  if (!autores || !Array.isArray(autores)) return ''
  return autores.map((a) => a.nombre_completo).join(', ')
}

const irALibro = (slug) => {
  if (slug) {
    router.push(`/biblioteca/${slug}`)
  }
}

const esReciente = (fechaCreacion) => {
  if (!fechaCreacion) return false

  try {
    const fecha = new Date(fechaCreacion)
    const ahora = new Date()
    const diasDiferencia = (ahora - fecha) / (1000 * 60 * 60 * 24)
    return diasDiferencia <= 7
  } catch (err) {
    return false & err
  }
}

onMounted(() => {
  obtenerLibrosRecientes()
})
</script>
