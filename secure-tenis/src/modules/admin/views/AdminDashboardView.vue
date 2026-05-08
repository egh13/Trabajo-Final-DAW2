<template>
  <div class="container-fluid">    <h2 class="fw-bold mb-4">Panel de Administración</h2>

    <!-- Sección General -->    
    <h5 v-if="generalCards.length > 0" class="section-title text-muted mb-3" data-aos="fade-up">
      <i class="bi bi-grid me-2"></i>General
    </h5>
    <div v-if="generalCards.length > 0" class="row g-4 mb-4">
      <div class="col-md-4" v-for="(card, i) in generalCards" :key="card.to" data-aos="fade-up" :data-aos-delay="i * 80">
        <router-link :to="card.to" class="text-decoration-none">
          <div class="module-card h-100">
            <div class="card-body d-flex flex-column p-4">
              <div class="module-icon-wrapper mb-3" :style="{ background: card.bg }">
                <i class="bi module-icon" :class="card.icon"></i>
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

    <!-- Sección Seguridad -->    <h5 class="section-title text-muted mb-3" data-aos="fade-up">
      <i class="bi bi-shield-check me-2"></i>Seguridad
    </h5>
    <div class="row g-4">      <div class="col-md-4" v-for="(card, i) in securityCards" :key="card.to" data-aos="fade-up" :data-aos-delay="i * 80">
        <router-link :to="card.to" class="text-decoration-none">
          <div class="module-card h-100">
            <div class="card-body d-flex flex-column p-4">
              <div class="module-icon-wrapper mb-3" :style="{ background: card.bg }">
                <i class="bi module-icon" :class="card.icon"></i>
              </div>
              <h5 class="card-title fw-bold text-dark">{{ card.label }}</h5>
              <p class="card-text text-muted small mb-3">{{ card.description }}</p>
              <div class="mb-3">
                <span class="badge bg-dark bg-opacity-75 me-1" v-for="tag in card.tags" :key="tag">{{ tag }}</span>
              </div>
              <div class="mt-auto">
                <span class="module-enter fw-semibold small">Acceder →</span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const isAdmin = computed(() => authStore.hasAnyRole('admin'))

// Tarjetas de la sección General
const allGeneralCards = [
  {
    to: '/admin/usuarios',
    icon: 'bi-people',
    label: 'Gestión de Usuarios',
    description: 'Administra usuarios, roles y permisos del sistema. Crea, edita y elimina cuentas.',
    bg: 'linear-gradient(135deg, #8b5cf633, #0a0a0a22)',
    tags: ['Usuarios', 'Roles', 'Permisos'],
    adminOnly: true,
  },
  {
    to: '/admin/productos',
    icon: 'bi-box-seam',
    label: 'Gestión de Productos',
    description: 'Administra el catálogo de productos, precios, stock y categorías.',
    bg: 'linear-gradient(135deg, #06b6d433, #0a0a0a22)',
    tags: ['Productos', 'Precios', 'Stock'],
    adminOnly: true,
  },
  {
    to: '/admin/categorias',
    icon: 'bi-tags',
    label: 'Gestión de Categorías',
    description: 'Crea, edita y organiza las categorías disponibles en la tienda.',
    bg: 'linear-gradient(135deg, #f59e0b33, #0a0a0a22)',
    tags: ['Categorías', 'Organización', 'Catálogo'],
    adminOnly: true,
  },
]

const generalCards = computed(() =>
  allGeneralCards.filter(c => !c.adminOnly || isAdmin.value)
)

// Tarjetas de la sección Seguridad
const securityCards = [
  {
    to: '/admin/estado',
    icon: 'bi-display',
    label: 'Estado General',
    description: 'Monitoriza el estado del backend, la base de datos y los últimos logs del sistema.',
    bg: 'linear-gradient(135deg, #22c55e33, #0a0a0a22)',
    tags: ['Backend', 'Base de datos', 'Logs'],
  },  {
    to: '/admin/autenticacion',
    icon: 'bi-shield-lock',
    label: 'Autenticación y Accesos',
    description: 'Visualiza inicios de sesión, intentos fallidos y actividad de acceso con gráficos.',
    bg: 'linear-gradient(135deg, #3b82f633, #0a0a0a22)',
    tags: ['Sesiones', 'Intentos fallidos', 'Gráficos'],
  },
  {
    to: '/admin/bloqueos',
    icon: 'bi-shield-x',
    label: 'Control de Bloqueos',
    description: 'Gestiona bloqueos por IP o usuario, automáticos y manuales, con desbloqueo inmediato.',
    bg: 'linear-gradient(135deg, #ef444433, #0a0a0a22)',
    tags: ['IPs', 'Usuarios', 'Rate limiting'],
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
]
</script>

<style scoped>
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
  font-size: 1.8rem;
  color: #333;
}

.section-title {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
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
