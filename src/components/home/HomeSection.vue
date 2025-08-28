<template>
  <section>
    <div v-for="carrera in carreras" :key="carrera.id" class="mb-8">
      <HomeCarreras v-bind:carrera />
    </div>
  </section>
</template>
<script setup>
import HomeCarreras from './HomeCarreras.vue'
import { carreras } from '@/data/carreras'
</script>
