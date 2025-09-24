<script setup>
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { onMounted } from 'vue'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const err = route.query.auth_error
  if (err) {
    const messages = {
      invalid_state: 'La sesión de autenticación expiró. Intenta nuevamente.',
      token_exchange_failed: 'No se pudo validar con el proveedor.',
      invalid_nonce: 'Validación de seguridad fallida.',
      email_unverified: 'Tu email no está verificado en Google.',
      invalid_domain: 'Tu correo no pertenece al dominio permitido.',
    }
    await Swal.fire({
      icon: 'error',
      title: 'Error de autenticación',
      text: messages[err] || 'No se pudo iniciar sesión.',
    })
    // Limpia la query para no re-mostrar al refrescar:
    router.replace({ path: '/login', query: {} })
  }
})

function goLogin() {
  window.location.href = import.meta.env.VITE_BACKEND_URL + '/auth/login'
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
            <button @click="goLogin" class="text-white py-2 px-4 rounded w-full">Google</button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <img src="@/assets/LogoUMCE-f-blanco-V.png" alt="Logo-Umce" class="w-32" />
    </div>
  </main>
</template>

<style scoped>
main {
  background-image:
    linear-gradient(rgba(26, 20, 77, 0.759), rgba(0, 0, 0, 0.753)), url('@/assets/umce-area.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
}
button {
  transition: background-color 0.3s ease;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  background-color: rgb(30, 60, 120);
}
</style>
