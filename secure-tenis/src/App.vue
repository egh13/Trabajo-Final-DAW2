<template>
  <!-- Punto de entrada para la App -->
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

// Recuperar sesión del usuario si hay token almacenado
onMounted(() => authStore.fetchMe())
</script>

<style scoped>
</style>
