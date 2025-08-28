<template>
  <div class="h-full">
    <h1 class="text-2xl mb-4">Agregar Libro</h1>
    <div class="items-start mt-8">
      <div class="flex gap-2 items-center">
        <input
          v-model="isbn"
          type="text"
          id="isbn-libro"
          placeholder="Buscar por ISBN"
          class="p-2 border border-white rounded-md bg-[#2b2b2b] text-white focus:outline-0 focus:border-[#4a90e2] disabled:opacity-50"
          :disabled="isLoading"
        />
        <button
          @click="buscarPorIsbn"
          :disabled="isLoading || !isbn"
          class="p-2 rounded-md bg-[#4a90e2] text-white hover:bg-[#3b78c2] transition disabled:opacity-50"
        >
          <span v-if="!isLoading">Buscar</span>
          <span v-else>Cargando...</span>
        </button>
      </div>
      <form
        action="http://localhost:5000/api/books/agregar"
        method="post"
        enctype="multipart/form-data"
      >
        <fieldset class="flex flex-col">
          <div class="form-card bg-[#120047] rounded-lg shadow-md p-4 text-[#eaeaea]">
            <div class="flex w-xl justify-between items-center m-4">
              <div class="flex flex-col w-full m-2">
                <label for="titulo-libro">Titulo del Libro:</label>
                <input
                  type="text"
                  name="titulo-libro"
                  id="titulo-libro"
                  required
                  class="p-2 border border-white rounded-md bg-[#2b2b2b] text-white focus:outline-0 focus:border-[#4a90e2]"
                />
              </div>
              <div class="flex flex-col w-full m-2">
                <label for="autor-libro">Autor del Libro:</label>
                <input
                  type="text"
                  name="autor-libro"
                  id="autor-libro"
                  required
                  class="p-2 border border-white rounded-md bg-[#2b2b2b] text-white focus:outline-0 focus:border-[#4a90e2]"
                />
              </div>
              <div class="flex flex-col w-full m-2">
                <label for="descripcion-libro"> Descripción del Libro:</label>
                <textarea
                  name="descripcion-libro"
                  id="descripcion-libro"
                  required
                  class="p-2 border border-white rounded-md bg-[#2b2b2b] text-white focus:outline-0 focus:border-[#4a90e2]"
                />
              </div>
            </div>
            <div class="flex w-xl justify-between items-center m-4">
              <div class="flex flex-col w-full m-2">
                <label for="carrera-libro">Carrera asociada:</label>
                <select
                  name="carrera-libro"
                  id="carrera-libro"
                  class="p-2 border border-white rounded-md bg-[#2b2b2b] text-white focus:outline-0 focus:border-[#4a90e2]"
                  multiple
                  size="3"
                >
                  <option v-for="carrera in carreras" :key="carrera.id">
                    {{ carrera.nombre }}
                  </option>
                </select>
              </div>
              <div class="flex flex-col w-full m-2">
                <label for="anio-libro">Año de Publicación:</label>
                <input
                  type="number"
                  name="anio-libro"
                  id="anio-libro"
                  required
                  class="p-2 border border-white rounded-md bg-[#2b2b2b] text-white focus:outline-0 focus:border-[#4a90e2]"
                />
              </div>
            </div>
            <div class="flex w-xl justify-between items-center m-4">
              <div class="flex flex-col w-full m-2">
                <label for="estado-libro">Estado del libro:</label>
                <select
                  name="estado-libro"
                  id="estado-libro"
                  class="p-2 border border-white rounded-md bg-[#2b2b2b] text-white focus:outline-0 focus:border-[#4a90e2]"
                >
                  <option value="disponible">Disponible</option>
                  <option value="no-disponible">No Disponible</option>
                </select>
              </div>
              <div class="flex flex-col w-full m-2">
                <label for="enlace-libro">Enlace Libro:</label>
                <input
                  type="text"
                  name="enlace-libro"
                  id="enlace-libro"
                  class="p-2 border border-white rounded-md bg-[#2b2b2b] text-white focus:outline-0 focus:border-[#4a90e2]"
                />
              </div>
              <img src="" alt="libro" id="imagen-libro" referrerpolicy="no-referrer" />
            </div>
            <div class="flex justify-around w-xl m-4">
              <button
                type="submit"
                class="btn bg-[#0e7900] flex w-20 justify-center items-center p-[10px] rounded-lg cursor-pointer hover:bg-[#2e532b] transition duration-300 ease-in-out"
              >
                Enviar
              </button>
              <button
                type="reset"
                class="btn bg-[#790000] flex w-20 justify-center items-center p-[10px] rounded-lg cursor-pointer hover:bg-[#512c2c] transition duration-300 ease-in-out"
              >
                Limpiar
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { buscarIsbn } from '@/data/googleBooks'
import { getCarreras } from '@/data/api'

const carreras = ref([])
const isbn = ref('')
const isLoading = ref(false)

onMounted(async () => {
  try {
    carreras.value = await getCarreras()
  } catch (err) {
    console.error('Error al cargar las carreras:', err.message)
  }
})

async function buscarPorIsbn() {
  if (!isbn.value.trim()) return

  isLoading.value = true
  try {
    const libro = await buscarIsbn(isbn.value.trim())
    console.log('Libro encontrado:', libro)
    llenarFormulario(libro)
  } catch (err) {
    console.error(err.message)
  } finally {
    isLoading.value = false
  }
}

function llenarFormulario(libro) {
  document.getElementById('titulo-libro').value = libro.titulo || ''
  document.getElementById('autor-libro').value = libro.autores
  document.getElementById('anio-libro').value = libro.fecha_publicacion
    ? libro.fecha_publicacion.split('-')[0]
    : ''
  document.getElementById('estado-libro').value = 'disponible' // Asignar estado por defecto
  document.getElementById('descripcion-libro').value = libro.descripcion || ''
  document.getElementById('imagen-libro').src = libro.imagen || '/LIBRO_SIN_PORTADA.png'
}
</script>
