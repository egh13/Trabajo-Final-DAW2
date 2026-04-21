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
          <!-- Enlace al panel de admin (solo admin/analista) -->
          <li v-if="showAdminLink" class="nav-item d-flex align-items-center">
            <router-link class="nav-link admin-link d-flex align-items-center gap-2 py-1 px-3 fw-semibold" to="/admin">
              <span class="admin-pulse">🛡️</span>
              <span class="admin-text">Panel Admin</span>
            </router-link>
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

const showAdminLink = computed(() =>
  !!user.value && ['admin', 'analista'].includes(user.value.role)
)

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

.admin-link {
  border: 1px solid rgba(34, 197, 94, 0.4);
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(0, 0, 0, 0.3));
  font-size: 0.85rem;
  line-height: 1;
  transition: background 0.3s, box-shadow 0.3s;
}

.admin-link:hover {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(0, 0, 0, 0.5));
  box-shadow: 0 0 14px rgba(34, 197, 94, 0.5);
}

.admin-pulse {
  display: inline-block;
  animation: pulse-glow 2s ease-in-out infinite;
}

.admin-text {
  background: linear-gradient(90deg, #22c55e, #86efac, #22c55e);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}

@keyframes pulse-glow {
  0%, 100% { transform: scale(1); filter: brightness(1) drop-shadow(0 0 0px #22c55e); }
  50% { transform: scale(1.25); filter: brightness(1.4) drop-shadow(0 0 6px #22c55e); }
}

@keyframes shimmer {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}
</style>