<template>
  <div class="lg:w-auto md:p-0">
    <div class="p-1 text-white md:hidden sticky top-0 z-5">
      <button @click="panelAbierto = !panelAbierto" class="bg-blue-950 rounded-md px-4 py-2">
        ☰
      </button>
    </div>

    <aside
      :class="[
        'fixed top-0 left-0 h-full w-64 bg-blue-950 text-white p-4 shadow-lg transition-transform duration-300 md:relative md:w-76 md:block md:bg-transparent md:shadow-none',
        panelAbierto ? 'translate-x-0 z-20' : '-translate-x-full md:translate-x-0',
      ]"
    >
      <button @click="panelAbierto = false" class="absolute top-4 right-4 text-white md:hidden">
        ✖
      </button>
      <div class="bg-blue-950 text-white p-2 lg:block rounded-xl">
        <div class="flex justify-center items-center">
          <p class="text-lg">Filtros</p>
          <button v-if="props.filtros">Limpiar Filtros</button>
        </div>
        <!-- CARRERAS -->
        <div class="border rounded p-1 md:border-0 md:p-0">
          <div class="flex justify-between items-center border-b-1">
            <p class="text-lg">Carreras</p>

            <p>{{}}</p>
            <button @click="mostrarCarreras = !mostrarCarreras">Mostrar</button>
          </div>
          <ul
            :class="[
              'transition-all duration-250 ease-in-out',
              mostrarCarreras ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
            ]"
            class="overflow-hidden"
          >
            <li
              v-for="carrera in carreras"
              :key="carrera.id_carrera"
              class="flex justify-between items-center h-8 hover:bg-blue-700 cursor-pointer"
            >
              <input
                :id="`carrera_${carrera.id_carrera}`"
                type="checkbox"
                :value="carrera.id_carrera"
                class="accent-blue-600 w-4 h-4 rounded-full border-gray-300"
              />
              <label
                :for="`carrera_${carrera.id_carrera}`"
                class="flex justify-between items-center w-full cursor-pointer"
              >
                <span>{{ carrera.nombre_carrera }}</span>
              </label>
            </li>
          </ul>
        </div>
        <!-- AUTORES  -->
        <div class="border rounded p-1 md:border-0 md:p-0">
          <div class="flex justify-between items-center border-b-1">
            <p class="text-lg">Autores</p>
            <button @click="mostrarAutores = !mostrarAutores">Mostrar</button>
          </div>
          <div
            :class="[
              'transition-all duration-250 ease-in-out',
              mostrarAutores ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
            ]"
            class="overflow-hidden md:py-1"
          >
            <!-- <input
              v-model="buscadorAutor"
              type="text"
              placeholder="Buscar autor"
              class="w-full h-8 rounded-md border-1 border-gray-300 focus:outline-none focus:border-blue-500 px-2 mb-2"
            /> -->
            <ul>
              <li
                v-for="autor in filteredAutores"
                :key="autor.id_autor"
                class="flex justify-between items-center h-8 hover:bg-blue-700 cursor-pointer"
              >
                <!-- <input
                  :id="`autor_${autor.id_autor}`"
                  type="checkbox"
                  :value="autor.id_autor"
                  v-model="autoresSeleccionados"
                  class="accent-blue-600 w-4 h-4 rounded-full border-gray-300"
                /> -->
                <label
                  :for="`autor_${autor.id_autor}`"
                  class="flex justify-between items-center w-full cursor-pointer"
                >
                  <span>{{ autor.nombre_completo }}</span>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCarreras, getAutores } from '@/data/api'

const props = defineProps({
  filtros: {
    type: Object,
    required: true,
  },
})

const route = useRoute()
const router = useRouter()
const carreras = ref([])
const autores = ref([])

onMounted(async () => {
  autores.value = await getAutores()
  carreras.value = await getCarreras()
})

// =====Carreras=====
const carrerasSeleccionadas = ref([])
// onMounted(() => {
//   if (route.query.carrera) {
//     carrerasSeleccionadas.value = route.query.carrera.split(',')
//   }
// })

watch(carrerasSeleccionadas, (newValue) => {
  const query = {
    ...route.query,
  }

  if (newValue.length > 0) {
    query.carrera = newValue.join(',')
  } else {
    delete query.carrera
  }
  router.replace({ path: '/biblioteca', query })
})

const mostrarCarreras = ref(true)

// =====Autores=====
const autoresSeleccionados = ref([])

// onMounted(() => {
//   if (route.query.autor) {
//     autoresSeleccionados.value = route.query.autor.split(',')
//   }
// })
watch(autoresSeleccionados, (newValue) => {
  const query = {
    ...route.query,
  }

  if (newValue.length > 0) {
    query.autor = newValue.join(',')
  } else {
    delete query.autor
  }
  router.replace({ path: '/biblioteca', query })
})

// Variable para el buscador de autores
// const buscadorAutor = ref('')

const filteredAutores = autores

const mostrarAutores = ref(true)

watchEffect(() => {
  if (route.query.busqueda) {
    carrerasSeleccionadas.value = [] // Borra selección cuando hay búsqueda activa
    autoresSeleccionados.value = []
  }
})

const panelAbierto = ref(false)
</script>
