<script setup>
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { onMounted } from 'vue'
import { BASE_URL } from '@/data/api'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const err = route.query.auth_error
  if (err) {
    const messages = {
      invalid_state: 'La sesión de autenticación expiró. Intenta nuevamente.',
      token_exchange_failed: 'No se pudo validar con el proveedor.',
      invalid_nonce: 'Validación de seguridad fallida.',
      email_unverified_or_invalid_domain:
        'Tu correo no pertenece al dominio permitido o email no verificado',
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
  globalThis.location.href = BASE_URL + '/api/auth/login'
}
</script>
<template>
  <main class="h-screen relative bg-[url('/umce-area.jpg')]">
    <div class="absolute inset-0 bg-blue-950/55"></div>
    <div class="relative">
      <div class="flex flex-col items-center justify-center text-white h-screen">
        <h1 class="font-mono text-5xl text-center">¡Bienvenido a Biblioteca Digital UMCE!</h1>
        <div class="max-w-xl">
          <p class="text-center text-lg md:text-2xl p-8">
            La Biblioteca Digital UMCE es un espacio virtual que ofrece acceso a una amplia gama de
            recursos digitales, incluyendo libros, artículos y otros materiales académicos.
          </p>
        </div>
        <div class="flex flex-col border rounded-md items-center p-4 md:max-w-xl">
          <p class="text-center text-lg">
            Para acceder, necesitas iniciar sesión a traves del siguiente botón, el cual te llevará
            a autenticarte con Google.
          </p>
          <div class="w-64">
            <button
              @click="goLogin"
              class="py-2 px-4 rounded w-full bg-blue-800 cursor-pointer font-bold text-lg"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
        <div class="w-36 py-8">
          <img src="@/assets/LogoUMCE-f-blanco-V.png" alt="Logo-Umce" />
        </div>
      </div>
    </div>
  </main>
</template>
