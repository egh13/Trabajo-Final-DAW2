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

const scrollToProducts = () => {
  const el = productsSection.value?.$el as HTMLElement | undefined
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped></style>