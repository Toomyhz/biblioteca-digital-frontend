<template>
  <div class="relative mx-auto max-w-6xl px-4 py-6">
    <!-- Barra superior -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="$router.back()" class="text-sm text-slate-600 hover:text-indigo-600">
          ← Volver
        </button>
        <h1 class="text-xl font-semibold">Lector (solo lectura)</h1>
      </div>
      <div class="flex items-center gap-2">
        <button @click="prev" class="control-btn">◀</button>
        <span class="text-sm text-slate-600">{{ current }} / {{ total }}</span>
        <button @click="next" class="control-btn">▶</button>
        <span class="mx-2"></span>
        <button @click="zoomOut" class="control-btn">−</button>
        <button @click="zoomIn" class="control-btn">＋</button>
      </div>
    </div>

    <!-- Contenedor del flipbook -->
    <div
      ref="flipEl"
      class="relative rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden select-none"
      style="height: 78vh;"
    >
      <div v-if="loading" class="absolute inset-0 grid place-items-center">
        <div class="animate-pulse text-slate-500">Cargando páginas…</div>
      </div>
      <!-- marca de agua -->
      <div
        class="pointer-events-none absolute inset-0 grid place-items-center opacity-15"
        style="transform: rotate(-20deg);"
      >
        <div class="text-5xl font-extrabold tracking-widest text-slate-800">
          SOLO LECTURA
        </div>
      </div>
    </div>

    <!-- avisos -->
    <p class="mt-3 text-xs text-slate-500">
      Descarga/impresión deshabilitadas a nivel de UI. Capturas de pantalla siempre son posibles.
    </p>
  </div>
</template>

<script>
// Efecto libro
import { PageFlip } from 'page-flip'

// pdf.js (usa worker ESM; Vite soporta ?url)
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.mjs?url'
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

export default {
  name: 'PrivatePdfFlipbook',
  props: {
    pdfSrc: { type: String, required: true }
  },
  data() {
    return {
      loading: true,
      pageFlip: null,
      images: [],
      current: 1,
      total: 0,
      scale: 1.4,       // zoom base de render
      pdfBuffer: null   // guardamos el ArrayBuffer para re-render con zoom
    }
  },
  mounted() {
    // "Hardening" básico
    document.addEventListener('contextmenu', this.blockContext)
    document.addEventListener('keydown', this.blockKeys)

    this.loadPdf()
  },
  beforeUnmount() {
    document.removeEventListener('contextmenu', this.blockContext)
    document.removeEventListener('keydown', this.blockKeys)
    this.pageFlip?.destroy()
  },
  methods: {
    blockContext(e) { e.preventDefault() },
    blockKeys(e) {
      const k = e.key.toLowerCase()
      if ((e.ctrlKey || e.metaKey) && (k === 'p' || k === 's' || k === 'u')) {
        e.preventDefault(); e.stopPropagation()
      }
    },
    async loadPdf() {
      try {
        // En producción: fetch con credenciales/Authorization hacia tu API
        const resp = await fetch(this.pdfSrc, { credentials: 'include' })
        this.pdfBuffer = await resp.arrayBuffer()
        await this.renderAllPages()
        this.initFlip()
      } catch (err) {
        console.error('Error cargando PDF:', err)
      } finally {
        this.loading = false
      }
    },
    async renderAllPages() {
      this.loading = true
      this.images = []

      const doc = await pdfjsLib.getDocument({ data: this.pdfBuffer }).promise
      this.total = doc.numPages

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i)
        const viewport = page.getViewport({ scale: this.scale })
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d', { willReadFrequently: false })
        canvas.width = Math.floor(viewport.width)
        canvas.height = Math.floor(viewport.height)

        await page.render({ canvasContext: ctx, viewport }).promise
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92) // imagen optimizada
        this.images.push(dataUrl)
      }
    },
    initFlip() {
      // Destruir si ya existe
      this.pageFlip?.destroy()

      // Crear instancia
      this.pageFlip = new PageFlip(this.$refs.flipEl, {
        width: 900,        // base; el contenedor estira ("stretch")
        height: 1200,
        size: 'stretch',
        maxShadowOpacity: 0.4,
        showPageCorners: true,
        mobileScrollSupport: false,
        usePortrait: true
      })

      // Cargar páginas (como imágenes)
      this.pageFlip.loadFromImages(this.images)
      this.pageFlip.on('flip', (e) => { this.current = e.data })
      this.current = 1
    },
    next() { this.pageFlip?.flipNext() },
    prev() { this.pageFlip?.flipPrev() },
    async zoomIn() {
      this.scale = Math.min(this.scale + 0.2, 2.4)
      await this.renderAllPages()
      this.initFlip()
    },
    async zoomOut() {
      this.scale = Math.max(this.scale - 0.2, 0.8)
      await this.renderAllPages()
      this.initFlip()
    }
  }
}
</script>

<style scoped>
/* ✅ CORREGIDO: Usar CSS puro en lugar de clases Tailwind */
.control-btn {
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background-color: white;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.control-btn:hover {
  background-color: #f8fafc;
}

:global(img), :global(canvas) {
  -webkit-user-drag: none;
  user-select: none;
  pointer-events: none; /* lectura solamente */
}

/* Anti-impresión (mitigación visual) */
@media print {
  body { display: none !important; }
}
</style>
