<template>
  <aside class="sidebar">
    <h3>Categorías</h3>
    <ul>
      <li><router-link to="/products?category=1">Tenis</router-link></li>
      <li><router-link to="/products?category=2">Ropa</router-link></li>
      <li><router-link to="/products?category=3">Accesorios</router-link></li>
    </ul>
  </aside>
</template>

<script setup lang="ts"></script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #f5f5f5;
  padding: 1rem;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  margin-bottom: 0.5rem;
}
.sidebar a {
  text-decoration: none;
  color: #333;
}
</style>