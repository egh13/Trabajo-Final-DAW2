<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  authStore.fetchMe()
  ;(window as any).AOS?.init({ duration: 650, once: true, easing: 'ease-out-cubic', offset: 60 })
})

router.afterEach(() => {
  setTimeout(() => (window as any).AOS?.refresh(), 50)
})
</script>
