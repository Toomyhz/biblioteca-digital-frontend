<template>
  <div class="flex flex-col h-screen">
    <button
      @click="$router.back()"
      class="flex-shrink-0 p-2 bg-gray-200 hover:bg-gray-300 rounded cursor-pointer m-2 w-fit"
    >
      ← Volver
    </button>
    <div ref="pdfContainer" class="flex-1 overflow-auto flex justify-center items-center m-4"></div>
  </div>
</template>

<script>
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs'

export default {
  props: {
    src: { type: String, required: true },
    page: { type: Number, required: true },
  },
  emits: ['loaded'],
  watch: {
    src: 'renderPage',
    page: 'renderPage',
  },
  mounted() {
    this.renderPage()
  },
  methods: {
    async renderPage() {
      const container = this.$refs.pdfContainer
      container.innerHTML = ''

      try {
        const loadingTask = pdfjsLib.getDocument(this.src)
        const pdf = await loadingTask.promise
        this.$emit('loaded', pdf.numPages)

        const page = await pdf.getPage(this.page)

        // Tamaño disponible en el contenedor
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight

        // Obtiene viewport escala 1 para conocer tamaño natural
        const unscaledViewport = page.getViewport({ scale: 1 })

        // Calcula escala para ajustar dentro del contenedor sin cortar
        const scale = Math.min(
          containerWidth / unscaledViewport.width,
          containerHeight / unscaledViewport.height,
        )

        // Crea viewport con escala calculada
        const viewport = page.getViewport({ scale })

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({ canvasContext: context, viewport }).promise
        container.appendChild(canvas)
      } catch (err) {
        console.error('Error al renderizar PDF:', err)
      }
    },
  },
}
</script>

<style scoped>
.pdf-container {
  display: flex;
  justify-content: center;
  margin: 1rem;
}
canvas {
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
