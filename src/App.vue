<script setup>
import TheNavbar from './components/TheNavbar.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <div class="min-h-screen bg-gray-200">
    <TheNavbar v-if="route.name != 'login' && route.name != 'leer'" />
    <RouterView />
  </div>
</template>
