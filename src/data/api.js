import axios from 'axios'
import { buscarIsbn } from './googleBooks'

export const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL
export const DO_URL = import.meta.env.VITE_DO_URL

// Configuración global de axios
const apiClient = axios.create({
  baseURL: BASE_URL,
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
    if (!pdfFile) {
      throw new Error('El archivo PDF es obligatorio.')
    }

    const formData = new FormData()

    formData.append('titulo', libro.titulo)
    formData.append('isbn', libro.isbn)
    formData.append('anio_publicacion', libro.anio_publicacion)
    formData.append('estado', libro.estado)

    if (libro.ids_autores && libro.ids_autores.length > 0) {
      libro.ids_autores.forEach((id) => {
        formData.append('ids_autores', id) // Se añade la clave 'ids_autores' varias veces
      })
    }

    if (libro.ids_carreras && libro.ids_carreras.length > 0) {
      libro.ids_carreras.forEach((id) => {
        formData.append('ids_carreras', id) // Se añade la clave 'ids_carreras' varias veces
      })
    }

    // Si no se proporciona el título, intentar obtenerlo desde Google Books
    if (!libro.titulo && libro.isbn) {
      const googleData = await buscarIsbn(libro.isbn)
      if (googleData && googleData.title) {
        formData.append('titulo', googleData.title)
      }
    }
    formData.append('pdf', pdfFile)

    const resCrear = await apiClient.post('/libros/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return resCrear.data
  } catch (err) {
    console.error('Error agregando libro:', err)
    throw err
  }
}

export async function actualizarLibro(id, libro, pdfFile = null) {
  try {
    const metadataPayload = {
      titulo: libro.titulo,
      isbn: libro.isbn,
      anio_publicacion: libro.anio_publicacion,
      estado: libro.estado,
      ids_autores: libro.ids_autores || [],
      ids_carreras: libro.ids_carreras || [],
    }
    const res = await apiClient.put(`/libros/${id}`, metadataPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (pdfFile) {
      const fileFormData = new FormData()
      fileFormData.append('pdf', pdfFile)

      // 2.2: Hacemos la SEGUNDA llamada PUT a /libros/<id>/archivo
      await apiClient.put(`/libros/${id}/archivo`, fileFormData)
    }
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

export async function getAutores(busqueda = '') {
  try {
    const query = busqueda ? `?busqueda=${encodeURIComponent(busqueda)}` : ''
    const { data } = await apiClient.get(`/autores/${query}`)
    return data
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
      nombre_completo: autor.nombre,
      nacionalidad: autor.nacionalidad || '',
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
      nombre_completo: autor.nombre,
      nacionalidad: autor.nacionalidad,
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
      new_nombre_carrera: carrera.nombre,
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

//=================== BIBLIOTECA ====================
export const getBiblioteca = async ({ pagina = 1, limite = 10, filtros = {} }) => {
  const params = {
    pagina,
    limite,
  }

  if (filtros.carreras?.length) {
    params.carrera = filtros.carreras.join(',')
  }

  if (filtros.autores?.length) {
    params.autor = filtros.autores.join(',')
  }

  if (filtros.busqueda) {
    params.busqueda = filtros.busqueda
  }

  try {
    const resp = await apiClient.get('/biblioteca/', { params })
    return resp.data
  } catch (err) {
    console.error('Error en getBiblitoeca', err)
    throw err
  }
}

// LECTOR
export const getUrl = async (id_libro) => {
  try {
    const resp = await apiClient.get(`/static/leer/${id_libro}`)
    return resp.data
  } catch (err) {
    console.error('Error en getBiblitoeca', err)
    throw err
  }
}
