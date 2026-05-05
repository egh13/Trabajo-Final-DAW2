<template>
  <nav class="app-navbar">
    <div class="nav-inner">

      <div class="nav-left">
        <button
          class="hamburger"
          :class="{ 'is-open': sidebar.isOpen.value }"
          @click="sidebar.toggle()"
          :aria-expanded="sidebar.isOpen.value"
          aria-label="Abrir o cerrar menú lateral"
        >
          <span class="bar bar-1" />
          <span class="bar bar-2" />
          <span class="bar bar-3" />
        </button>

        <router-link class="nav-brand" to="/" @click="sidebar.close()">
          <span class="brand-mark">ST</span>
          <span class="brand-divider" />
          <span class="brand-text">
            <span class="brand-light">Secure</span><span class="brand-bold">Tenis</span>
          </span>
        </router-link>
      </div>

      <div class="nav-right">

        <router-link v-if="showAdminLink" class="admin-chip" to="/admin">
          <i class="bi bi-shield-fill-check" />
          <span>Admin</span>
        </router-link>

        <router-link class="icon-btn" to="/cart" aria-label="Carrito">
          <i class="bi bi-bag" />
          <Transition name="badge-pop">
            <span v-if="itemCount > 0" class="cart-badge">{{ itemCount }}</span>
          </Transition>
        </router-link>

        <div v-if="isAuthenticated" class="user-menu" ref="userMenuRef">
          <button class="user-pill" @click="menuOpen = !menuOpen" :aria-expanded="menuOpen">
            <span class="pill-avatar">{{ userInitial }}</span>
            <span class="pill-name">{{ userName }}</span>
            <i class="bi bi-chevron-down pill-chevron" :class="{ rotated: menuOpen }" />
          </button>

          <Transition name="dd-pop">
            <div v-if="menuOpen" class="user-dropdown">
              <div class="dd-head">
                <div class="dd-avatar">{{ userInitial }}</div>
                <div class="dd-info">
                  <span class="dd-name">{{ userName }}</span>
                  <span class="dd-email">{{ user?.email }}</span>
                </div>
                <span class="dd-role">{{ roleName }}</span>
              </div>
              <div class="dd-body">
                <button class="dd-item dd-logout" @click="handleLogout">
                  <i class="bi bi-box-arrow-right" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <template v-else>
          <router-link class="btn-ghost" to="/login">Entrar</router-link>
          <router-link class="btn-fill" to="/register">Registro</router-link>
        </template>

      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useSidebar } from '@/shared/composables/useSidebar'

const router = useRouter()
const cartStore = useCartStore()
const { itemCount } = storeToRefs(cartStore)
const authStore = useAuthStore()
const { isAuthenticated, userName, user } = storeToRefs(authStore)
const sidebar = useSidebar()

const menuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  cliente: 'Cliente',
  analista: 'Analista',
}

const roleName = computed(() => roleLabels[user.value?.role ?? ''] ?? '')
const userInitial = computed(() => userName.value?.charAt(0).toUpperCase() ?? '?')
const showAdminLink = computed(() =>
  !!user.value && ['admin', 'analista'].includes(user.value.role)
)

const handleLogout = async () => {
  menuOpen.value = false
  await authStore.logout()
  router.push('/')
}

const onClickOutside = (e: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    menuOpen.value = false
  }
}

onMounted(() => {
  cartStore.load()
  document.addEventListener('click', onClickOutside)
})
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
/* ── Barra ── */
.app-navbar {
  position: sticky;
  top: 0;
  z-index: 300;
  height: var(--navbar-height, 60px);
  background: var(--color-espresso);
  border-bottom: 1px solid rgba(201, 170, 130, 0.12);
  box-shadow: 0 1px 0 rgba(107, 30, 46, 0.15), 0 4px 20px rgba(0, 0, 0, 0.4);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 1.25rem;
  max-width: 1440px;
  margin: 0 auto;
  gap: 1rem;
}

/* ── Izquierda ── */
.nav-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
}
.hamburger:hover { background: rgba(255, 255, 255, 0.06); }

.bar {
  display: block;
  width: 22px;
  height: 2px;
  background: rgba(201, 170, 130, 0.65);
  border-radius: 2px;
  margin: 0 auto;
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
              opacity 0.2s ease,
              background 0.2s ease;
  transform-origin: center;
}
.hamburger:hover .bar { background: var(--color-cream); }

.hamburger.is-open .bar-1 { transform: translateY(7px) rotate(45deg); }
.hamburger.is-open .bar-2 { opacity: 0; transform: scaleX(0); }
.hamburger.is-open .bar-3 { transform: translateY(-7px) rotate(-45deg); }

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  transition: opacity 0.2s;
}
.nav-brand:hover { opacity: 0.82; }

.brand-mark {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--color-garnet);
  color: var(--color-cream);
  font-weight: 900;
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(107, 30, 46, 0.4);
  flex-shrink: 0;
}

.brand-divider {
  width: 1px;
  height: 18px;
  background: rgba(201, 170, 130, 0.18);
}

.brand-text {
  font-size: 1.05rem;
  line-height: 1;
}
.brand-light { color: rgba(201, 170, 130, 0.65); font-weight: 400; }
.brand-bold  { color: var(--color-cream);         font-weight: 800; }

/* ── Derecha ── */
.nav-right {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.admin-chip {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.28rem 0.75rem;
  border-radius: 20px;
  border: 1px solid rgba(240, 192, 64, 0.35);
  background: rgba(240, 192, 64, 0.07);
  color: #f0c040;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-decoration: none;
  transition: background 0.2s, box-shadow 0.2s;
}
.admin-chip:hover {
  background: rgba(240, 192, 64, 0.16);
  box-shadow: 0 0 12px rgba(240, 192, 64, 0.3);
  color: #ffd966;
}

.icon-btn {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(201, 170, 130, 0.6);
  font-size: 1.1rem;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.icon-btn:hover {
  background: rgba(201, 170, 130, 0.08);
  color: var(--color-cream);
}

.cart-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  min-width: 16px;
  height: 16px;
  padding: 0 3px;
  border-radius: 8px;
  background: var(--color-garnet);
  color: var(--color-cream);
  font-size: 0.56rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.badge-pop-enter-active { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s; }
.badge-pop-leave-active { transition: transform 0.15s ease, opacity 0.15s; }
.badge-pop-enter-from, .badge-pop-leave-to { transform: scale(0); opacity: 0; }

/* ── Usuario ── */
.user-menu { position: relative; }

.user-pill {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.28rem 0.7rem 0.28rem 0.28rem;
  border-radius: 24px;
  border: 1px solid rgba(201, 170, 130, 0.14);
  background: rgba(201, 170, 130, 0.05);
  cursor: pointer;
  color: rgba(245, 240, 232, 0.65);
  font-size: 0.83rem;
  font-weight: 500;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}
.user-pill:hover {
  background: rgba(201, 170, 130, 0.1);
  border-color: rgba(107, 30, 46, 0.45);
  color: var(--color-cream);
}

.pill-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--color-garnet);
  color: var(--color-cream);
  font-weight: 700;
  font-size: 0.76rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pill-name {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@media (max-width: 560px) { .pill-name { display: none; } }

.pill-chevron {
  font-size: 0.65rem;
  transition: transform 0.25s ease;
}
.pill-chevron.rotated { transform: rotate(180deg); }

.user-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  width: 220px;
  background: #150D07;
  border: 1px solid rgba(201, 170, 130, 0.12);
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65);
  overflow: hidden;
  z-index: 400;
}

.dd-pop-enter-active {
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.18s ease;
}
.dd-pop-leave-active {
  transition: transform 0.16s ease, opacity 0.14s ease;
}
.dd-pop-enter-from, .dd-pop-leave-to {
  transform: translateY(-6px) scale(0.97);
  opacity: 0;
}

.dd-head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 0.9rem;
  background: rgba(201, 170, 130, 0.04);
  border-bottom: 1px solid rgba(201, 170, 130, 0.1);
}
.dd-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--color-garnet);
  color: var(--color-cream);
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.dd-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.08rem;
}
.dd-name {
  color: var(--color-cream);
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dd-email {
  color: rgba(201, 170, 130, 0.5);
  font-size: 0.66rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dd-role {
  font-size: 0.58rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  background: rgba(107, 30, 46, 0.2);
  color: rgba(201, 170, 130, 0.9);
  border: 1px solid rgba(107, 30, 46, 0.3);
  border-radius: 8px;
  padding: 0.12em 0.45em;
  white-space: nowrap;
  flex-shrink: 0;
}

.dd-body { padding: 0.4rem; }
.dd-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 0.7rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 0.83rem;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
.dd-logout { color: rgba(201, 170, 130, 0.8); }
.dd-logout:hover { background: rgba(107, 30, 46, 0.15); color: var(--color-cream); }

/* ── Invitado ── */
.btn-ghost, .btn-fill {
  padding: 0.38rem 0.9rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
}
.btn-ghost:hover, .btn-fill:hover { transform: translateY(-1px); }

.btn-ghost {
  color: rgba(245, 240, 232, 0.6);
  border: 1px solid rgba(201, 170, 130, 0.18);
  background: transparent;
}
.btn-ghost:hover { background: rgba(201, 170, 130, 0.08); color: var(--color-cream); }

.btn-fill {
  background: var(--color-garnet);
  color: var(--color-cream);
  box-shadow: 0 2px 10px rgba(107, 30, 46, 0.35);
}
.btn-fill:hover { box-shadow: 0 5px 18px rgba(107, 30, 46, 0.55); filter: brightness(1.1); }
</style>