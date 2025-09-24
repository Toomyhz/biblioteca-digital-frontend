<script setup>
import { onMounted, ref } from 'vue'
import { getLibro } from '@/data/api'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const libro = ref(null)

onMounted(async () => {
  const libroCargado = await getLibro(Number(route.params.id))
  libro.value = libroCargado
  console.log('Libro cargado:', libro.value) // ✅ DEBUG
})

const abrirLector = () => {
  console.log('Botón Leer clickeado') // ✅ DEBUG
  if (libro.value && libro.value.archivo) {
    const rutaCompleta = `/public/${libro.value.archivo}`
    console.log('Ruta del PDF:', rutaCompleta) // ✅ DEBUG

    router.push({
      name: 'lector',
      params: { archivo: rutaCompleta }
    })
  } else {
    console.log('No hay archivo PDF definido') // ✅ DEBUG
  }
}
</script>

<template>
  <div v-if="libro">
    <div>
      <section class="flex flex-col md:flex-row w p-3">
        <div class="w-full md:w-1/4 md:min-w-[10rem]">
          <div class="flex h-full justify-center items-center">
            <img
              :src="libro.portada ? libro.portada : '/LIBRO_SIN_PORTADA.png'"
              alt=""
              class="h-44 md:h-[30rem]"
            />
          </div>
        </div>
        <div class="flex flex-col p-3 w-full md:w-3/4">
          <h1 class="text-3xl">{{ libro.titulo }}</h1>
          <p class="text-xl text-blue-950">{{ libro.nombre_autor }}</p>
          <div class="text-blue-950 text-xl flex justify-between w-60">
            <button
              @click="abrirLector"
              class="w-24 border-4 border-blue-950 hover:bg-blue-950 hover:text-white transition-all duration-200"
              :disabled="!libro.archivo"
            >
              Leer
            </button>
            <button>Guardar</button>
          </div>
          <div>
            <p class="text-lg">
              {{ libro.sinopsis }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
  <div v-else>
    <p>Cargando libro...</p>
  </div>
</template>
