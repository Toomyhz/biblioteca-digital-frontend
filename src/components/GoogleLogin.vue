<script setup>
import { onMounted, ref } from 'vue'
let client
const googleReady = ref(false)

onMounted(() => {
  const waitForGoogle = setInterval(() => {
    if (window.google && google.accounts) {
      clearInterval(waitForGoogle)
      googleReady.value = true

      client = google.accounts.oauth2.initCodeClient({
        client_id: '1069979014769-6rp1isa3hqb50188pbjhmrd0gm3093q0.apps.googleusercontent.com',
        scope: 'profile email',
        ux_mode: 'redirect',
        redirect_uri: 'http://localhost:5173/login/callback',
      })
    }
  }, 100)
})
const callback = () => {
  if (client) {
    console.log('Solicitando código...')
    client.requestCode()
  } else {
    console.warn('Cliente OAuth no inicializado aún.')
  }
}
</script>
<template>
  <main class="flex flex-col items-center justify-center text-white">
    <div class="flex flex-col items-center">
      <h1 class="font-mono text-5xl m-50">¡Bienvenido a Biblioteca Digital UMCE!</h1>
      <div class="max-w-xl">
        <p class="text-center text-2xl">
          La Biblioteca Digital UMCE es un espacio virtual que ofrece acceso a una amplia gama de
          recursos digitales, incluyendo libros, artículos y otros materiales académicos.
        </p>
        <div class="flex flex-col border rounded-md items-center p-4 mb-4">
          <p class="text-center text-lg">
            Para acceder, necesitas iniciar sesión a traves del siguiente botón, el cual te llevará
            a autenticarte con Google.
          </p>
          <div class="w-64">
            <button
              @click="callback"
              :disabled="!googleReady"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <img src="@/assets/LogoUMCE-f-blanco-V.png" alt="Logo-Umce" class="w-32 my-4" />
    </div>
  </main>
</template>

<style scoped>
main {
  background-image:
    linear-gradient(rgba(26, 20, 77, 0.5), rgba(0, 0, 0, 0.5)), url('@/assets/umce-area.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
}
</style>
