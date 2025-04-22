<template>
  <div v-if="route.path === '/login'">
    <GoogleLogin />
  </div>
  <div v-else>
    <div v-if="isLoading" class="flex flex-col items-center mt-10">
      <span class="text-xl text-white">Procesando inicio de sesión...</span>
      <div class="loader my-4"></div>
    </div>
  </div>
</template>
<script setup>
import GoogleLogin from '@/components/GoogleLogin.vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { onMounted, ref } from 'vue'

const route = useRoute()
const isLoading = ref(false)

onMounted(async () => {
  if (route.path === '/login/callback') {
    const code = route.query.code
    if (code) {
      isLoading.value = true
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', { code })
        console.log('Código recibido:', response.data)
        // Aquí podrías guardar token, redirigir, etc.
      } catch (error) {
        console.error('Error al enviar el código:', error)
      } finally {
        isLoading.value = false
      }
    }
  }
})
</script>
<style scoped>
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
