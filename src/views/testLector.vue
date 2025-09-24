<template>
  <div class="pdf-viewer">
    <div ref="flipEl" class="flip-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { PageFlip } from 'page-flip'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

const flipEl = ref(null)

onMounted(async () => {
  const url = 'http://localhost:5000/api/auth/libro/test'
  const pdf = await pdfjsLib.getDocument(url).promise
  const images = []

  // Renderizar cada página a imagen ajustada
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)

    const maxWidth = 700
    const maxHeight = 1000

    // Viewport base
    const viewport = page.getViewport({ scale: 1 })

    // Calcular escala proporcional para que quepa en 700x1000
    const scale = Math.min(maxWidth / viewport.width, maxHeight / viewport.height)

    const scaledViewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = scaledViewport.width
    canvas.height = scaledViewport.height

    await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    images.push(dataUrl)
  }

  // Inicializar flipbook
  const pageFlip = new PageFlip(flipEl.value, {
    width: 700,
    height: 1000,
    size: 'stretch',
    showPageCorners: true,
    maxShadowOpacity: 0.5,
    mobileScrollSupport: false,
  })

  pageFlip.loadFromImages(images)
})
</script>

<style>
.pdf-viewer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.flip-container {
  width: 60vw;
  height: 90vh;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  overflow: hidden;
}
.flip-container .page img {
  width: 100% !important;
  height: auto !important;
  object-fit: contain;
  background: white; /* mantiene fondo uniforme */
}

.flip-container .stf__item canvas,
.flip-container .stf__item img {
  width: 100% !important;
  height: auto !important;
  object-fit: contain;
  display: block;
  margin: 0 auto;
  background: white; /* para uniformar márgenes */
}
</style>
