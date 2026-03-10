<template>
  <main>
    <HeroBanner />
    <FeaturedProducts />
  </main>
</template>

<script setup>
import HeroBanner from "../components/HeroBanner.vue"
import FeaturedProducts from "../components/FeaturedProducts.vue"
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>