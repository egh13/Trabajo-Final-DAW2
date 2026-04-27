<template>
  <div class="app-layout">
    <Navbar />
    <div class="app-content">
      <Sidebar />
      <main class="app-main p-3 p-md-4">
        <router-view v-slot="{ Component, route }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
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
.page-fade-leave-active {
  transition: opacity 0.08s ease;
}
.page-fade-enter-active {
  transition: opacity 0.15s ease;
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>