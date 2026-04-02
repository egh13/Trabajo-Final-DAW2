<template>
  <!-- Punto de entrada para la App -->
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

onMounted(() => {
  authStore.fetchMe()
  // Inicializar AOS (cargado vía CDN en index.html)
  ;(window as any).AOS?.init({ duration: 650, once: true, easing: 'ease-out-cubic', offset: 60 })
})
</script>

<style scoped>
</style>
