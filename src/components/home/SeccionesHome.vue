<template>
  <section class="bg-slate-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <header class="mb-4">
        <h2 class="text-lg sm:text-xl font-semibold text-slate-900">Otros recursos UMCE</h2>
        <p class="text-sm text-slate-500">
          Accede al catálogo físico, recursos en línea y repositorio institucional.
        </p>
      </header>

      <ul class="grid md:grid-cols-3 gap-4 sm:gap-6">
        <!-- Recursos en Línea -->
        <li>
          <a
            href="https://www.umce.cl/universidad/gobierno-central/biblioteca-recursos-en-linea/"
            target="_blank"
            rel="noopener"
            class="block h-full"
          >
            <div
              class="flex flex-col items-center gap-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-950 transition-all px-4 py-5 text-center"
            >
              <LogoRecursos class="w-12 h-12 sm:w-14 sm:h-14" />
              <div class="space-y-1">
                <p class="text-sm sm:text-base font-medium text-slate-900">Recursos en línea</p>
                <p class="text-xs text-slate-500">
                  Bases de datos, revistas y otros recursos suscritos.
                </p>
              </div>
              <span
                class="mt-1 inline-flex items-center gap-1 text-[11px] text-sky-600 font-medium"
              >
                Ir al sitio <span>⧉</span>
              </span>
            </div>
          </a>
        </li>

        <!-- Catálogo Biblioteca -->
        <li>
          <a
            href="http://hip.umce.cl/ipac20/ipac.jsp?session=1754H9168J184.40539&profile=bibumce&menu=search&ts=1754491688195&_gl=1*1etk5qp*_gcl_au*MTA5NTA2MDczNi4xNzU4NTQ4Nzg3LjExNjYzMTY2Mi4xNzYxMTM5MTE0LjE3NjExMzkxMTQ."
            target="_blank"
            rel="noopener"
            class="block h-full"
          >
            <div
              class="flex flex-col items-center gap-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-950 transition-all px-4 py-5 text-center"
            >
              <LogoCatalogo class="w-12 h-12 sm:w-14 sm:h-14" />
              <div class="space-y-1">
                <p class="text-sm sm:text-base font-medium text-slate-900">Catálogo biblioteca</p>
                <p class="text-xs text-slate-500">
                  Consulta los libros físicos y otros materiales.
                </p>
              </div>
              <span
                class="mt-1 inline-flex items-center gap-1 text-[11px] text-sky-600 font-medium"
              >
                Ir al catálogo <span>⧉</span>
              </span>
            </div>
          </a>
        </li>

        <!-- Repositorio DSpace -->
        <li>
          <a
            href="https://repositorio.umce.cl/home"
            target="_blank"
            rel="noopener"
            class="block h-full"
          >
            <div
              class="flex flex-col items-center gap-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-950 transition-all px-4 py-5 text-center"
            >
              <LogoRepo class="w-12 h-12 sm:w-14 sm:h-14" />
              <div class="space-y-1">
                <p class="text-sm sm:text-base font-medium text-slate-900">Repositorio DSpace</p>
                <p class="text-xs text-slate-500">
                  Tesis, trabajos académicos y producción institucional.
                </p>
              </div>
              <span
                class="mt-1 inline-flex items-center gap-1 text-[11px] text-sky-600 font-medium"
              >
                Ir al repositorio <span>⧉</span>
              </span>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import LogoRecursos from '@/assets/icons/recursos_en_linea.svg'
import LogoRepo from '@/assets/icons/repo.svg'
import LogoCatalogo from '@/assets/icons/catalogo.svg'
</script>
