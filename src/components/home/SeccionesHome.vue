<template>
  <div class="m-4 md:m-16 flex justify-center">
    <ul class="grid md:grid-cols-3 gap-5 md:gap-20 w-2/4 text-xl md:text-2xl">
      <li class="rounded border md:border-0 hover:shadow-xl/40 transition-all duration-150">
        <a
          href="https://www.umce.cl/universidad/gobierno-central/biblioteca-recursos-en-linea/"
          class="flex flex-col items-center justify-between p-2"
        >
          <LogoRecursos class="w-16 h-16" />
          <span class="text-center">Recursos en Línea</span>
        </a>
      </li>
      <li class="rounded border md:border-0 hover:shadow-xl/40 transition-all duration-150">
        <a
          href="http://hip.umce.cl/ipac20/ipac.jsp?session=1754H9168J184.40539&profile=bibumce&menu=search&ts=1754491688195&_gl=1*1etk5qp*_gcl_au*MTA5NTA2MDczNi4xNzU4NTQ4Nzg3LjExNjYzMTY2Mi4xNzYxMTM5MTE0LjE3NjExMzkxMTQ."
          class="flex flex-col items-center justify-between p-2"
        >
          <LogoCatalogo class="w-16 h-16" />
          <span class="text-center">Catalogo Biblioteca</span>
        </a>
      </li>
      <li class="rounded border md:border-0 hover:shadow-xl/40 transition-all duration-150">
        <a
          href="https://repositorio.umce.cl/home"
          class="flex flex-col items-center justify-between p-2"
        >
          <LogoRepo class="w-16 h-16" />
          <span class="text-center">Repositorio DSpace</span>
        </a>
      </li>
    </ul>
  </div>
</template>
<script setup>
import LogoRecursos from '@/assets/icons/recursos_en_linea.svg'
import LogoRepo from '@/assets/icons/repo.svg'
import LogoCatalogo from '@/assets/icons/catalogo.svg'
</script>
