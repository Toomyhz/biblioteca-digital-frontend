<template>
  <div class="p-4">Procesando login...</div>
</template>

<script setup>
import axios from 'axios'
import { onMounted } from 'vue'
import router from '@/router'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
onMounted(async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/auth/me', {
      withCredentials: true,
    })
    console.log('Respuesta de éxito de autenticación:', response)
    if (response.status === 200) {
      // Actualiza el estado de autenticación en el store
      await authStore.fetchUser()
      // Redirige al usuario a la página principal u otra página segura
      console.log('Usuario autenticado:', authStore.user)
      Swal.fire({
        icon: 'success',
        title: '¡Autenticación exitosa!',
        text: `Has iniciado sesión correctamente`,
        background: '#1e1e2f',
        color: '#fff',
      })
      router.push('/')
    } else {
      throw new Error('No se pudo verificar la autenticación')
    }
  } catch (error) {
    console.error('Error al verificar la autenticación:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo iniciar sesión. Intenta nuevamente.',
      background: '#1e1e2f',
      color: '#fff',
    })
    router.push('/login')
  }
})
</script>
