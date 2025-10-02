<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h3 class="mb-4 text-xl font-semibold text-gray-800">
      {{ modoEdicion ? 'Editar Carrera' : 'Agregar Carrera' }}
    </h3>

    <div class="flex flex-wrap gap-2 mb-4">
      <input
        v-model="nombreCarrera"
        placeholder="Nombre de la carrera"
        @keyup.enter="submitCarrera"
        :disabled="cargando"
        class="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <button
        @click="submitCarrera"
        :disabled="cargando || !nombreCarrera.trim()"
        class="px-4 py-2 rounded font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {{ cargando ? 'Procesando...' : modoEdicion ? 'Actualizar' : 'Agregar' }}
      </button>
      <button
        v-if="modoEdicion"
        @click="cancelarEdicion"
        :disabled="cargando"
        class="px-4 py-2 rounded font-medium text-white bg-gray-600 hover:bg-gray-700 disabled:opacity-60"
      >
        Cancelar
      </button>
    </div>

    <p
      v-if="mensaje"
      :class="{
        'text-green-800 bg-green-100 border border-green-300 px-3 py-2 rounded mb-4':
          mensajeTipo === 'success',
        'text-red-800 bg-red-100 border border-red-300 px-3 py-2 rounded mb-4':
          mensajeTipo === 'error',
        'text-blue-800 bg-blue-100 border border-blue-300 px-3 py-2 rounded mb-4':
          mensajeTipo === 'info',
      }"
    >
      {{ mensaje }}
    </p>

    <h4 class="mt-8 mb-4 text-lg font-semibold text-gray-700">Carreras ({{ carreras.length }})</h4>

    <ul v-if="carreras.length > 0" class="divide-y divide-gray-200">
      <li
        v-for="carrera in carreras"
        :key="carrera.id_carrera"
        :class="[
          'flex justify-between items-center p-4 gap-4 hover:bg-gray-50',
          carreraEditando === carrera.id_carrera ? 'bg-blue-50 border-l-4 border-blue-400' : '',
        ]"
      >
        <div class="flex flex-col gap-1 flex-1">
          <span class="font-medium text-gray-800">{{ carrera.nombre_carrera }}</span>
        </div>
        <div class="flex gap-2">
          <button
            @click="editarCarrera(carrera)"
            :disabled="cargando"
            class="px-3 py-1.5 rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
          >
            Editar
          </button>
          <button
            @click="confirmarEliminar(carrera)"
            :disabled="cargando"
            class="px-3 py-1.5 rounded text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-60"
          >
            Eliminar
          </button>
        </div>
      </li>
    </ul>
    <p v-else class="text-gray-500 italic text-center py-8 bg-gray-50 rounded">
      {{ cargando ? 'Cargando carreras...' : 'No hay carreras disponibles.' }}
    </p>

    <!-- Modal -->
    <div
      v-if="mostrarModalEliminar"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="cerrarModal"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-[90%]" @click.stop>
        <h3 class="text-lg font-semibold text-gray-800">Confirmar eliminación</h3>
        <p class="mt-4 text-gray-600">
          ¿Estás seguro de que deseas eliminar la carrera
          <strong>{{ carreraAEliminar?.nombre_carrera }}</strong
          >?
        </p>
        <p class="mt-2 text-sm italic text-red-600">
          Esta acción no se puede deshacer. Todos los libros asociados a esta carrera podrían verse
          afectados.
        </p>
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="cerrarModal"
            :disabled="cargando"
            class="px-4 py-2 rounded font-medium text-white bg-gray-600 hover:bg-gray-700 disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            @click="eliminarCarrera"
            :disabled="cargando"
            class="px-4 py-2 rounded font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-60"
          >
            {{ cargando ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  agregarCarrera,
  getCarreras,
  actualizarCarrera,
  eliminarCarrera as eliminarCarreraAPI,
} from '@/data/api'

const nombreCarrera = ref('')
const carreras = ref([])
const mensaje = ref('')
const mensajeTipo = ref('info')
const cargando = ref(false)
const modoEdicion = ref(false)
const carreraEditando = ref(null)
const mostrarModalEliminar = ref(false)
const carreraAEliminar = ref(null)

const cargarCarreras = async () => {
  cargando.value = true
  try {
    carreras.value = await getCarreras()
  } catch (err) {
    console.error('Error cargando carreras:', err)
    mostrarMensaje('Error al cargar la lista de carreras', 'error')
  } finally {
    cargando.value = false
  }
}

const submitCarrera = async () => {
  if (!nombreCarrera.value.trim()) {
    mostrarMensaje('El nombre de la carrera es obligatorio', 'error')
    return
  }

  cargando.value = true
  mensaje.value = ''

  const datosCarrera = {
    nombre: nombreCarrera.value.trim(),
  }

  try {
    if (modoEdicion.value) {
      const res = await actualizarCarrera(carreraEditando.value, datosCarrera)
      mostrarMensaje(res.mensaje || 'Carrera actualizada exitosamente', 'success')
    } else {
      const res = await agregarCarrera(datosCarrera)
      mostrarMensaje(res.mensaje || 'Carrera agregada exitosamente', 'success')
    }

    limpiarFormulario()
    await cargarCarreras()
  } catch (err) {
    console.error('Error:', err)
    const errorMsg =
      err.response?.data?.error || err.response?.data?.mensaje || 'Error al procesar la solicitud'
    mostrarMensaje(errorMsg, 'error')
  } finally {
    cargando.value = false
  }
}

const editarCarrera = (carrera) => {
  modoEdicion.value = true
  carreraEditando.value = carrera.id_carrera
  nombreCarrera.value = carrera.nombre_carrera

  window.scrollTo({ top: 0, behavior: 'smooth' })

  mostrarMensaje(`Editando: ${carrera.nombre_carrera}`, 'info')
}

const cancelarEdicion = () => {
  limpiarFormulario()
  mostrarMensaje('Edición cancelada', 'info')
}

const confirmarEliminar = (carrera) => {
  carreraAEliminar.value = carrera
  mostrarModalEliminar.value = true
}

const eliminarCarrera = async () => {
  if (!carreraAEliminar.value) return

  cargando.value = true

  try {
    const res = await eliminarCarreraAPI(carreraAEliminar.value.id_carrera)
    mostrarMensaje(res.mensaje || 'Carrera eliminada exitosamente', 'success')
    await cargarCarreras()
    cerrarModal()
  } catch (err) {
    console.error('Error eliminando carrera:', err)
    const errorMsg =
      err.response?.data?.error || err.response?.data?.mensaje || 'Error al eliminar la carrera'
    mostrarMensaje(errorMsg, 'error')
  } finally {
    cargando.value = false
  }
}

const cerrarModal = () => {
  mostrarModalEliminar.value = false
  carreraAEliminar.value = null
}

const limpiarFormulario = () => {
  nombreCarrera.value = ''
  modoEdicion.value = false
  carreraEditando.value = null
}

const mostrarMensaje = (texto, tipo = 'info') => {
  mensaje.value = texto
  mensajeTipo.value = tipo

  if (tipo === 'success') {
    setTimeout(() => {
      mensaje.value = ''
    }, 3000)
  }
}

onMounted(() => {
  cargarCarreras()
})
</script>
