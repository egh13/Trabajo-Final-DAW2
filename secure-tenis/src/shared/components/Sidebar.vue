<template>
  <Transition name="overlay-fade">
    <div v-if="sidebar.isOpen.value" class="sidebar-overlay" @click="sidebar.close()" />
  </Transition>

  <Transition name="sidebar-slide">
    <aside v-if="sidebar.isOpen.value" class="sidebar">

      <nav class="sidebar-nav">

        <router-link
          class="nav-link"
          to="/"
          active-class=""
          exact-active-class="nav-link--active"
          @click="closeOnMobile"
        >
          <span class="link-icon"><i class="bi bi-house-fill" /></span>
          <span class="link-label">Inicio</span>
        </router-link>

        <div class="nav-section-title">
          <span>Tienda</span>
          <div class="section-line" />
        </div>

        <router-link class="nav-link" to="/zapatillas" active-class="nav-link--active" @click="closeOnMobile">
          <span class="link-icon"><i class="bi bi-lightning-fill" /></span>
          <span class="link-label">Zapatillas</span>
          <span class="link-badge new-badge">New</span>
        </router-link>

        <router-link class="nav-link" to="/ropa" active-class="nav-link--active" @click="closeOnMobile">
          <span class="link-icon"><i class="bi bi-tags-fill" /></span>
          <span class="link-label">Ropa</span>
        </router-link>

        <router-link class="nav-link" to="/accesorios" active-class="nav-link--active" @click="closeOnMobile">
          <span class="link-icon"><i class="bi bi-stars" /></span>
          <span class="link-label">Accesorios</span>
        </router-link>

        <template v-if="authStore.isAuthenticated">
          <div class="nav-section-title">
            <span>Mi cuenta</span>
            <div class="section-line" />
          </div>

          <router-link class="nav-link" to="/cart" active-class="nav-link--active" @click="closeOnMobile">
            <span class="link-icon"><i class="bi bi-bag" /></span>
            <span class="link-label">Carrito</span>
            <span v-if="cartStore.itemCount > 0" class="link-badge cart-badge">{{ cartStore.itemCount }}</span>
          </router-link>

          <router-link
            v-if="authStore.hasAnyRole('admin', 'analista')"
            class="nav-link"
            to="/admin"
            active-class="nav-link--active"
            @click="closeOnMobile"
          >
            <span class="link-icon"><i class="bi bi-shield-fill-check" /></span>
            <span class="link-label">Admin</span>
          </router-link>
        </template>
      </nav>

      <div class="sidebar-footer">
        <template v-if="authStore.isAuthenticated">
          <div class="user-card">
            <div class="user-avatar">{{ userInitial }}</div>
            <div class="user-info">
              <span class="user-name">{{ authStore.userName }}</span>
              <span class="user-role">{{ authStore.userRole }}</span>
            </div>
            <button class="logout-btn" title="Cerrar sesión" @click="logout">
              <i class="bi bi-box-arrow-right" />
            </button>
          </div>
        </template>
        <template v-else>
          <router-link class="footer-btn footer-btn--login" to="/login" @click="closeOnMobile">
            <i class="bi bi-box-arrow-in-right" />
            Iniciar sesión
          </router-link>
          <router-link class="footer-btn footer-btn--register" to="/register" @click="closeOnMobile">
            <i class="bi bi-person-plus" />
            Registrarse
          </router-link>
        </template>
      </div>

    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useSidebar } from '@/shared/composables/useSidebar'

const sidebar = useSidebar()
const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()

const userInitial = computed(() =>
  authStore.userName ? authStore.userName.charAt(0).toUpperCase() : '?'
)

const closeOnMobile = () => {
  if (window.innerWidth < 992) sidebar.close()
}

const logout = async () => {
  await authStore.logout()
  sidebar.close()
  router.push('/')
}
</script>

<style scoped>
/* ── Overlay ── */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 199;
  backdrop-filter: blur(2px);
}
.overlay-fade-enter-active,
.overlay-fade-leave-active { transition: opacity 0.28s ease; }
.overlay-fade-enter-from,
.overlay-fade-leave-to { opacity: 0; }

/* ── Slide ── */
.sidebar-slide-enter-active {
  transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease;
}
.sidebar-slide-leave-active {
  transition: transform 0.24s cubic-bezier(0.55, 0, 1, 0.45), opacity 0.2s ease;
}
.sidebar-slide-enter-from,
.sidebar-slide-leave-to { transform: translateX(-100%); opacity: 0; }

/* ── Panel ── */
.sidebar {
  position: fixed;
  top: var(--navbar-height, 60px);
  left: 0;
  bottom: 0;
  width: 250px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  background: #0f1b34;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 6px 0 40px rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(233, 69, 96, 0.25) transparent;
}

/* ── Nav ── */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-section-title {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.9rem 1.2rem 0.35rem;
}
.nav-section-title span {
  color: rgba(192, 192, 216, 0.4);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  white-space: nowrap;
}
.section-line {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 1rem;
  margin: 0 0.5rem;
  border-radius: 10px;
  color: #7878a0;
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  transition: background 0.2s, color 0.2s, transform 0.18s ease;
}
.nav-link:hover {
  background: rgba(233, 69, 96, 0.09);
  color: #d0d0e8;
  transform: translateX(3px);
}
.nav-link--active {
  background: rgba(233, 69, 96, 0.15) !important;
  color: #fff !important;
  box-shadow: inset 3px 0 0 #e94560;
}

.nav-link--admin { color: #d4a800; }
.nav-link--admin .link-icon { color: #f0c040; }
.nav-link--admin:hover { background: rgba(240, 192, 64, 0.08); color: #ffd966; }

.link-icon {
  width: 22px;
  text-align: center;
  font-size: 0.95rem;
  color: #e94560;
  flex-shrink: 0;
  transition: transform 0.2s;
}
.nav-link:hover .link-icon { transform: scale(1.15); }
.nav-link--active .link-icon { color: #ff7088; }

.link-label { flex: 1; }

.link-badge {
  font-size: 0.6rem;
  font-weight: 700;
  border-radius: 20px;
  padding: 0.12em 0.5em;
  line-height: 1.5;
}
.new-badge {
  background: linear-gradient(135deg, #e94560, #ff8a65);
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.cart-badge {
  background: #e94560;
  color: #fff;
  min-width: 18px;
  text-align: center;
}

/* ── Footer ── */
.sidebar-footer {
  padding: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.7rem;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.07);
}
.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e94560, #c73652);
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.user-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.user-name {
  color: #e0e0f0;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-role {
  color: rgba(192, 192, 216, 0.45);
  font-size: 0.65rem;
  text-transform: capitalize;
}
.logout-btn {
  background: transparent;
  border: none;
  color: #7878a0;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 7px;
  transition: color 0.2s, background 0.2s;
}
.logout-btn:hover { color: #e94560; background: rgba(233, 69, 96, 0.1); }

.footer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.6rem;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.18s, box-shadow 0.18s, filter 0.18s;
}
.footer-btn:hover { transform: translateY(-2px); }

.footer-btn--login {
  background: linear-gradient(135deg, #e94560, #c73652);
  color: #fff;
  box-shadow: 0 3px 12px rgba(233, 69, 96, 0.3);
}
.footer-btn--login:hover { box-shadow: 0 6px 20px rgba(233, 69, 96, 0.5); filter: brightness(1.07); }

.footer-btn--register {
  background: rgba(255, 255, 255, 0.05);
  color: #9090b8;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.footer-btn--register:hover { background: rgba(255, 255, 255, 0.09); color: #d0d0e8; }
</style>