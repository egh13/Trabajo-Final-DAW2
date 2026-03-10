<template>
  <nav class="navbar">
    <div class="logo">Mi Ecommerce</div>
    <ul class="nav-links">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/products">Productos</router-link></li>
      <li><router-link to="/cart">Carrito</router-link></li>
      <li><router-link to="/login">Login</router-link></li>
    </ul>
  </nav>
</template>

<script setup lang="ts"></script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4f46e5;
  color: white;
  padding: 1rem 2rem;
}
.nav-links {
  display: flex;
  gap: 1rem;
  list-style: none;
}
.nav-links a {
  color: white;
  text-decoration: none;
}
</style>