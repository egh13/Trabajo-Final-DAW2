<template>
  <footer class="app-footer py-3 mt-auto">
    <div class="container-fluid text-center">
      <small class="footer-text">
        © {{ year }} <span class="text-accent fw-semibold">Secure Tenis</span>. Todos los derechos reservados.
      </small>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style scoped>
.app-footer {
  background: var(--color-espresso);
  border-top: 1px solid rgba(200, 200, 200, 0.1);
}

.footer-text {
  color: rgba(200, 200, 200, 0.5);
}
</style>