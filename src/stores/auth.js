import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),
  actions: {
    async fetchUser() {
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include',
        })
        const data = await response.json()

        if (data.is_authenticated) {
          this.user = data.user
          this.isAuthenticated = true
        } else {
          this.user = null
          this.isAuthenticated = false
        }
      } catch (err) {
        console.error('Error en fetchUser:', err)
        this.user = null
        this.isAuthenticated = false
      }
    },

    async logout() {
      try {
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        })
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      }
      this.$reset()
    },
  },
})
