<template>
  <div class="app-layout">
    <Navbar />
    <div class="app-content">
      <Sidebar />
      <main class="app-main p-3 p-md-4">
        <router-view />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/shared/components/Navbar.vue'
import Sidebar from '@/shared/components/Sidebar.vue'
import Footer from '@/shared/components/Footer.vue'
</script>

<style scoped></style>