import axios from 'axios'

const API_URL = 'http://127.0.0.1:5000/api'

// Configuración global de axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ==================== LIBROS ====================

export async function getLibros() {
  try {
    const res = await apiClient.get('/libros/')
    return res.data
  } catch (err) {
    console.error('Error en getLibros:', err)
    throw err
  }
}

// ==================== AUTORES ====================

export async function getAutores() {
  try {
    const res = await apiClient.get('/autores/')
    return res.data
  } catch (err) {
    console.error('Error en getAutores:', err)
    throw err
  }
}
export async function getAutor(id) {
  try {
    const res = await apiClient.get(`/autores/${id}`)
    return res.data
  } catch (err) {
    console.error('Error en getAutor:', err)
    throw err
  }
}

export async function agregarAutor(autor) {
  try {
    const res = await apiClient.post('/autores/', {
      new_nombre: autor.nombre,
      new_nacionalidad: autor.nacionalidad || '',
    })
    return res.data
  } catch (err) {
    console.error('Error agregando autor:', err.response?.data)
    throw err
  }
}

export async function actualizarAutor(id, autor) {
  try {
    const res = await apiClient.put(`/autores/${id}`, {
      edit_nombre: autor.nombre,
      edit_nacionalidad: autor.nacionalidad,
    })
    return res.data
  } catch (err) {
    console.error('Error actualizando autor:', err)
    throw err
  }
}

export async function eliminarAutor(id) {
  try {
    const res = await apiClient.delete(`/autores/${id}`)
    return res.data
  } catch (err) {
    console.error('Error eliminando autor:', err)
    throw err
  }
}

// ==================== CARRERAS ====================

export async function getCarreras() {
  try {
    const res = await apiClient.get('/carreras/')
    return res.data
  } catch (err) {
    console.error('Error en getCarreras:', err)
    throw err
  }
}

export async function getCarrera(id) {
  try {
    const res = await apiClient.get(`/carreras/${id}`)
    return res.data
  } catch (err) {
    console.error('Error en getCarrera:', err)
    throw err
  }
}

export async function agregarCarrera(carrera) {
  try {
    const res = await apiClient.post('/carreras/', {
      new_nombre: carrera.nombre,
    })
    return res.data
  } catch (err) {
    console.error('Error agregando carrera:', err)
    throw err
  }
}

export async function actualizarCarrera(id, carrera) {
  try {
    const res = await apiClient.put(`/carreras/${id}`, {
      edit_nombre: carrera.nombre,
    })
    return res.data
  } catch (err) {
    console.error('Error actualizando carrera:', err)
    throw err
  }
}

export async function eliminarCarrera(id) {
  try {
    const res = await apiClient.delete(`/carreras/${id}`)
    return res.data
  } catch (err) {
    console.error('Error eliminando carrera:', err)
    throw err
  }
}
