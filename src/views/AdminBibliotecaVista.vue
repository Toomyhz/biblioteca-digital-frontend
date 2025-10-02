<template>
  <div class="flex flex-col lg:flex-row flex-1">
    <div class="w-full lg:w-auto">
      <AdminSidebar />
      <AdminLibros v-show="mostrarLibros" />
    </div>
    <main class="flex-1 overflow-y-auto p-6">
      <RouterView />
    </main>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AdminLibros from '@/components/admin/AdminLibros.vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'

const mostrarLibros = ref(true)
const route = useRoute()
watch(
  () => route.name,
  (newName) => {
    mostrarLibros.value = newName === 'AdminBiblioteca'
  },
  { immediate: true },
)
</script>
