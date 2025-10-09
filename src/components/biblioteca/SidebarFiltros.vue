<!-- SidebarFiltros.vue -->
<template>
  <transition name="slide">
    <div v-if="visible" class="w-64 p-4 bg-gray-100 border-r h-full">
      <h3 class="font-bold mb-4">Filtros</h3>

      <label class="block mb-2">
        <span>Nombre:</span>
        <input v-model="filtroNombreLocal" class="mt-1 block w-full" type="text" />
      </label>

      <button @click="emitLimpiar" class="mt-4 px-3 py-1 bg-blue-500 text-white rounded">
        Limpiar filtros
      </button>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits, watch, ref } from 'vue'

const props = defineProps({
  visible: Boolean,
  modelValue: String,
})

const emit = defineEmits(['update:modelValue', 'limpiar'])
const filtroNombreLocal = ref(props.modelValue || '')

watch(filtroNombreLocal, (val) => emit('update:modelValue', val))

function emitLimpiar() {
  filtroNombreLocal.value = ''
  emit('limpiar')
}
</script>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
