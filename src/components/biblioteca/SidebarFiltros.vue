<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
      @click.self="emitCerrar"
    ></div>
  </transition>

  <transition name="slide">
    <div
      v-if="visible"
      class="fixed md:static top-0 left-0 z-50 h-full md:h-auto w-full md:w-64 bg-gray-100 shadow-xl overflow-y-auto"
    >
      <div class="p-4 flex items-center justify-between border-b md:border-none">
        <h3 class="font-bold text-lg">Filtros</h3>
        <!-- Botón cerrar (solo en móvil) -->
        <button class="md:hidden text-gray-600 text-2xl font-bold" @click="emitCerrar">✕</button>
      </div>

      <!-- Contenido -->
      <div class="p-4">
        <!-- Carreras -->
        <div class="mb-4">
          <h4 class="text-sm font-semibold mb-2">Carreras</h4>
          <div
            v-for="carrera in carreras.slice(0, limiteCarreras)"
            :key="carrera.id"
            class="flex items-center space-x-2 mb-1"
          >
            <label class="w-full hover:bg-blue-900/40">
              <input
                type="checkbox"
                :value="carrera.slug_carrera"
                v-model="filtrosLocales.carreras"
                class="accent-blue-500"
              />
              <span>{{ carrera.nombre_carrera }}</span>
            </label>
          </div>
          <button
            v-if="limiteCarreras < carreras.length"
            @click="limiteCarreras += 5"
            class="text-blue-600 text-sm hover:underline mt-2"
          >
            Ver más
          </button>
          <button
            v-else-if="carreras.length > 5"
            @click="limiteCarreras = 5"
            class="text-blue-600 text-sm hover:underline mt-2"
          >
            Ver menos
          </button>
        </div>

        <!-- Autores -->
        <div class="mb-4">
          <h4 class="text-sm font-semibold mb-2">Autores</h4>
          <div
            v-for="autor in autores.slice(0, limiteAutores)"
            :key="autor.id"
            class="flex items-center space-x-2 mb-1"
          >
            <label class="w-full hover:bg-blue-900/40">
              <input
                type="checkbox"
                :value="autor.slug_autor"
                v-model="filtrosLocales.autores"
                class="accent-blue-500"
              />
              <span>{{ autor.nombre_completo }}</span>
            </label>
          </div>
          <button
            v-if="limiteAutores < autores.length"
            @click="limiteAutores += 5"
            class="text-blue-600 text-sm hover:underline mt-2"
          >
            Ver más
          </button>
          <button
            v-else-if="autores.length > 5"
            @click="limiteAutores = 5"
            class="text-blue-600 text-sm hover:underline mt-2"
          >
            Ver menos
          </button>
        </div>

        <!-- Botones -->
        <div class="flex flex-col md:flex-row md:space-x-2">
          <button
            @click="emitLimpiar"
            class="w-full md:w-auto mb-2 md:mb-0 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Limpiar filtros
          </button>
          <button
            @click="emitCerrar"
            class="w-full md:w-auto px-3 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch, ref } from 'vue'

const props = defineProps({
  visible: Boolean,
  autores: { type: Array, default: () => [] },
  carreras: { type: Array, default: () => [] },
  filtros: { type: Object, default: () => ({ autores: [], carreras: [], busqueda: '' }) },
})

const emit = defineEmits(['update-filtros', 'limpiar', 'update:visible'])

const limiteCarreras = ref(5)
const limiteAutores = ref(5)

const filtrosLocales = reactive({
  autores: [...props.filtros.autores],
  carreras: [...props.filtros.carreras],
  busqueda: props.filtros.busqueda || '',
})

//  Emitir cambios de filtros al padre
watch(
  filtrosLocales,
  (nuevoValor) => {
    emit('update-filtros', { ...nuevoValor })
  },
  { deep: true },
)

//  Limpiar filtros
function emitLimpiar() {
  filtrosLocales.autores = []
  filtrosLocales.carreras = []
  filtrosLocales.busqueda = ''
  emit('limpiar')
}

//  Cerrar panel
function emitCerrar() {
  emit('update:visible', false)
}
</script>

<style scoped>
/* Transiciones suaves */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
