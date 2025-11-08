<template>
  <div ref="dropdownContainer" class="relative w-full">
    <button
      type="button"
      class="flex items-center w-10 h-10 rounded-full hover:ring-2 hover:ring-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      :aria-expanded="mostrarMenuPerfil ? 'true' : 'false'"
      aria-haspopup="menu"
      @click="toggleMenu"
      @keydown.escape.prevent="cerrarMenu"
    >
      <img
        v-if="avatarSrc"
        :src="avatarSrc"
        alt="Foto de perfil"
        class="w-10 h-10 rounded-full object-cover"
        referrerpolicy="no-referrer"
        @error="onImgError"
      />
      <div v-else class="w-10 h-10 rounded-full bg-gray-300" />
    </button>

    <ul
      v-show="mostrarMenuPerfil"
      role="menu"
      class="absolute right-0 mt-2 w-48 z-50 bg-white text-black rounded-lg shadow-lg overflow-hidden border border-gray-200"
    >
      <li role="menuitem" class="px-4 py-2 hover:bg-gray-100">
        <router-link to="/perfil" class="block w-full text-left">Mi perfil</router-link>
      </li>

      <li v-if="esAdmin" role="menuitem" class="px-4 py-2 hover:bg-gray-100">
        <router-link to="/admin-biblioteca/libros" class="block w-full text-left"
          >Administrador</router-link
        >
      </li>

      <li role="menuitem" class="px-4 py-2 hover:bg-gray-100">
        <button class="w-full text-left" @click="onLogout">Cerrar sesión</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'
import Swal from 'sweetalert2'

const auth = useAuthStore()
const onLogout = async () => {
  try {
    await auth.logout()
    router.push({ name: 'login' })
    Swal.fire('Sesión cerrada', 'Has cerrado sesión correctamente', 'success')
  } catch (e) {
    console.error(e)
  }
}

// Fallback (si quieres uno propio cámbialo)
const fallbackAvatar = 'https://ui-avatars.com/api/?name=U'

// Avatar seguro (evita NPE)
const avatarSrc = computed(() => auth?.user?.foto_perfil || fallbackAvatar)

// Link Admin solo si rol
const esAdmin = computed(() => auth?.user?.rol === 'admin')
console.log('ROL:', auth?.user?.rol)

const mostrarMenuPerfil = ref(false)
const dropdownContainer = ref(null)

function toggleMenu() {
  mostrarMenuPerfil.value = !mostrarMenuPerfil.value
}
function cerrarMenu() {
  mostrarMenuPerfil.value = false
}

function onImgError() {
  // Fuerza fallback si falla la carga
  // Nota: como avatarSrc es computed, puedes gestionar un local fallback:
  // aquí podrías setear un ref 'broken' y usarlo en computed si quieres.
}

function handleClickFuera(e) {
  if (dropdownContainer.value && !dropdownContainer.value.contains(e.target)) {
    cerrarMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickFuera)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickFuera)
})
</script>
