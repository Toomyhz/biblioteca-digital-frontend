<template>
  <section>
    <div v-for="carrera in carreras" :key="carrera.id_carrera" class="mb-8">
      <HomeCarreras v-bind:carrera />
    </div>
  </section>
</template>
<script setup>
import HomeCarreras from './HomeCarreras.vue'
import { getCarreras } from '@/data/api.js'
import { ref, onMounted } from 'vue'
const carreras = ref([])

const fetchCarreras = async () => {
  carreras.value = await getCarreras()
}
onMounted(fetchCarreras)
</script>
