<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <h2>🛡️ Panel de Seguridad</h2>
      </div>
      <nav class="sidebar-nav">
        <router-link
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="sidebar-link"
          active-class="active"
        >
          <span class="sidebar-icon">{{ item.icon }}</span>
          <span class="sidebar-label">{{ item.label }}</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <router-link to="/" class="sidebar-link back-link">
          <span class="sidebar-icon">🏠</span>
          <span class="sidebar-label">Volver a la tienda</span>
        </router-link>
      </div>
    </aside>
    <main class="admin-main">
      <header class="admin-topbar">
        <h1>{{ currentTitle }}</h1>
        <div class="topbar-user">
          <span>{{ userName }}</span>
          <span class="role-badge">{{ userRole }}</span>
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

const menuItems = [
  { to: '/admin', icon: '📊', label: 'Dashboard' },
  { to: '/admin/estado', icon: '🖥️', label: 'Estado General' },
  { to: '/admin/autenticacion', icon: '🔐', label: 'Autenticación y Accesos' },
  { to: '/admin/auditoria', icon: '📋', label: 'Auditoría de Actividad' },
  { to: '/admin/usuarios', icon: '👥', label: 'Gestión de Usuarios' },
]

const currentTitle = computed(() => {
  const match = menuItems.find((item) => item.to === route.path)
  return match?.label ?? 'Panel de Seguridad'
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f0f2f5;
}

.admin-sidebar {
  width: 260px;
  background: #0a0a0a;
  color: #fff;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  box-shadow: -2px 0 16px rgba(34, 197, 94, 0.2);
  border-left: 1px solid rgba(34, 197, 94, 0.15);
}

.sidebar-header {
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid rgba(34, 197, 94, 0.15);
  background: #111;
}

.sidebar-header h2 {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.02em;
  color: #22c55e;
}

.sidebar-nav {
  flex: 1;
  padding: 0.75rem 0;
  overflow-y: auto;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.95rem;
  transition: background 0.2s, color 0.2s;
  border-left: 3px solid transparent;
}

.sidebar-link:hover {
  background: rgba(34, 197, 94, 0.08);
  color: #22c55e;
}

.sidebar-link.active {
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
  border-left-color: #22c55e;
}

.sidebar-icon {
  font-size: 1.2rem;
  width: 1.5rem;
  text-align: center;
}

.sidebar-footer {
  border-top: 1px solid rgba(34, 197, 94, 0.15);
  padding: 0.5rem 0;
}

.back-link {
  color: rgba(255, 255, 255, 0.5);
}

.admin-main {
  flex: 1;
  margin-right: 260px;
  display: flex;
  flex-direction: column;
}

.admin-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #fff;
  border-bottom: 2px solid rgba(34, 197, 94, 0.2);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.admin-topbar h1 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  color: #0a0a0a;
}

.topbar-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #555;
}

.role-badge {
  background: #22c55e;
  color: #0a0a0a;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.admin-content {
  flex: 1;
  padding: 2rem;
}
</style>
