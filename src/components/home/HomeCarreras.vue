<template>
  <div class="px-10 lg:px-20 text-blue-800 py-5">
    <div class="flex justify-between items-center p-4">
      <h2 class="text-2xl">
        <strong>Libros de la carrera: {{ carrera.nombre }}</strong>
      </h2>
      <router-link
        :to="{ path: '/biblioteca', query: { carrera: carrera.id } }"
        class="text-white bg-blue-950 hover:bg-blue-800 transition-all duration-200 ease-in-out px-4 py-2 rounded"
        >Ver todos</router-link
      >
    </div>
    <div class="relative">
      <div class="absolute left-0 top-1/2 z-10 -translate-y-1/2 hidden lg:block">
        <button
          :class="`swiper-button-prev-${carrera.id}`"
          class="text-2xl px-4 py-2 h-30 hover:bg-gray-100 text-black opacity-50"
        >
          ◀
        </button>
      </div>
      <div class="absolute right-0 top-1/2 z-10 -translate-y-1/2 hidden lg:block">
        <button
          :class="`swiper-button-next-${carrera.id}`"
          class="text-2xl px-4 py-2 h-30 hover:bg-gray-100 text-black opacity-50"
        >
          ▶
        </button>
      </div>
      <Swiper
        :modules="[Navigation, Autoplay]"
        :navigation="{
          nextEl: `.swiper-button-next-${carrera.id}`,
          prevEl: `.swiper-button-prev-${carrera.id}`,
        }"
        :breakpoints="{
          0: { slidesPerView: 3, spaceBetween: 10 },
          640: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 5, spaceBetween: 30 },
          1280: { slidesPerView: 7, spaceBetween: 20 },
        }"
        class="mySwiper"
        :autoplay="{
          delay: 2500,
          disableOnInteraction: false,
        }"
      >
        <SwiperSlide
          v-for="book in libros_servidos"
          :key="book.id"
          class="lg:min-h-[285px] lg:max-h-[285px] lg:w-[185px] min-h-[220px] text-xl bg-[#fff] text-[#000] rounded border-2 border-transparent hover:border-blue-800 hover:shadow-lg transition-all"
        >
          <RouterLink :to="`/info/${book.id}`" class="flex flex-col items-center p-1 w-[100%]">
            <img
              :src="book.portada ? book.portada : '/LIBRO_SIN_PORTADA.png'"
              alt="Portada"
              class="h-36 md:h-40 lg:h-56 rounded"
            />
            <p class="text-sm md:text-base self-start line-clamp-3">
              {{ book.titulo }}
            </p>
          </RouterLink>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Autoplay } from 'swiper/modules'
import { getLibros } from '@/data/api.js'

import 'swiper/css'
import 'swiper/css/navigation'

const props = defineProps({
  carrera: {
    type: Object,
    required: true,
  },
})

const libros_servidos = ref([])

onMounted(() => {
  libros_servidos.value = getLibros({
    page: 1,
    limit: 12,
    filtros: { carreras: [props.carrera.id] },
  })
})
</script>
