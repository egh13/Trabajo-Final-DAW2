<template>
  <div class="admin-dashboard">
    <div class="module-grid">
      <router-link
        v-for="card in cards"
        :key="card.to"
        :to="card.to"
        class="module-card"
      >
        <span class="module-icon">{{ card.icon }}</span>
        <h3>{{ card.label }}</h3>
        <p>{{ card.description }}</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
const cards = [
  { to: '/admin/audit-logs', icon: '📋', label: 'Registros de auditoría', description: 'Visualiza todas las acciones realizadas en la plataforma.' },
  { to: '/admin/users', icon: '👥', label: 'Gestión de usuarios', description: 'Administra cuentas y roles de usuario.' },
  { to: '/admin/products', icon: '📦', label: 'Gestión de productos', description: 'Controla el catálogo de productos.' },
  { to: '/admin/orders', icon: '🧾', label: 'Pedidos', description: 'Revisa y gestiona los pedidos realizados.' },
  { to: '/admin/analytics', icon: '📈', label: 'Analíticas', description: 'Estadísticas y métricas de la tienda.' },
  { to: '/admin/settings', icon: '⚙️', label: 'Configuración', description: 'Ajustes generales del sistema.' },
]
</script>

<style scoped>
.admin-dashboard {
  max-width: 900px;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.module-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none;
  color: #1a1a2e;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e8e8e8;
}

.module-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.module-icon {
  font-size: 2rem;
}

.module-card h3 {
  margin: 0.75rem 0 0.5rem;
  font-size: 1.1rem;
}

.module-card p {
  margin: 0;
  font-size: 0.85rem;
  color: #777;
  line-height: 1.4;
}
</style>
