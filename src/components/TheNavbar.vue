<template>
  <header class="bg-blue-950 px-6 py-3 lg:px-10 lg:h-24">
    <div
      class="flex flex-wrap lg:flex-nowrap justify-center lg:justify-between items-center text-white"
    >
      <div class="flex lg:justify-between items-center h-full py-2 lg:py-0">
        <router-link to="/"
          ><img src="/LogoUMCE-f-blanco-H.png" alt="Logo-Umce" class="h-16"
        /></router-link>
      </div>

      <div>
        <div class="pt-3 lg:pt-0">
          <nav>
            <ul class="flex gap-4 items-center">
              <li>
                <router-link
                  to="/"
                  class="text-xl px-3 rounded-full hover:bg-blue-900 transition duration-200"
                  >Inicio</router-link
                >
              </li>
              <li>
                <router-link
                  to="/biblioteca"
                  class="text-xl px-3 rounded-full hover:bg-blue-900 transition duration-200"
                  >Biblioteca</router-link
                >
              </li>
              <li>
                <DropdownPerfil></DropdownPerfil>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>
<script setup>
import DropdownPerfil from './navbar/DropdownPerfil.vue'
</script>
