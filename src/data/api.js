import axios from 'axios'
import { buscarIsbn } from './googleBooks'

const API_URL = 'http://127.0.0.1:5000/api'

// Configuración global de axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ==================== LIBROS ====================

export async function getLibros(params = {}) {
  try {
    const { page = 1, limit = 10, search = '' } = params
    const res = await apiClient.get('/libros/', {
      params: {
        pagina: page,
        limite: limit,
        busqueda: search,
      },
    })
    return res.data
  } catch (err) {
    console.error('Error en getLibros:', err)
    throw err
  }
}

export async function getLibro(id) {
  try {
    const res = await apiClient.get(`/libros/${id}`)
    return res.data
  } catch (err) {
    console.error('Error en getLibro:', err)
    throw err
  }
}

export async function agregarLibro(libro, pdfFile = null) {
  try {
    const formData = new FormData()

    formData.append('new_titulo', libro.titulo)
    formData.append('new_isbn', libro.isbn)
    formData.append('new_estado', libro.estado)
    formData.append('new_anio_publicacion', libro.anio_publicacion)

    if (libro.ids_autores && libro.ids_autores.length > 0) {
      libro.ids_autores.forEach((id) => {
        formData.append('new_id_autor', id) // Múltiples valores con mismo key
      })
    }

    if (libro.ids_carreras && libro.ids_carreras.length > 0) {
      libro.ids_carreras.forEach((id) => {
        formData.append('new_id_carrera', id)
      })
    }

    if (pdfFile) {
      formData.append('pdf', pdfFile)
    }

    // Si no se proporciona el título, intentar obtenerlo desde Google Books
    if (!libro.titulo && libro.isbn) {
      const googleData = await buscarIsbn(libro.isbn)
      if (googleData && googleData.title) {
        formData.set('new_titulo', googleData.title)
      }
    }

    const res = await apiClient.post('/libros/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return res.data
  } catch (err) {
    console.error('Error agregando libro:', err)
    throw err
  }
}

export async function actualizarLibro(id, libro, pdfFile = null) {
  try {
    const formData = new FormData()

    formData.append('edit_titulo', libro.titulo)
    formData.append('edit_isbn', libro.isbn)
    formData.append('edit_estado', libro.estado)
    formData.append('edit_anio_publicacion', libro.anio_publicacion)

    if (libro.ids_autores && libro.ids_autores.length > 0) {
      libro.ids_autores.forEach((id) => {
        formData.append('edit_id_autor', id)
      })
    }

    if (libro.ids_carreras && libro.ids_carreras.length > 0) {
      libro.ids_carreras.forEach((id) => {
        formData.append('edit_id_carrera', id)
      })
    }

    if (pdfFile) {
      formData.append('pdf', pdfFile)
    }

    const res = await apiClient.put(`/libros/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res.data
  } catch (err) {
    console.error('Error actualizando libro:', err)
    throw err
  }
}

export async function eliminarLibro(id) {
  try {
    const res = await apiClient.delete(`/libros/${id}`)
    return res.data
  } catch (err) {
    console.error('Error eliminando libro:', err)
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
