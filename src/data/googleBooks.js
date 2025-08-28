import axios from 'axios'
export async function buscarIsbn(isbn) {
  const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)

  if (response.data.totalItems === 0) {
    throw new Error('No se encontró información para el ISBN proporcionado.')
  }

  const book = response.data.items[0].volumeInfo
  const libro = {
    titulo: book.title || '',
    autores: book.authors?.join(', ') || '',
    editorial: book.publisher || '',
    fecha_publicacion: book.publishedDate || '',
    descripcion: book.description || '',
    paginas: book.pageCount || 0,
    idioma: book.language || '',
    isbn:
      book.industryIdentifiers?.find((id) => id.type === 'ISBN_13')?.identifier ||
      book.industryIdentifiers?.[0]?.identifier ||
      '',
    imagen: book.imageLinks?.thumbnail || '',
  }

  return libro
}
