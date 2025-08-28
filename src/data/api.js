import { libros } from './libros'
import { autores } from './autores'
import { carreras } from './carreras'

export function getLibros({ page = 1, limit = 10, filtros = {} }) {
  const quitarAcentos = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  let librosFiltrados = libros.filter((libro) => {
    return (
      !filtros.busqueda ||
      quitarAcentos(libro.titulo.toLowerCase()).includes(
        quitarAcentos(filtros.busqueda.toLowerCase()),
      )
    )
  })

  librosFiltrados = librosFiltrados.filter((libro) => {
    return (
      (!filtros.carreras ||
        filtros.carreras.length === 0 ||
        filtros.carreras.includes(libro.carrera)) &&
      (!filtros.autores || filtros.autores.length === 0 || filtros.autores.includes(libro.autor))
    )
  })

  const total = librosFiltrados.length
  const totalPages = Math.ceil(total / limit)

  if (page > totalPages) {
    return [] // no hay más libros que mostrar
  }

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const librosPaginados = librosFiltrados.slice(startIndex, endIndex)

  return librosPaginados.map((libro) => {
    const autor = autores.find((a) => a.id === libro.autor)
    const carrera = carreras.find((c) => c.id === libro.carrera)
    return {
      ...libro,
      nombre_autor: autor ? autor.nombre : 'Desconocido',
      nombre_carrera: carrera ? carrera.nombre : 'Desconocida',
    }
  })
}

export function getAutores() {
  return autores.map((autor) => {
    const librosPorAutor = libros.filter((libro) => libro.autor === autor.id)
    return {
      ...autor,
      cantidad_libros: librosPorAutor.length,
    }
  })
}

export function getCarreras() {
  return carreras.map((carrera) => {
    const librosPorCarrera = libros.filter((libro) => libro.carrera === carrera.id)
    return {
      ...carrera,
      cantidad_libros: librosPorCarrera.length,
    }
  })
}

export function getLibro(id) {
  const libro = libros.find((libro) => libro.id === id)
  if (!libro) {
    return null
  }
  const autor = autores.find((a) => a.id === libro.autor)
  const carrera = carreras.find((c) => c.id === libro.carrera)
  return {
    ...libro,
    nombre_autor: autor ? autor.nombre : 'Desconocido',
    nombre_carrera: carrera ? carrera.nombre : 'Desconocida',
  }
}

export function getRangoAnios() {
  const anios = libros.map((libro) => libro.anio)
  const minAnio = Math.min(...anios)
  const maxAnio = Math.max(...anios)
  return { min: minAnio, max: maxAnio }
}
