<template>
  <div class="app-layout">
    <Navbar />
    <main :class="['app-main', isAuthRoute ? 'app-main--auth' : 'p-3 p-md-4']">
      <router-view v-slot="{ Component, route }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/shared/components/Navbar.vue'
import Footer from '@/shared/components/Footer.vue'

const route = useRoute()

// Rutas de autenticación que no deben tener padding ni fondo del layout
const isAuthRoute = computed(() => ['/login', '/register'].includes(route.path))
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