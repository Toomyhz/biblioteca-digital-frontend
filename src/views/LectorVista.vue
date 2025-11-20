<template>
  <div class="bg-[url('/fondo-lector.jpg')] bg-cover bg-center bg-fixed">
    <div class="flex flex-col min-h-screen">
      <!-- 🔹 Barra superior -->
      <div
        class="h-10 flex flex-col sm:flex-row sm:items-center sm:justify-between px-2 sm:px-4 bg-white/70 text-xs sm:text-sm"
      >
        <div class="flex items-center gap-2 sm:gap-4">
          <span>{{ titulo_libro }}</span>
          <span>Páginas: {{ pageNum }} / {{ totalPages }}</span>
        </div>
        <div class="mt-1 sm:mt-0">
          <a
            href="https://www.bcn.cl/leychile/navegar?idNorma=28933"
            class="border border-blue-950 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-blue-950 hover:text-white hover:bg-blue-950 transition"
            target="_blank"
            rel="noopener"
          >
            Lectura sólo en línea
          </a>
        </div>
      </div>

      <!-- Contenedor principal fijo al alto de pantalla -->
      <div class="relative h-[calc(100vh-5rem)] py-2">
        <!-- PDF con scroll independiente -->
        <div
          ref="pdfViewer"
          class="h-full w-full flex justify-center items-start overflow-auto cursor-grab"
        >
          <canvas ref="canvasEl" class="max-w-full h-auto w-auto"></canvas>
        </div>

        <!-- Barra izquierda fija -->
        <button
          @click="prevPage"
          :disabled="pageNum <= 1"
          class="absolute left-0 top-1/2 -translate-y-1/2 h-1/2 w-16 flex items-center justify-center bg-white/30 hover:bg-white/50 disabled:opacity-40 select-none"
        >
          ◀
        </button>

        <!-- Barra derecha fija -->
        <button
          @click="nextPage"
          :disabled="pageNum >= totalPages"
          class="absolute right-0 top-1/2 -translate-y-1/2 h-1/2 w-16 flex items-center justify-center bg-white/30 hover:bg-white/50 disabled:opacity-40 select-none"
        >
          ▶
        </button>
      </div>
      <div
        v-if="isLoading"
        class="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
      >
        <div class="mb-4 animate-bounce text-4xl">📚</div>

        <h3 class="text-lg font-bold text-blue-950 mb-2">Descargando Libro...</h3>

        <div class="w-64 h-4 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
          <div
            class="h-full bg-blue-600 transition-all duration-200 ease-out flex items-center justify-center text-[10px] text-white font-bold"
            :style="{ width: `${downloadProgress}%` }"
          >
            {{ downloadProgress }}%
          </div>
        </div>

        <p class="text-xs text-gray-500 mt-2">Por favor espera mientras preparamos la lectura</p>
      </div>
      <!-- 🔹 Control de zoom -->
      <div
        class="p-2 items-center justify-center gap-3 bg-white/70 sticky bottom-0 w-fit mx-auto px-4 rounded hidden sm:flex"
      >
        <input
          type="range"
          min="1"
          max="6"
          step="0.1"
          v-model.number="scale"
          class="w-48 accent-blue-950"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, shallowRef } from 'vue' // <--- Agregamos watch y shallowRef
import { useRoute } from 'vue-router'
import * as pdfjsLib from '@/assets/pdf.mjs'
import { getLibro, getUrl } from '@/data/api'

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js'

const route = useRoute()
const libro = ref(null)
const canvasEl = ref(null)
const pageNum = ref(1)
const totalPages = ref(0)
const titulo_libro = ref('Cargando...')
const scale = ref(1)

const pdfViewer = ref(null)

const isLoading = ref(true)
const downloadProgress = ref(0)

// Usamos shallowRef para el documento PDF (es mejor rendimiento que let normal o ref profundo)
const pdfDoc = shallowRef(null)
let currentRenderTask = null

// --- 1. EL ARREGLO DEL ZOOM ---
// Vigilamos la variable 'scale'. Cuando cambia, repintamos.
watch(scale, (newScale) => {
  renderPage(pageNum.value)
})

// --- VARIABLES PARA DRAG & DROP (Definirlas afuera para poder borrarlas luego) ---
let isDown = false
let startX, startY, scrollLeft, scrollTop

// Definimos las funciones AQUÍ (afuera del onMounted) para que existan en todo el script
const mouseDown = (e) => {
  if (!pdfViewer.value) return
  isDown = true
  pdfViewer.value.classList.add('cursor-grabbing')
  startX = e.pageX - pdfViewer.value.offsetLeft
  startY = e.pageY - pdfViewer.value.offsetTop
  scrollLeft = pdfViewer.value.scrollLeft
  scrollTop = pdfViewer.value.scrollTop
}

const mouseLeave = () => {
  isDown = false
  if (pdfViewer.value) pdfViewer.value.classList.remove('cursor-grabbing')
}

const mouseUp = () => {
  isDown = false
  if (pdfViewer.value) pdfViewer.value.classList.remove('cursor-grabbing')
}

const mouseMove = (e) => {
  if (!isDown || !pdfViewer.value) return
  e.preventDefault()
  const x = e.pageX - pdfViewer.value.offsetLeft
  const y = e.pageY - pdfViewer.value.offsetTop
  const walkX = (x - startX) * 1.5 // Le subí un poco la velocidad (1.5)
  const walkY = (y - startY) * 1.5
  pdfViewer.value.scrollLeft = scrollLeft - walkX
  pdfViewer.value.scrollTop = scrollTop - walkY
}

onMounted(async () => {
  try {
    // 1. Cargar Metadata
    const libroId = route.params.id_libro
    const resLibro = await getLibro(libroId)
    libro.value = resLibro.libro
    titulo_libro.value = libro.value?.titulo

    // 2. Obtener URL Firmada
    const data = await getUrl(libro.value?.id_libro)
    if (!data.url) throw new Error('No se recibió la URL')

    // 3. Cargar PDF desde DigitalOcean
    const loadingTask = pdfjsLib.getDocument({
      url: data.url,
      withCredentials: false, // IMPORTANTE para CORS
    })
    loadingTask.onProgress = (progressData) => {
      if (progressData.total > 0) {
        const percent = (progressData.loaded / progressData.total) * 100
        downloadProgress.value = Math.round(percent)
      } else {
        // Si el servidor no dice el tamaño total, avanzamos fake o mostramos indeterminado
        downloadProgress.value = 0
      }
    }

    pdfDoc.value = await loadingTask.promise
    totalPages.value = pdfDoc.value.numPages

    // 4. Renderizar primera página
    renderPage(pageNum.value)
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }

  // 5. Activar eventos del Mouse (Drag to Scroll)
  if (pdfViewer.value) {
    pdfViewer.value.addEventListener('mousedown', mouseDown)
    pdfViewer.value.addEventListener('mouseleave', mouseLeave)
    pdfViewer.value.addEventListener('mouseup', mouseUp)
    pdfViewer.value.addEventListener('mousemove', mouseMove)
  }
})

onBeforeUnmount(() => {
  // Limpieza de eventos (Ahora sí funciona porque las funciones son visibles)
  if (pdfViewer.value) {
    pdfViewer.value.removeEventListener('mousedown', mouseDown)
    pdfViewer.value.removeEventListener('mouseleave', mouseLeave)
    pdfViewer.value.removeEventListener('mouseup', mouseUp)
    pdfViewer.value.removeEventListener('mousemove', mouseMove)
  }
})

async function renderPage(num) {
  if (!pdfDoc.value) return

  // Si hay una renderización en proceso, la cancelamos para que no se solapen
  if (currentRenderTask) {
    await currentRenderTask.cancel()
  }

  const page = await pdfDoc.value.getPage(num)

  // Aquí es donde 'scale.value' hace efecto
  const viewport = page.getViewport({ scale: scale.value })
  const canvas = canvasEl.value
  const ctx = canvas.getContext('2d')

  canvas.width = viewport.width
  canvas.height = viewport.height

  currentRenderTask = page.render({ canvasContext: ctx, viewport })

  try {
    await currentRenderTask.promise
  } catch (error) {
    if (error.name === 'RenderingCancelledException') {
      // Ignorar cancelación (es normal al hacer zoom rápido)
    } else {
      console.error('Error rendering page:', error)
    }
  } finally {
    currentRenderTask = null
  }
}

function prevPage() {
  if (pageNum.value > 1) {
    pageNum.value--
    renderPage(pageNum.value)
  }
}

function nextPage() {
  if (pageNum.value < totalPages.value) {
    pageNum.value++
    renderPage(pageNum.value)
  }
}
</script>
