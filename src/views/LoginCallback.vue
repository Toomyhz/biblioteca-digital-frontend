<template>
  >
  <div
    v-if="isLoading"
    class="flex flex-col items-center mt-1 align-center justify-center pantalla-carga"
  >
    <span class="text-xl text-white">Procesando inicio de sesión...</span>
    <div class="loader my-4"></div>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import router from '@/router'
import Swal from 'sweetalert2'

const route = useRoute()
const isLoading = ref(false)

onMounted(async () => {
  if (route.path === '/login/callback') {
    const code = route.query.code
    if (code) {
      isLoading.value = true
      try {
        // Enviar el código al backend para realizar el login
        const response = await axios.post(
          'http://localhost:5000/api/auth/login',
          { code },
          {
            withCredentials: true, // Importante para enviar y recibir cookies
          },
        )

        if (response.status === 200) {
          // Si el login es exitoso, redirige al home
          router.push('/')
        } else {
          console.error('No se recibió un login exitoso')
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo iniciar sesión. Intenta nuevamente.',
            background: '#1e1e2f',
            color: '#fff',
          })
          router.push('/login')
        }
      } catch (error) {
        console.error('Error al enviar el código:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema con la autenticación. Por favor, intenta de nuevo.',
          background: '#1e1e2f',
          color: '#fff',
        })
        router.push('/login')
      } finally {
        isLoading.value = false // Detener el indicador de carga
      }
    }
  }
})
</script>
<style scoped>
.pantalla-carga {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
}
.loader {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
