<script setup>
import TheNavbar from './components/TheNavbar.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <TheNavbar v-if="route.name != 'login' && route.name != 'test-lector'" />
  <RouterView class="bg-gray-200" />
</template>

<style scoped></style>
