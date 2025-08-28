<template>
  <div ref="dropdownContainer" class="relative w-f">
    <button
      type="button"
      @click="mostrarMenuPerfil = !mostrarMenuPerfil"
      class="flex items-center w-10 text-white hover:bg-blue-900 cursor-pointer"
    >
      <img src="@/assets/user-icon.jpg" alt="" class="rounded-full" />
    </button>
    <ul
      :class="[
        'absolute right-0 mt-2 bg-white text-black rounded shadow-lg overflow-hidden transition-all duration-200 ease-in-out',
        mostrarMenuPerfil ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none',
      ]"
      class="w-40 z-50"
    >
      <li class="px-4 py-2 hover:bg-gray-200 cursor-pointer">
        <router-link to="/admin-biblioteca" class="text-black w-full">Administrador</router-link>
      </li>
      <li class="px-4 py-2 hover:bg-gray-200 cursor-pointer">Libros Guardados</li>
      <li class="px-4 py-2 hover:bg-gray-200 cursor-pointer">Cerrar sesión</li>
    </ul>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const mostrarMenuPerfil = ref(false)

const dropdownContainer = ref(null)

const handleClickFuera = (e) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(e.target)) {
    mostrarMenuPerfil.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickFuera)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickFuera)
})
</script>
