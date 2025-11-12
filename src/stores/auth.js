import { defineStore } from 'pinia'
import { BASE_URL } from '@/data/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    hasFetched: false,
  }),
  actions: {
    async fetchUser() {
      if (this.hasFetched) return
      try {
        const response = await fetch(`${BASE_URL}/api/auth/me`, {
          credentials: 'include',
        })

        if (!response.ok) throw new Error('Error al obtener usuario')

        const data = await response.json()

        if (data.is_authenticated) {
          this.user = data.user
          this.isAuthenticated = true
          this.isAdmin = !!data.user?.is_admin
        } else {
          this.user = null
          this.isAuthenticated = false
          this.isAdmin = false
        }
      } catch (err) {
        console.error('Error en fetchUser:', err)
        this.user = null
        this.isAuthenticated = false
        this.isAdmin = false
      } finally {
        this.hasFetched = true
      }
    },

    async logout() {
      try {
        await fetch(`${BASE_URL}/api/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        })
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      } finally {
        // Limpiar todo el estado
        this.user = null
        this.isAuthenticated = false
        this.isAdmin = false
        this.hasFetched = false
      }
    },
  },
})
