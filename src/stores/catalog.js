// src/stores/catalog.js
import { defineStore } from 'pinia'
import { getAutores, getCarreras, getBibliotecaCatalogo } from '@/data/api'

export const useCatalogAdminStore = defineStore('catalog', {
  state: () => ({
    autores: [],
    carreras: [],
    loaded: false,
    loading: false,
  }),

  actions: {
    async load() {
      if (this.loaded || this.loading) return
      await this._fetch()
    },

    async reload() {
      this.loaded = false
      await this._fetch()
    },

    async _fetch() {
      this.loading = true
      try {
        const [respAutores, respCarreras] = await Promise.all([
          getAutores(), // aquí sin búsqueda
          getCarreras(),
        ])

        this.autores = respAutores.data || respAutores['data'] || []
        this.carreras = respCarreras.data || respCarreras['data'] || []
        this.loaded = true
      } catch (e) {
        console.error('Error cargando catálogo global:', e)
      } finally {
        this.loading = false
      }
    },
  },
})

export const useCatalogBibliotecaStore = defineStore('catalogBiblioteca', {
  state: () => ({
    autores: [],
    carreras: [],
    loaded: false,
    loading: false,
  }),

  actions: {
    async load() {
      if (this.loaded || this.loading) return
      await this._fetch()
    },

    async reload() {
      this.loaded = false
      await this._fetch()
    },

    async _fetch() {
      this.loading = true
      try {
        const [resp] = await Promise.all([getBibliotecaCatalogo()])
        console.log('Catálogo biblioteca:', resp)
        this.autores = resp.autores || []
        this.carreras = resp.carreras || []
        this.loaded = true
      } catch (e) {
        console.error('Error cargando catálogo biblioteca:', e)
      } finally {
        this.loading = false
      }
    },
  },
})
