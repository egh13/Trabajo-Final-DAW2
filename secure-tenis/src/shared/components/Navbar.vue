<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark shadow-sm px-3">
    <div class="container-fluid">
      <router-link class="navbar-brand fw-bold" to="/">
        <span class="text-accent">Secure</span> Tenis
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
        aria-controls="mainNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav ms-auto gap-1">
          <li class="nav-item">
            <router-link class="nav-link" to="/" active-class="" exact-active-class="active">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/zapatillas">Zapatillas</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/accesorios">Accesorios</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/ropa">Ropa</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link position-relative" to="/cart">
              <i class="bi bi-cart3 me-1"></i>Carrito
              <span
                v-if="itemCount > 0"
                class="badge rounded-pill bg-accent cart-badge"
              >{{ itemCount }}</span>
            </router-link>
          </li>

          <!-- Usuario autenticado -->
          <li v-if="isAuthenticated" class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle d-flex align-items-center gap-1"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-person-circle"></i>
              <span class="d-none d-md-inline">{{ userName }}</span>
              <span class="badge bg-accent ms-1 role-badge">{{ roleName }}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark">
              <li class="dropdown-item-text small text-muted">
                {{ user?.email }}
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <button class="dropdown-item" @click="handleLogout">
                  <i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión
                </button>
              </li>
            </ul>
          </li>

          <!-- Usuario no autenticado -->
          <li v-else class="nav-item d-flex align-items-center gap-2 ms-md-2">
            <router-link class="nav-link btn btn-outline-light btn-sm px-3" to="/login">
              Entrar
            </router-link>
            <router-link class="nav-link btn btn-accent btn-sm px-3" to="/register">
              Registro
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()

const cartStore = useCartStore()
const { itemCount } = storeToRefs(cartStore)

const authStore = useAuthStore()
const { isAuthenticated, userName, user } = storeToRefs(authStore)

// Mapa de nombres legibles para los roles
const roleLabels: Record<string, string> = {
  admin: 'Admin',
  cliente: 'Cliente',
  analista: 'Analista',
}

const roleName = computed(() => roleLabels[user.value?.role ?? ''] ?? '')

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

onMounted(() => cartStore.load())
</script>

<style scoped>
.navbar {
  min-height: var(--navbar-height);
}

.navbar-brand {
  font-size: 1.25rem;
  letter-spacing: 0.03em;
}

.bg-accent {
  background-color: var(--color-accent) !important;
}

.btn-accent {
  background-color: var(--color-accent);
  color: #fff;
  border: none;
}

.btn-accent:hover {
  filter: brightness(1.1);
  color: #fff;
}

.cart-badge {
  position: absolute;
  top: 2px;
  right: -4px;
  font-size: 0.6rem;
}

.role-badge {
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>