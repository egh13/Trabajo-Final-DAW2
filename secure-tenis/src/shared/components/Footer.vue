<template>
  <footer class="footer bg-dark text-white py-3 mt-auto">
    <div class="container-fluid text-center">
      <small class="text-secondary">
        © {{ year }} <span class="text-accent fw-semibold">Secure Tenis</span>. Todos los derechos reservados.
      </small>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
</style>