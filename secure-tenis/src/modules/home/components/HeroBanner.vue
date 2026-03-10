<template>
  <section class="hero-banner">
    <h1>Bienvenido a Mi Ecommerce</h1>
    <p>Encuentra los mejores productos al mejor precio</p>
    <button @click="$router.push('/products')" class="btn-primary">
      Ver Productos
    </button>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.hero-banner {
  background-color: #f5f5f5;
  text-align: center;
  padding: 3rem 1rem;
}
.btn-primary {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #4f46e5;
  color: white;
  border-radius: 0.5rem;
  cursor: pointer;
}
</style>