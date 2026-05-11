<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <h2>Panel de Administración</h2>
      </div>      <nav class="sidebar-nav">
        <div class="sidebar-section-label">General</div>
        <router-link
          v-for="item in generalItems"
          :key="item.to"
          :to="item.to"
          class="sidebar-link"
          exact-active-class="active"
        >
          <i class="bi sidebar-icon" :class="item.icon"></i>
          <span class="sidebar-label">{{ item.label }}</span>
        </router-link>

        <div class="sidebar-section-label mt-2">Seguridad</div>
        <router-link
          v-for="item in seguridadItems"
          :key="item.to"
          :to="item.to"
          class="sidebar-link"
          exact-active-class="active"
        >
          <i class="bi sidebar-icon" :class="item.icon"></i>
          <span class="sidebar-label">{{ item.label }}</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">        
          <router-link to="/" class="sidebar-link back-link">
          <i class="bi bi-house sidebar-icon"></i>
          <span class="sidebar-label">Volver a la tienda</span>
        </router-link>
      </div>
    </aside>
    <main class="admin-main">      
      <header class="admin-topbar">
        <h1>SecureTenis Administración</h1>
        <div class="topbar-user">
          <div class="user-avatar">{{ userName?.charAt(0).toUpperCase() }}</div>
          <div class="user-info">
            <span class="user-name">{{ userName }}</span>
            <span class="role-badge">{{ userRole }}</span>
          </div>
        </div>
      </header>
      <section class="admin-content">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const authStore = useAuthStore()

const userName = computed(() => authStore.userName)
const userRole = computed(() => authStore.userRole)

// Ítems del menú agrupados por sección
const allMenuItems = [
  { to: '/admin',              icon: 'bi-speedometer2', label: 'Dashboard',               section: 'general',   adminOnly: false },
  { to: '/admin/usuarios',     icon: 'bi-people',       label: 'Gestión de Usuarios',      section: 'general',   adminOnly: true  },
  { to: '/admin/productos',    icon: 'bi-box-seam',     label: 'Gestión de Productos',     section: 'general',   adminOnly: true  },
  { to: '/admin/categorias',   icon: 'bi-tags',         label: 'Gestión de Categorías',    section: 'general',   adminOnly: true  },
  { to: '/admin/estado',       icon: 'bi-display',      label: 'Estado General',           section: 'seguridad', adminOnly: false },  { to: '/admin/autenticacion',icon: 'bi-shield-lock',  label: 'Autenticación y Accesos',  section: 'seguridad', adminOnly: false },
  { to: '/admin/bloqueos',     icon: 'bi-shield-x',     label: 'Control de Bloqueos',      section: 'seguridad', adminOnly: false },
  { to: '/admin/auditoria',    icon: 'bi-journal-text', label: 'Auditoría de Actividad',   section: 'seguridad', adminOnly: false },
]

// Filtra los ítems según el rol del usuario autenticado
const menuItems = computed(() =>
  allMenuItems.filter(item => !item.adminOnly || authStore.hasAnyRole('admin'))
)

// Agrupa los ítems visibles por sección
const generalItems   = computed(() => menuItems.value.filter(i => i.section === 'general'))
const seguridadItems = computed(() => menuItems.value.filter(i => i.section === 'seguridad'))
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg, #F4F4F2);
}

.admin-sidebar {
  width: 250px;
  background: var(--color-surface, #1E1E1E);
  color: #fff;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  box-shadow: 2px 0 16px rgba(0, 0, 0, 0.25);
  border-right: 1px solid rgba(107, 30, 46, 0.2);
}

.sidebar-header {
  padding: 1.1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  background: var(--color-surface-2, #282828);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  width: 38px;
  height: 38px;
  background: var(--color-garnet, #6B1E2E);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
  color: #fff;
}

.sidebar-header h2 {
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0;
  color: #fff;
  letter-spacing: 0.01em;
}

.sidebar-subtitle {
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  display: block;
}

.sidebar-nav {
  flex: 1;
  padding: 0.75rem 0;
  overflow-y: auto;
}

.sidebar-section-label {
  padding: 0.5rem 1.25rem 0.25rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.35);
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 1.25rem;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  font-size: 0.875rem;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  border-left: 3px solid transparent;
}

.sidebar-link:hover {
  background: rgba(107, 30, 46, 0.14);
  color: rgba(255, 255, 255, 0.9);
  border-left-color: rgba(107, 30, 46, 0.5);
}

.sidebar-link.active {
  background: rgba(107, 30, 46, 0.22);
  color: #fff;
  border-left-color: var(--color-garnet, #6B1E2E);
  font-weight: 600;
}

.sidebar-icon {
  font-size: 1.05rem;
  width: 1.25rem;
  text-align: center;
  flex-shrink: 0;
}

.sidebar-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  padding: 0.5rem 0;
}

.back-link {
  color: rgba(255, 255, 255, 0.35) !important;
}

.back-link:hover {
  color: rgba(255, 255, 255, 0.7) !important;
  background: rgba(255, 255, 255, 0.05) !important;
  border-left-color: transparent !important;
}

.admin-main {
  flex: 1;
  margin-left: 250px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.admin-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #eeecec;
  border-bottom: 2px solid rgba(34, 197, 94, 0.2);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.topbar-left h1 {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-surface, #1E1E1E);
}

.admin-topbar h1 {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-surface, #1E1E1E);
}

.topbar-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 34px;
  height: 34px;
  background: var(--color-garnet, #6B1E2E);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.1rem;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-surface, #1E1E1E);
  line-height: 1.2;
}

.role-badge {
  background: var(--color-garnet, #6B1E2E);
  color: #fff;
  padding: 0.1rem 0.5rem;
  border-radius: 10px;
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  line-height: 1.4;
}

.admin-content {
  flex: 1;
  padding: 1.75rem;
  background: var(--color-bg, #F4F4F2);
}
</style>
