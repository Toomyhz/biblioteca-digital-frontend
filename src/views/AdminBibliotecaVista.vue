<template>
  <div class="flex flex-col lg:flex-row flex-1">
    <div class="w-full lg:w-auto">
      <AdminSidebar />
    </div>
    <main class="flex-1 overflow-y-auto p-6">
      <RouterView />
    </main>
  </div>
</template>
<script setup>
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
</script>
