<template>
  <div class="flex flex-col h-screen w-screen bg-[url('/fondo-lector.jpg')] bg-cover bg-center">
    <!-- 🔹 Barra superior -->
    <div class="h-10 flex items-center justify-between px-4 bg-white/70 text-sm">
      <div class="flex items-center gap-4">
        <span>{{ titulo_libro }}</span>
        <span>Páginas: {{ pageNum }} / {{ totalPages }}</span>
      </div>
      <div>
        <a
          href="https://www.bcn.cl/leychile/navegar?idNorma=28933"
          class="border border-blue-950 px-2 py-1 rounded text-blue-950 hover:text-white hover:bg-blue-950 transition"
          target="_blank"
          rel="noopener"
        >
          Lectura sólo en línea
        </a>
      </div>
    </div>

    <!-- 🔹 Contenedor principal -->
    <div class="flex flex-1 items-center justify-center relative overflow-hidden">
      <!-- Botón izquierda -->
      <button
        @click="prevPage"
        :disabled="pageNum <= 1"
        class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 px-2 py-1 text-xl shadow rounded disabled:opacity-40"
      >
        ◀
      </button>

      <!-- PDF centrado -->
      <div
        class="bg-white shadow-lg max-h-[95%] w-auto flex items-center justify-center overflow-hidden"
      >
        <canvas ref="canvasEl" class="max-w-full h-auto"></canvas>
      </div>

      <!-- Botón derecha -->
      <button
        @click="nextPage"
        :disabled="pageNum >= totalPages"
        class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 px-2 py-1 text-xl shadow rounded disabled:opacity-40"
      >
        ▶
      </button>
    </div>

    <!-- 🔹 Control de zoom -->
    <div class="p-2 flex items-center justify-center gap-3 bg-white/70">
      <input
        type="range"
        min="2.2"
        max="6"
        step="0.1"
        v-model.number="scale"
        @input="renderPage(pageNum)"
        class="w-48 accent-blue-950"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.mjs?url'
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

const canvasEl = ref(null)
const pageNum = ref(1)
const totalPages = ref(0)
const titulo_libro = ref('Cargando...')
const scale = ref(2.2)

let pdfDoc = null

async function renderPage(num) {
  const page = await pdfDoc.getPage(num)

  const viewport = page.getViewport({ scale: scale.value })
  const canvas = canvasEl.value
  const ctx = canvas.getContext('2d')

  canvas.width = viewport.width
  canvas.height = viewport.height

  await page.render({ canvasContext: ctx, viewport }).promise
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

onMounted(async () => {
  const url = 'http://localhost:5000/api/lector/libro/3'
  titulo_libro.value = 'Proximamente dinámico'
  pdfDoc = await pdfjsLib.getDocument({ url, withCredentials: true }).promise
  totalPages.value = pdfDoc.numPages
  renderPage(pageNum.value)
})
</script>
