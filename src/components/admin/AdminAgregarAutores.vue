<template>
  <div class="autor-manager">
    <h3>{{ modoEdicion ? 'Editar Autor' : 'Agregar Autor' }}</h3>

    <div class="form-group">
      <input
        v-model="nombre"
        placeholder="Nombre del autor"
        @keyup.enter="submitAutor"
        :disabled="cargando"
      />
      <input
        v-model="nacionalidad"
        placeholder="Nacionalidad"
        @keyup.enter="submitAutor"
        :disabled="cargando"
      />
      <button @click="submitAutor" :disabled="cargando || !nombre.trim()" class="btn-primary">
        {{ cargando ? 'Procesando...' : modoEdicion ? 'Actualizar' : 'Agregar' }}
      </button>
      <button
        v-if="modoEdicion"
        @click="cancelarEdicion"
        :disabled="cargando"
        class="btn-secondary"
      >
        Cancelar
      </button>
    </div>

    <p v-if="mensaje" :class="mensajeTipo">{{ mensaje }}</p>

    <h4>Autores ({{ autores.length }})</h4>
    <ul v-if="autores.length > 0">
      <li
        v-for="autor in autores"
        :key="autor.id_autor"
        :class="{ editando: autorEditando === autor.id_autor }"
      >
        <div class="autor-info">
          <span class="autor-nombre">{{ autor.nombre_completo }}</span>
          <span class="autor-nacionalidad">
            {{ autor.nacionalidad || 'Sin nacionalidad' }}
          </span>
        </div>
        <div class="autor-actions">
          <button
            @click="editarAutor(autor)"
            :disabled="cargando"
            class="btn-edit"
            title="Editar autor"
          >
            Editar
          </button>
          <button
            @click="confirmarEliminar(autor)"
            :disabled="cargando"
            class="btn-delete"
            title="Eliminar autor"
          >
            Eliminar
          </button>
        </div>
      </li>
    </ul>
    <p v-else class="no-data">No hay autores registrados</p>

    <!-- Modal de confirmación para eliminar -->
    <div v-if="mostrarModalEliminar" class="modal-overlay" @click="cerrarModal">
      <div class="modal" @click.stop>
        <h3>Confirmar eliminación</h3>
        <p>
          ¿Estás seguro de que deseas eliminar al autor
          <strong>{{ autorAEliminar?.nombre_completo }}</strong
          >?
        </p>
        <p class="warning">Esta acción no se puede deshacer.</p>
        <div class="modal-actions">
          <button @click="cerrarModal" class="btn-secondary" :disabled="cargando">Cancelar</button>
          <button @click="eliminarAutor" class="btn-delete" :disabled="cargando">
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

<style scoped>
.autor-manager {
  padding: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

h3 {
  margin-bottom: 1rem;
  color: #333;
}

h4 {
  margin: 2rem 0 1rem 0;
  color: #555;
}

.form-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

input {
  padding: 0.625rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  min-width: 200px;
  font-size: 0.95rem;
}

input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

button {
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.btn-primary {
  background-color: #4caf50;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #45a049;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #5a6268;
}

.btn-edit {
  background-color: #2196f3;
  color: white;
  padding: 0.4rem 0.75rem;
  font-size: 0.875rem;
}

.btn-edit:hover:not(:disabled) {
  background-color: #1976d2;
}

.btn-delete {
  background-color: #f44336;
  color: white;
  padding: 0.4rem 0.75rem;
  font-size: 0.875rem;
}

.btn-delete:hover:not(:disabled) {
  background-color: #d32f2f;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.icon {
  font-size: 1rem;
}

.success {
  color: #155724;
  padding: 0.75rem;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.error {
  color: #721c24;
  padding: 0.75rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.info {
  color: #004085;
  padding: 0.75rem;
  background-color: #cce5ff;
  border: 1px solid #b8daff;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.no-data {
  color: #666;
  font-style: italic;
  padding: 2rem;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 4px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
  gap: 1rem;
}

li:hover {
  background-color: #f8f9fa;
}

li.editando {
  background-color: #e3f2fd;
  border-left: 3px solid #2196f3;
}

li:last-child {
  border-bottom: none;
}

.autor-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.autor-nombre {
  font-weight: 500;
  color: #333;
  font-size: 1rem;
}

.autor-nacionalidad {
  color: #666;
  font-size: 0.875rem;
}

.autor-actions {
  display: flex;
  gap: 0.5rem;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s;
}

.modal h3 {
  margin-top: 0;
  color: #333;
}

.modal p {
  margin: 1rem 0;
  color: #555;
  line-height: 1.5;
}

.warning {
  color: #d32f2f;
  font-size: 0.875rem;
  font-style: italic;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .form-group {
    flex-direction: column;
  }

  input {
    min-width: 100%;
  }

  li {
    flex-direction: column;
    align-items: flex-start;
  }

  .autor-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
