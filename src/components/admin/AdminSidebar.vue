<template>
  <aside class="w-screen lg:w-76 p-3 lg:sticky">
    <div class="bg-blue-950 text-white p-2 w-full block rounded-xl">
      <div class="flex justify-center items-center">
        <p class="text-lg">Administración</p>
      </div>
      <div>
        <RouterLink
          to="/admin-biblioteca/libros"
          class="block p-2 rounded border border-blue-800 hover:bg-blue-800 hover:border-white transition duration-200 ease-in-out"
          >Gestionar Libros</RouterLink
        >
        <RouterLink
          to="/admin-biblioteca/agregar-autor"
          class="block p-2 rounded border border-blue-800 hover:bg-blue-800 hover:border-white transition duration-200 ease-in-out"
          >Gestionar Autores</RouterLink
        >
        <RouterLink
          to="/admin-biblioteca/agregar-carrera"
          class="block p-2 rounded border border-blue-800 hover:bg-blue-800 hover:border-white transition duration-200 ease-in-out"
          >Gestionar Carreras</RouterLink
        >
      </div>
    </div>
  </aside>
</template>
<script setup></script>
