<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h3 class="mb-4 text-xl font-semibold text-gray-800">
      {{ modoEdicion ? 'Editar Autor' : 'Agregar Autor' }}
    </h3>

    <div class="flex flex-wrap gap-2 mb-4">
      <input
        v-model="nombre"
        placeholder="Nombre del autor"
        @keyup.enter="submitAutor"
        :disabled="cargando"
        class="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <input
        v-model="nacionalidad"
        placeholder="Nacionalidad"
        @keyup.enter="submitAutor"
        :disabled="cargando"
        class="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <button
        @click="submitAutor"
        :disabled="cargando || !nombre.trim()"
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

    <h4 class="mt-8 mb-4 text-lg font-semibold text-gray-700">Autores ({{ autores.length }})</h4>

    <ul v-if="autores.length > 0" class="divide-y divide-gray-200">
      <li
        v-for="autor in autores"
        :key="autor.id_autor"
        :class="[
          'flex justify-between items-center p-4 gap-4 hover:bg-gray-50',
          autorEditando === autor.id_autor ? 'bg-blue-50 border-l-4 border-blue-400' : '',
        ]"
      >
        <div class="flex flex-col gap-1 flex-1">
          <span class="font-medium text-gray-800">{{ autor.nombre_completo }}</span>
          <span class="text-sm text-gray-600">{{ autor.nacionalidad || 'Sin nacionalidad' }}</span>
        </div>
        <div class="flex gap-2">
          <button
            @click="editarAutor(autor)"
            :disabled="cargando"
            class="px-3 py-1.5 rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
          >
            Editar
          </button>
          <button
            @click="confirmarEliminar(autor)"
            :disabled="cargando"
            class="px-3 py-1.5 rounded text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-60"
          >
            Eliminar
          </button>
        </div>
      </li>
    </ul>
    <p v-else class="text-gray-500 italic text-center py-8 bg-gray-50 rounded">
      No hay autores registrados
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
          ¿Estás seguro de que deseas eliminar al autor
          <strong>{{ autorAEliminar?.nombre_completo }}</strong
          >?
        </p>
        <p class="mt-2 text-sm italic text-red-600">Esta acción no se puede deshacer.</p>
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="cerrarModal"
            :disabled="cargando"
            class="px-4 py-2 rounded font-medium text-white bg-gray-600 hover:bg-gray-700 disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            @click="eliminarAutor"
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
  agregarAutor,
  getAutores,
  actualizarAutor,
  eliminarAutor as eliminarAutorAPI,
} from '@/data/api'

const nombre = ref('')
const nacionalidad = ref('')
const autores = ref([])
const mensaje = ref('')
const mensajeTipo = ref('info')
const cargando = ref(false)
const modoEdicion = ref(false)
const autorEditando = ref(null)
const mostrarModalEliminar = ref(false)
const autorAEliminar = ref(null)

const cargarAutores = async () => {
  try {
    autores.value = await getAutores()
  } catch (err) {
    console.error('Error cargando autores:', err)
    mostrarMensaje('Error al cargar la lista de autores', 'error')
  }
}

const submitAutor = async () => {
  if (!nombre.value.trim()) {
    mostrarMensaje('El nombre del autor es obligatorio', 'error')
    return
  }

  cargando.value = true
  mensaje.value = ''

  const datosAutor = {
    nombre: nombre.value.trim(),
    nacionalidad: nacionalidad.value.trim() || '',
  }

  try {
    if (modoEdicion.value) {
      // Actualizar autor existente
      const res = await actualizarAutor(autorEditando.value, datosAutor)
      mostrarMensaje(res.mensaje || 'Autor actualizado exitosamente', 'success')
    } else {
      // Agregar nuevo autor
      const res = await agregarAutor(datosAutor)
      mostrarMensaje(res.mensaje || 'Autor agregado exitosamente', 'success')
    }

    limpiarFormulario()
    await cargarAutores()
  } catch (err) {
    console.error('Error:', err)
    const errorMsg =
      err.response?.data?.error || err.response?.data?.mensaje || 'Error al procesar la solicitud'
    mostrarMensaje(errorMsg, 'error')
  } finally {
    cargando.value = false
  }
}

const editarAutor = (autor) => {
  modoEdicion.value = true
  autorEditando.value = autor.id_autor
  nombre.value = autor.nombre_completo
  nacionalidad.value = autor.nacionalidad || ''

  // Scroll al formulario
  window.scrollTo({ top: 0, behavior: 'smooth' })

  mostrarMensaje(`Editando: ${autor.nombre_completo}`, 'info')
}

const cancelarEdicion = () => {
  limpiarFormulario()
  mostrarMensaje('Edición cancelada', 'info')
}

const confirmarEliminar = (autor) => {
  autorAEliminar.value = autor
  mostrarModalEliminar.value = true
}

const eliminarAutor = async () => {
  if (!autorAEliminar.value) return

  cargando.value = true

  try {
    const res = await eliminarAutorAPI(autorAEliminar.value.id_autor)
    mostrarMensaje(res.mensaje || 'Autor eliminado exitosamente', 'success')
    await cargarAutores()
    cerrarModal()
  } catch (err) {
    console.error('Error eliminando autor:', err)
    const errorMsg =
      err.response?.data?.error || err.response?.data?.mensaje || 'Error al eliminar el autor'
    mostrarMensaje(errorMsg, 'error')
  } finally {
    cargando.value = false
  }
}

const cerrarModal = () => {
  mostrarModalEliminar.value = false
  autorAEliminar.value = null
}

const limpiarFormulario = () => {
  nombre.value = ''
  nacionalidad.value = ''
  modoEdicion.value = false
  autorEditando.value = null
}

const mostrarMensaje = (texto, tipo = 'info') => {
  mensaje.value = texto
  mensajeTipo.value = tipo

  // Auto-ocultar mensajes de éxito después de 3 segundos
  if (tipo === 'success') {
    setTimeout(() => {
      mensaje.value = ''
    }, 3000)
  }
}

onMounted(() => {
  cargarAutores()
})
</script>
