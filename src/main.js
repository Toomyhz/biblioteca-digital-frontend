import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'

async function init() {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)

  const auth = useAuthStore(pinia)

  // Rutas públicas (no necesitan sesión)
  const publicPaths = ['/login', '/auth/success']
  const currentPath = window.location.pathname

  // Si NO estoy en una ruta pública, verifico sesión antes de montar
  if (!publicPaths.includes(currentPath)) {
    try {
      await auth.fetchUser()

      if (!auth.isAuthenticated) {
        // No hay sesión → redirijo al login ANTES de montar Vue
        window.location.href = '/login'
        return
      }
    } catch (err) {
      console.error('Error verificando usuario en init():', err)
      window.location.href = '/login'
      return
    }
  }

  // Si llegamos acá: o es ruta pública, o ya está autenticado
  app.mount('#app')
}

init()
