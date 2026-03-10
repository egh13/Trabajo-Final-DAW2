<template>
  <div class="layout">
      <Navbar />
    <div class="content">
      <Sidebar />
      <main class="main-view">
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

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content {
  display: flex;
  flex: 1;
}
.main-view {
  flex: 1;
  padding: 2rem;
}
</style>