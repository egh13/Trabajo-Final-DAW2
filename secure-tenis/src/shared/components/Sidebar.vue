<template>
  <div class="sidebar-wrapper" :class="{ collapsed: !isOpen }">
    <!-- Botón toggle -->
    <button
      class="toggle-btn btn btn-dark btn-sm shadow"
      @click="toggleSidebar"
      :aria-expanded="isOpen"
      aria-label="Abrir o cerrar menú lateral"
    >
      <i :class="isOpen ? 'bi bi-layout-sidebar-inset-reverse' : 'bi bi-layout-sidebar-inset'"></i>
    </button>

    <aside class="sidebar" :class="{ open: isOpen }">
      <div class="sidebar-header px-3 py-3">
        <span class="text-uppercase fw-bold sidebar-title text-secondary" style="font-size: 0.7rem; letter-spacing: 0.1em;">
          Explorar
        </span>
      </div>      <nav>
        <ul class="nav flex-column">
          <li class="nav-item">
            <!-- active-class="" evita que / quede activo en rutas hijas -->
            <router-link
              class="nav-link sidebar-link"
              to="/"
              active-class=""
              exact-active-class="router-link-active"
              @click="closeOnMobile"
            >
              <i class="bi bi-house nav-icon"></i>
              <span class="nav-label">Inicio</span>
            </router-link>
          </li>

          <li class="nav-item">
            <div class="sidebar-section-label px-3 pt-3 pb-1">
              <span class="text-uppercase text-secondary nav-label" style="font-size: 0.65rem; letter-spacing: 0.1em; font-weight: 700;">Tienda</span>
            </div>
          </li>

          <li class="nav-item">
            <router-link class="nav-link sidebar-link" to="/zapatillas" @click="closeOnMobile">
              <i class="bi bi-bag nav-icon"></i>
              <span class="nav-label">Zapatillas</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link sidebar-link" to="/accesorios" @click="closeOnMobile">
              <i class="bi bi-stars nav-icon"></i>
              <span class="nav-label">Accesorios</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link sidebar-link" to="/ropa" @click="closeOnMobile">
              <i class="bi bi-person nav-icon"></i>
              <span class="nav-label">Ropa</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

// Cierra el sidebar en pantallas pequeñas al navegar
const closeOnMobile = () => {
  if (window.innerWidth < 768) {
    isOpen.value = false
  }
}
</script>

<style scoped>
.sidebar-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  width: var(--sidebar-width);
  min-height: 100%;
  transition: width var(--transition-speed) ease;
  flex-shrink: 0;
}

.sidebar-wrapper.collapsed {
  width: var(--sidebar-collapsed-width);
}

.toggle-btn {
  position: absolute;
  top: 12px;
  right: -18px;
  z-index: 100;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
}

.toggle-btn:hover {
  background-color: var(--color-accent) !important;
  border-color: var(--color-accent) !important;
}

.sidebar {
  background-color: var(--color-dark);
  width: var(--sidebar-width);
  min-height: 100%;
  overflow: hidden;
  transition: width var(--transition-speed) ease, opacity var(--transition-speed) ease;
  opacity: 0;
  width: 0;
  pointer-events: none;
}

.sidebar.open {
  width: var(--sidebar-width);
  opacity: 1;
  pointer-events: all;
}

.sidebar-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #c0c0d8;
  padding: 0.75rem 1.25rem;
  border-left: 3px solid transparent;
  transition: background var(--transition-speed), color var(--transition-speed), border-color var(--transition-speed);
  white-space: nowrap;
  font-size: 0.95rem;
  font-weight: 500;
}

.sidebar-link:hover,
.sidebar-link.router-link-active {
  background-color: rgba(233, 69, 96, 0.12);
  color: #fff;
  border-left-color: var(--color-accent);
}

.nav-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.nav-label,
.sidebar-title {
  transition: opacity var(--transition-speed);
}

.sidebar-wrapper.collapsed .nav-label,
.sidebar-wrapper.collapsed .sidebar-title {
  opacity: 0;
}
</style>