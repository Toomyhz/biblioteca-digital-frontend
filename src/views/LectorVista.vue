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
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as pdfjsLib from '@/assets/pdf.mjs'
import { getLibro } from '@/data/api'
import { BASE_URL } from '@/data/api'

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js'

const route = useRoute()
const libro = ref(null)
const canvasEl = ref(null)
const pageNum = ref(1)
const totalPages = ref(0)
const titulo_libro = ref('Cargando...')
const scale = ref(1)

const pdfViewer = ref(null)

const viewer = ref(null)
let mouseDown, mouseLeave, mouseUp, mouseMove

let pdfDoc = null
let currentRenderTask = null

onMounted(async () => {
  const libroId = route.params.id_libro
  const resLibro = await getLibro(libroId)
  libro.value = resLibro.libro
  titulo_libro.value = libro.value?.titulo
  let url = `${BASE_URL}/static/pdfs/${libro.value?.archivo_pdf}`

  pdfDoc = await pdfjsLib.getDocument({ url, withCredentials: true }).promise

  totalPages.value = pdfDoc.numPages
  renderPage(pageNum.value)
  viewer.value = pdfViewer.value
  let isDown = false
  let startX, startY, scrollLeft, scrollTop

  const mouseDown = (e) => {
    isDown = true
    viewer.value.classList.add('cursor-grabbing')
    startX = e.pageX - viewer.value.offsetLeft
    startY = e.pageY - viewer.value.offsetTop
    scrollLeft = viewer.value.scrollLeft
    scrollTop = viewer.value.scrollTop
  }

  const mouseLeave = () => {
    isDown = false
    viewer.value.classList.remove('cursor-grabbing')
  }

  const mouseUp = () => {
    isDown = false
    viewer.value.classList.remove('cursor-grabbing')
  }

  const mouseMove = (e) => {
    if (!isDown) return
    e.preventDefault()
    const x = e.pageX - viewer.value.offsetLeft
    const y = e.pageY - viewer.value.offsetTop
    const walkX = (x - startX) * 1 // multiplicador de velocidad
    const walkY = (y - startY) * 1
    viewer.value.scrollLeft = scrollLeft - walkX
    viewer.value.scrollTop = scrollTop - walkY
  }

  viewer.value.addEventListener('mousedown', mouseDown)
  viewer.value.addEventListener('mouseleave', mouseLeave)
  viewer.value.addEventListener('mouseup', mouseUp)
  viewer.value.addEventListener('mousemove', mouseMove)
})
onBeforeUnmount(() => {
  viewer.value.removeEventListener('mousedown', mouseDown)
  viewer.value.removeEventListener('mouseleave', mouseLeave)
  viewer.value.removeEventListener('mouseup', mouseUp)
  viewer.value.removeEventListener('mousemove', mouseMove)
})

async function renderPage(num) {
  const page = await pdfDoc.getPage(num)

  const viewport = page.getViewport({ scale: scale.value })
  const canvas = canvasEl.value
  const ctx = canvas.getContext('2d')

  canvas.width = viewport.width
  canvas.height = viewport.height

  if (currentRenderTask) {
    await currentRenderTask.cancel()
  }

  currentRenderTask = page.render({ canvasContext: ctx, viewport })
  try {
    await currentRenderTask.promise
  } catch (error) {
    if (error.name === 'RenderingCancelledException') {
      // Render was cancelled, do nothing
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
watch(scale, (newScaleValue) => {
  // Llama a tu función de renderizado
  renderPage(pageNum.value)
})
</script>
