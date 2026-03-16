<template>
  <div class="d-flex flex-column gap-4">
    <HeroBanner @scroll-to-products="scrollToProducts" />
    <FeaturedProducts ref="productsSection" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HeroBanner from '../components/HeroBanner.vue'
import FeaturedProducts from '../components/FeaturedProducts.vue'

const productsSection = ref<InstanceType<typeof FeaturedProducts> | null>(null)

// Función de easing: easeInOutCubic — aceleración suave al inicio y al final
const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

const scrollToProducts = () => {
  const el = productsSection.value?.$el as HTMLElement | undefined
  if (!el) return

  const start = window.scrollY
  const target = el.getBoundingClientRect().top + window.scrollY - 16
  const distance = target - start
  const duration = 800 // ms
  let startTime: number | null = null

  const step = (timestamp: number) => {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)

    window.scrollTo(0, start + distance * easeInOutCubic(progress))

    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}
</script>

<style scoped></style>