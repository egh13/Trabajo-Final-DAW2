<template>
  <section class="hero-banner text-center py-5 px-3 rounded-3 mb-4">
    <div class="hero-content">
      <span class="badge bg-accent text-white mb-3 px-3 py-2 fs-6">Nueva Colección 2026</span>
      <h1 class="display-5 fw-bold text-white mb-3">
        Bienvenido a <span class="text-accent">Secure Tenis</span>
      </h1>
      <p class="lead text-light mb-4 mx-auto" style="max-width: 520px;">
        Los mejores tenis para cada ocasión. Calidad y estilo en cada paso.
      </p>      <button class="btn btn-accent btn-lg px-5 shadow" @click="emit('scroll-to-products')">
        Ver Productos <i class="bi bi-arrow-down ms-2"></i>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'scroll-to-products'): void
}>()
</script>

<style scoped>
.hero-banner {
  background: linear-gradient(135deg, var(--color-dark) 0%, var(--color-dark-surface) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.hero-content {
  max-width: 640px;
  margin: 0 auto;
}

.bg-accent {
  background-color: var(--color-accent) !important;
}

.btn-accent {
  background-color: var(--color-accent);
  border-color: var(--color-accent);
  color: #fff;
  font-weight: 600;
  transition: background var(--transition-speed), transform 0.15s;
}

.btn-accent:hover {
  background-color: #c73652;
  border-color: #c73652;
  color: #fff;
  transform: translateY(-1px);
}
</style>