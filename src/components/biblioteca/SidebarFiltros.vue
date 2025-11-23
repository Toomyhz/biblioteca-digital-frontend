<template>
  <!-- 🔹 Overlay móvil -->
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm md:hidden"
      @click.self="emitCerrar"
    ></div>
  </transition>

  <!-- 🔹 Panel lateral -->
  <transition name="slide">
    <div
      v-if="visible"
      class="fixed md:static top-0 left-0 z-50 h-full md:h-auto w-full md:w-72 bg-white text-slate-900 shadow-2xl md:shadow-sm overflow-y-auto md:rounded-2xl border border-slate-200"
    >
      <!-- Header -->
      <div class="p-4 flex items-center justify-between border-b border-slate-200">
        <div class="flex items-center gap-2">
          <div>
            <h3 class="font-semibold text-base leading-tight">Filtros</h3>
            <p class="text-[11px] text-slate-400 md:text-slate-500">
              Refina los resultados de la biblioteca
            </p>
          </div>
        </div>

        <!-- Botón cerrar (solo en móvil) -->
        <button class="md:hidden text-slate-300 text-2xl font-bold" @click="emitCerrar">✕</button>
      </div>

      <!-- Contenido -->
      <div class="p-4 space-y-6 text-sm">
        <!-- Carreras -->
        <section>
          <div class="flex items-center justify-between mb-2">
            <div>
              <h4
                class="text-xs font-semibold uppercase tracking-wide text-slate-400 md:text-slate-500"
              >
                Carreras
              </h4>
              <p class="text-[11px] text-slate-500 md:text-slate-500">Selecciona una o varias</p>
            </div>
          </div>

          <div class="space-y-1">
            <div
              v-for="carrera in carreras.slice(0, limiteCarreras)"
              :key="carrera.id"
              class="rounded-lg overflow-hidden"
            >
              <label
                class="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-slate-900/40 md:hover:bg-slate-100"
              >
                <input
                  type="checkbox"
                  :value="carrera.slug_carrera"
                  v-model="filtrosLocales.carreras"
                  class="accent-sky-500 w-4 h-4 rounded border-slate-400"
                />
                <span class="flex-1 truncate text-xs md:text-sm">
                  {{ carrera.nombre_carrera }}
                </span>
              </label>
            </div>
          </div>

          <div class="mt-2">
            <button
              v-if="limiteCarreras < carreras.length"
              @click="limiteCarreras += 5"
              class="text-xs text-sky-600 hover:underline"
            >
              Ver más
            </button>
            <button
              v-else-if="carreras.length > 5"
              @click="limiteCarreras = 5"
              class="text-xs text-sky-600 hover:underline"
            >
              Ver menos
            </button>
          </div>
        </section>

        <!-- Autores -->
        <section>
          <div class="flex items-center justify-between mb-2">
            <div>
              <h4
                class="text-xs font-semibold uppercase tracking-wide text-slate-400 md:text-slate-500"
              >
                Autores
              </h4>
              <p class="text-[11px] text-slate-500 md:text-slate-500">Filtra por autoría</p>
            </div>
          </div>

          <div class="space-y-1">
            <div
              v-for="autor in autores.slice(0, limiteAutores)"
              :key="autor.id"
              class="rounded-lg overflow-hidden"
            >
              <label
                class="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-slate-900/40 md:hover:bg-slate-100"
              >
                <input
                  type="checkbox"
                  :value="autor.slug_autor"
                  v-model="filtrosLocales.autores"
                  class="accent-sky-500 w-4 h-4 rounded border-slate-400"
                />
                <span class="flex-1 truncate text-xs md:text-sm">
                  {{ autor.nombre_completo }}
                </span>
              </label>
            </div>
          </div>

          <div class="mt-2">
            <button
              v-if="limiteAutores < autores.length"
              @click="limiteAutores += 5"
              class="text-xs text-sky-400 md:text-sky-600 hover:underline"
            >
              Ver más
            </button>
            <button
              v-else-if="autores.length > 5"
              @click="limiteAutores = 5"
              class="text-xs text-sky-400 md:text-sky-600 hover:underline"
            >
              Ver menos
            </button>
          </div>
        </section>

        <!-- Botones -->
        <div class="pt-2 flex flex-col md:flex-row md:space-x-2 gap-2">
          <button
            @click="emitLimpiar"
            class="w-full md:w-auto px-3 py-2 rounded-full text-xs sm:text-sm bg-sky-500 text-white font-medium hover:bg-sky-600 transition-colors"
          >
            Limpiar filtros
          </button>

          <button
            @click="emitCerrar"
            class="w-full md:w-auto px-3 py-2 rounded-full text-xs sm:text-sm bg-slate-800 text-slate-100 md:bg-slate-100 md:text-slate-800 hover:bg-slate-700 md:hover:bg-slate-200 transition-colors"
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
