<template>
  <div class="relative">
    <div class="absolute left-0 top-1/2 z-10 -translate-y-1/2">
      <button
        class="swiper-button-prev-custom text-2xl px-4 py-2 h-30 hover:bg-gray-100 text-black opacity-50"
      >
        ◀
      </button>
    </div>
    <div class="absolute right-0 top-1/2 z-10 -translate-y-1/2">
      <button
        class="swiper-button-next-custom text-2xl px-4 py-2 h-30 hover:bg-gray-100 text-black opacity-50"
      >
        ▶
      </button>
    </div>
    <div class="overflow-hidden">
      <Swiper
        :navigation="{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }"
        :slides-per-view="1"
        :modules="[Navigation, Autoplay, Pagination]"
        class="mySwiper w-full"
        :loop="true"
        :pagination="{
          clickable: true,
        }"
        :autoplay="{
          delay: 4500,
          disableOnInteraction: false,
        }"
      >
        <SwiperSlide v-for="image in images" :key="image.id" class="">
          <div class="w-full flex justify-center items-center">
            <img :src="image.src" :alt="image.alt" class="w-full h-full object-contain" />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Autoplay, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Definir las imágenes
import image1 from '@/assets/Nueva-biblioteca-digital.png'

const images = [
  { src: image1, alt: 'Image 1', id: 1 },
  { src: image1, alt: 'Image 2', id: 2 },
  { src: image1, alt: 'Image 3', id: 3 },
  { src: image1, alt: 'Image 4', id: 4 },
]
</script>
