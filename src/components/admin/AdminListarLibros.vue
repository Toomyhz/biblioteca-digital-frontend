<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h3 class="mb-4 text-xl font-semibold text-gray-800">
      {{ modoEdicion ? 'Editar Libro' : 'Agregar Libro' }}
    </h3>

    <!-- Formulario -->
    <div class="bg-gray-50 p-6 rounded-lg mb-6 shadow-sm">
      <div class="flex flex-wrap gap-2 mb-3">
        <input
          v-model="titulo"
          placeholder="Título del libro"
          @keyup.enter="submitLibro"
          :disabled="cargando"
          class="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <input
          v-model="isbn"
          placeholder="ISBN"
          @keyup.enter="submitLibro"
          :disabled="cargando"
          class="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div class="flex flex-wrap gap-2 mb-3">
        <select
          v-model="idAutor"
          :disabled="cargando"
          class="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
        >
          <option value="">Seleccionar autor</option>
          <option v-for="autor in autores" :key="autor.id_autor" :value="autor.id_autor">
            {{ autor.nombre_completo }}
          </option>
        </select>

        <select
          v-model="idCarrera"
          :disabled="cargando"
          class="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
        >
          <option value="">Seleccionar carrera</option>
          <option v-for="carrera in carreras" :key="carrera.id_carrera" :value="carrera.id_carrera">
            {{ carrera.nombre_carrera }}
          </option>
        </select>
      </div>

      <div class="flex flex-wrap gap-2 mb-3">
        <select
          v-model="estado"
          :disabled="cargando"
          class="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
        >
          <option value="disponible">Disponible</option>
          <option value="prestado">Prestado</option>
          <option value="reservado">Reservado</option>
        </select>

        <input
          v-model.number="anioPublicacion"
          type="number"
          placeholder="Año de publicación"
          @keyup.enter="submitLibro"
          :disabled="cargando"
          min="1000"
          max="2100"
          class="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <div class="flex gap-2 mt-4">
        <button
          @click="submitLibro"
          :disabled="cargando || !formularioValido"
          class="px-4 py-2 rounded font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-60"
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
    </div>

    <!-- Mensajes -->
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

    <!-- Buscador -->
    <div class="mb-4">
      <input
        v-model="busqueda"
        type="text"
        placeholder="Buscar por título, autor o ISBN..."
        class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <h4 class="mt-8 mb-4 text-lg font-semibold text-gray-700">
      Libros ({{ librosFiltrados.length }})
    </h4>

    <!-- Tabla -->
    <div class="overflow-x-auto rounded-lg shadow-sm mb-6">
      <table v-if="librosFiltrados.length > 0" class="w-full bg-white border-collapse">
        <thead class="bg-gray-100 border-b border-gray-200">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-600">
              Título
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-600">Autor</th>
            <th class="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-600">
              Carrera
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-600">
              Estado
            </th>
            <th class="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-600">ISBN</th>
            <th class="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="libro in librosPaginados"
            :key="libro.id_libro"
            :class="[
              'border-b border-gray-100 hover:bg-gray-50',
              libroEditando === libro.id_libro ? 'bg-blue-50 border-l-4 border-blue-400' : '',
            ]"
          >
            <td class="px-4 py-2 font-medium text-gray-800">{{ libro.titulo }}</td>
            <td class="px-4 py-2 text-gray-700">{{ libro.nombre_autor || 'Sin autor' }}</td>
            <td class="px-4 py-2 text-gray-700">{{ libro.nombre_carrera || 'Sin carrera' }}</td>
            <td class="px-4 py-2">
              <span
                class="px-2 py-1 rounded-full text-xs font-semibold uppercase"
                :class="{
                  'bg-green-100 text-green-800': libro.estado === 'disponible',
                  'bg-yellow-100 text-yellow-800': libro.estado === 'prestado',
                  'bg-blue-100 text-blue-800': libro.estado === 'reservado',
                }"
              >
                {{ libro.estado }}
              </span>
            </td>
            <td class="px-4 py-2 font-mono text-sm text-gray-600">{{ libro.isbn || 'N/A' }}</td>
            <td class="px-4 py-2">
              <div class="flex gap-2">
                <button
                  @click="editarLibro(libro)"
                  :disabled="cargando"
                  class="px-3 py-1.5 rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
                >
                  Editar
                </button>
                <button
                  @click="confirmarEliminar(libro)"
                  :disabled="cargando"
                  class="px-3 py-1.5 rounded text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-60"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="text-gray-500 italic text-center py-8 bg-gray-50 rounded">
        No hay libros registrados
      </p>
    </div>

    <!-- Paginación -->
    <div v-if="totalPaginas > 1" class="flex items-center justify-center gap-3 mt-4">
      <button
        @click="paginaActual--"
        :disabled="paginaActual === 1"
        class="px-3 py-1.5 rounded font-medium text-white bg-gray-600 hover:bg-gray-700 disabled:opacity-60"
      >
        Anterior
      </button>
      <span class="text-sm text-gray-600">Página {{ paginaActual }} de {{ totalPaginas }}</span>
      <button
        @click="paginaActual++"
        :disabled="paginaActual === totalPaginas"
        class="px-3 py-1.5 rounded font-medium text-white bg-gray-600 hover:bg-gray-700 disabled:opacity-60"
      >
        Siguiente
      </button>
    </div>

    <!-- Modal -->
    <div
      v-if="mostrarModalEliminar"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="cerrarModal"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-[90%]" @click.stop>
        <h3 class="text-lg font-semibold text-gray-800">Confirmar eliminación</h3>
        <p class="mt-4 text-gray-600">
          ¿Estás seguro de que deseas eliminar el libro
          <strong>{{ libroAEliminar?.titulo }}</strong
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
            @click="eliminarLibro"
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
import { ref, computed, onMounted } from 'vue'
import {
  getLibros,
  agregarLibro,
  actualizarLibro,
  eliminarLibro as eliminarLibroAPI,
  getAutores,
  getCarreras,
} from '@/data/api'

const titulo = ref('')
const isbn = ref('')
const idAutor = ref('')
const idCarrera = ref('')
const estado = ref('disponible')
const anioPublicacion = ref(new Date().getFullYear())

const libros = ref([])
const autores = ref([])
const carreras = ref([])
const mensaje = ref('')
const mensajeTipo = ref('info')
const cargando = ref(false)
const modoEdicion = ref(false)
const libroEditando = ref(null)
const mostrarModalEliminar = ref(false)
const libroAEliminar = ref(null)
const busqueda = ref('')
const paginaActual = ref(1)
const librosPorPagina = 10

const formularioValido = computed(() => {
  return titulo.value.trim() && idAutor.value && idCarrera.value
})

const librosFiltrados = computed(() => {
  if (!busqueda.value.trim()) {
    return libros.value
  }

  const termino = busqueda.value.toLowerCase()
  return libros.value.filter(
    (libro) =>
      libro.titulo?.toLowerCase().includes(termino) ||
      libro.nombre_autor?.toLowerCase().includes(termino) ||
      libro.isbn?.toLowerCase().includes(termino),
  )
})

const totalPaginas = computed(() => {
  return Math.ceil(librosFiltrados.value.length / librosPorPagina)
})

const librosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * librosPorPagina
  const fin = inicio + librosPorPagina
  return librosFiltrados.value.slice(inicio, fin)
})

const cargarLibros = async () => {
  try {
    libros.value = await getLibros()
  } catch (err) {
    console.error('Error cargando libros:', err)
    mostrarMensaje('Error al cargar la lista de libros', 'error')
  }
}

const cargarAutores = async () => {
  try {
    autores.value = await getAutores()
  } catch (err) {
    console.error('Error cargando autores:', err)
  }
}

const cargarCarreras = async () => {
  try {
    carreras.value = await getCarreras()
  } catch (err) {
    console.error('Error cargando carreras:', err)
  }
}

const submitLibro = async () => {
  if (!formularioValido.value) {
    mostrarMensaje('Por favor completa todos los campos obligatorios', 'error')
    return
  }

  cargando.value = true
  mensaje.value = ''

  const datosLibro = {
    titulo: titulo.value.trim(),
    isbn: isbn.value.trim(),
    id_autor: idAutor.value,
    id_carrera: idCarrera.value,
    estado: estado.value,
    anio_publicacion: anioPublicacion.value,
  }

  try {
    if (modoEdicion.value) {
      const res = await actualizarLibro(libroEditando.value, datosLibro)
      mostrarMensaje(res.mensaje || 'Libro actualizado exitosamente', 'success')
    } else {
      const res = await agregarLibro(datosLibro)
      mostrarMensaje(res.mensaje || 'Libro agregado exitosamente', 'success')
    }

    limpiarFormulario()
    await cargarLibros()
  } catch (err) {
    console.error('Error:', err)
    const errorMsg =
      err.response?.data?.error || err.response?.data?.mensaje || 'Error al procesar la solicitud'
    mostrarMensaje(errorMsg, 'error')
  } finally {
    cargando.value = false
  }
}

const editarLibro = (libro) => {
  modoEdicion.value = true
  libroEditando.value = libro.id_libro
  titulo.value = libro.titulo
  isbn.value = libro.isbn || ''
  idAutor.value = libro.id_autor
  idCarrera.value = libro.id_carrera
  estado.value = libro.estado || 'disponible'
  anioPublicacion.value = libro.anio_publicacion || new Date().getFullYear()

  window.scrollTo({ top: 0, behavior: 'smooth' })
  mostrarMensaje(`Editando: ${libro.titulo}`, 'info')
}

const cancelarEdicion = () => {
  limpiarFormulario()
  mostrarMensaje('Edición cancelada', 'info')
}

const confirmarEliminar = (libro) => {
  libroAEliminar.value = libro
  mostrarModalEliminar.value = true
}

const eliminarLibro = async () => {
  if (!libroAEliminar.value) return

  cargando.value = true

  try {
    const res = await eliminarLibroAPI(libroAEliminar.value.id_libro)
    mostrarMensaje(res.mensaje || 'Libro eliminado exitosamente', 'success')
    await cargarLibros()
    cerrarModal()
  } catch (err) {
    console.error('Error eliminando libro:', err)
    const errorMsg =
      err.response?.data?.error || err.response?.data?.mensaje || 'Error al eliminar el libro'
    mostrarMensaje(errorMsg, 'error')
  } finally {
    cargando.value = false
  }
}

const cerrarModal = () => {
  mostrarModalEliminar.value = false
  libroAEliminar.value = null
}

const limpiarFormulario = () => {
  titulo.value = ''
  isbn.value = ''
  idAutor.value = ''
  idCarrera.value = ''
  estado.value = 'disponible'
  anioPublicacion.value = new Date().getFullYear()
  modoEdicion.value = false
  libroEditando.value = null
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

onMounted(async () => {
  await Promise.all([cargarLibros(), cargarAutores(), cargarCarreras()])
})
</script>
