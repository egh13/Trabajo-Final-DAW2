<template>
  <div class="container-fluid px-0">
    <div class="dashboard-hero mb-4" data-aos="fade-down">
      <div>
        <h2 class="fw-bold mb-1">Bienvenido al Panel de Administración</h2>
        <p class="text-muted mb-0 small">Gestiona todos los aspectos de SecureTenis desde aquí.</p>
      </div>
    </div>
    <div class="row g-3">
      <div
        class="col-lg-4 col-md-6"
        v-for="(card, index) in cards"
        :key="card.to"
        data-aos="fade-up"
        :data-aos-delay="index * 80"
      >
        <router-link :to="card.to" class="text-decoration-none">
          <div class="module-card h-100">
            <div class="card-body d-flex flex-column p-4">
              <div class="module-icon-wrapper mb-3" :style="{ background: card.bg }">
                <i :class="['bi', card.icon, 'module-icon']" :style="{ color: card.iconColor }"></i>
              </div>
              <h5 class="card-title fw-bold mb-1" style="color: var(--color-surface, #1E1E1E)">{{ card.label }}</h5>
              <p class="card-text text-muted small mb-3" style="line-height:1.5">{{ card.description }}</p>
              <div class="mb-3 d-flex flex-wrap gap-1">
                <span class="tag-badge" v-for="tag in card.tags" :key="tag">{{ tag }}</span>
              </div>
              <div class="mt-auto">
                <span class="module-enter fw-semibold small">Acceder <i class="bi bi-arrow-right ms-1"></i></span>
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
    icon: 'bi-display',
    label: 'Estado General',
    description: 'Monitoriza el estado del backend, la base de datos y los últimos logs del sistema.',
    bg: 'rgba(107, 30, 46, 0.08)',
    iconColor: 'var(--color-garnet, #6B1E2E)',
    tags: ['Backend', 'Base de datos', 'Logs'],
  },
  {
    to: '/admin/autenticacion',
    icon: 'bi-shield-lock',
    label: 'Autenticación y Accesos',
    description: 'Visualiza inicios de sesión, intentos fallidos y actividad de acceso con gráficos en tiempo real.',
    bg: 'rgba(122, 80, 64, 0.08)',
    iconColor: 'var(--color-brown, #7A5040)',
    tags: ['Sesiones', 'Intentos fallidos', 'Gráficos'],
  },
  {
    to: '/admin/auditoria',
    icon: 'bi-journal-text',
    label: 'Auditoría de Actividad',
    description: 'Consulta la tabla completa de logs de actividad del sistema con opción de descarga.',
    bg: 'rgba(30, 30, 30, 0.06)',
    iconColor: 'var(--color-surface, #1E1E1E)',
    tags: ['Logs', 'Tabla', 'Exportar'],
  },
  {
    to: '/admin/usuarios',
    icon: 'bi-people',
    label: 'Gestión de Usuarios',
    description: 'Administra usuarios, roles y permisos del sistema. Crea, edita y elimina cuentas.',
    bg: 'rgba(107, 30, 46, 0.06)',
    iconColor: 'var(--color-garnet, #6B1E2E)',
    tags: ['Usuarios', 'Roles', 'Permisos'],
  },
  {
    to: '/admin/productos',
    icon: 'bi-box-seam',
    label: 'Gestión de Productos',
    description: 'Administra el catálogo de productos, precios, stock y categorías.',
    bg: 'rgba(122, 80, 64, 0.06)',
    iconColor: 'var(--color-brown, #7A5040)',
    tags: ['Productos', 'Precios', 'Stock'],
  },
]
</script>

<style scoped>
.dashboard-hero {
  background: #fff;
  border: 1px solid var(--color-border, #CECECE);
  border-radius: 12px;
  padding: 1.5rem 1.75rem;
  border-left: 4px solid var(--color-garnet, #6B1E2E);
}

.module-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid var(--color-border, #CECECE);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  display: block;
}

.module-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(107, 30, 46, 0.12);
  border-color: rgba(107, 30, 46, 0.35);
}

.module-icon-wrapper {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.module-icon {
  font-size: 1.6rem;
}

.tag-badge {
  background: var(--color-bg-alt, #E8E8E6);
  color: var(--color-gray, #7A7A7A);
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.55rem;
  border-radius: 20px;
  letter-spacing: 0.02em;
}

.module-enter {
  color: var(--color-garnet, #6B1E2E);
  font-size: 0.82rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.module-card:hover .module-enter {
  opacity: 1;
}
</style>
