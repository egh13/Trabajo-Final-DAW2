<template>
  <div class="admin-placeholder">
    <span class="placeholder-icon">🚧</span>
    <h2>{{ title }}</h2>
    <p>Este módulo está en construcción.</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const titles: Record<string, string> = {
  'admin-audit-logs': 'Registros de auditoría',
  'admin-users': 'Gestión de usuarios',
  'admin-products': 'Gestión de productos',
  'admin-orders': 'Pedidos',
  'admin-analytics': 'Analíticas',
  'admin-settings': 'Configuración',
}

const title = computed(() => titles[route.name as string] ?? 'Módulo')
</script>

<style scoped>
.admin-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #888;
}

.placeholder-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.admin-placeholder h2 {
  margin: 0 0 0.5rem;
  color: #333;
}

.admin-placeholder p {
  font-size: 0.95rem;
}
</style>
