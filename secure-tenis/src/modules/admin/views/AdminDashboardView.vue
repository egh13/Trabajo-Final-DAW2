<template>
  <div class="container-fluid">
    <h2 class="fw-bold mb-4">Bienvenido al Panel de Seguridad</h2>
    <div class="row g-4">
      <div class="col-md-4" v-for="card in cards" :key="card.to">
        <router-link :to="card.to" class="text-decoration-none">
          <div class="card h-100 module-card border-0">
            <div class="card-body d-flex flex-column">
              <div class="module-icon-wrapper mb-3" :style="{ background: card.bg }">
                <span class="module-icon">{{ card.icon }}</span>
              </div>
              <h5 class="card-title fw-bold text-dark">{{ card.label }}</h5>
              <p class="card-text text-muted small mb-3">{{ card.description }}</p>
              <div class="mb-3">
                <span class="badge bg-dark bg-opacity-75 me-1" v-for="tag in card.tags" :key="tag">{{ tag }}</span>
              </div>
              <div class="mt-auto">
                <span class="module-enter text-success fw-semibold small">Acceder →</span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cards = [
  {
    to: '/admin/estado',
    icon: '🖥️',
    label: 'Estado General',
    description: 'Monitoriza el estado del backend, la última copia de seguridad de la base de datos y los últimos logs del sistema.',
    bg: 'linear-gradient(135deg, #22c55e33, #0a0a0a22)',
    tags: ['Backend', 'Base de datos', 'Logs'],
  },
  {
    to: '/admin/autenticacion',
    icon: '🔐',
    label: 'Autenticación y Accesos',
    description: 'Visualiza inicios de sesión, intentos fallidos y actividad de acceso con gráficos en tiempo real.',
    bg: 'linear-gradient(135deg, #3b82f633, #0a0a0a22)',
    tags: ['Sesiones', 'Intentos fallidos', 'Gráficos'],
  },
  {
    to: '/admin/auditoria',
    icon: '📋',
    label: 'Auditoría de Actividad',
    description: 'Consulta la tabla completa de logs de actividad del sistema con opción de descarga.',
    bg: 'linear-gradient(135deg, #f59e0b33, #0a0a0a22)',
    tags: ['Logs', 'Tabla', 'Exportar'],
  },
]
</script>

<style scoped>
.module-card {
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  border: 1px solid #e5e7eb !important;
}

.module-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.4) !important;
}

.module-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.module-icon {
  font-size: 1.8rem;
}

.module-enter {
  opacity: 0;
  transition: opacity 0.2s;
}

.module-card:hover .module-enter {
  opacity: 1;
}
</style>
