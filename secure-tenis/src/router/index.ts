import MainLayout from '@/layouts/MainLayout.vue'
import HomeView from '@/modules/home/views/HomeView.vue'
import ProductsView from '@/modules/products/views/ProductsView.vue'
import ZapatillasView from '@/modules/products/views/ZapatillasView.vue'
import AccesoriosView from '@/modules/products/views/AccesoriosView.vue'
import RopaView from '@/modules/products/views/RopaView.vue'
import CartView from '@/modules/cart/views/CartView.vue'
import ProductDetailView from '@/modules/products/views/ProductDetailView.vue'
import LoginView from '@/modules/auth/views/LoginView.vue'
import RegisterView from '@/modules/auth/views/RegisterView.vue'
import AdminLayout from '@/modules/admin/layouts/AdminLayout.vue'
import AdminDashboardView from '@/modules/admin/views/AdminDashboardView.vue'
import EstadoGeneralView from '@/modules/admin/views/EstadoGeneralView.vue'
import AutenticacionView from '@/modules/admin/views/AutenticacionView.vue'
import AuditoriaView from '@/modules/admin/views/AuditoriaView.vue'
import AdminUsersView from '@/modules/admin/views/AdminUsersView.vue'
import AdminProductsView from '@/modules/admin/views/AdminProductsView.vue'
import BloqueosView from '@/modules/admin/views/BloqueosView.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { UserRole } from '@/types'

// Metadatos de ruta para control de acceso
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    roles?: UserRole[]
    guestOnly?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [      { path: '', name: 'Home', component: HomeView },
      { path: 'productos', name: 'Products', component: ProductsView },
      { path: 'zapatillas', name: 'Zapatillas', component: ZapatillasView },
      { path: 'accesorios', name: 'Accesorios', component: AccesoriosView },
      { path: 'ropa', name: 'Ropa', component: RopaView },
      { path: 'cart', name: 'Cart', component: CartView },
      { path: 'producto/:id', name: 'ProductDetail', component: ProductDetailView },

      // Rutas de autenticación (solo para invitados)
      {
        path: 'login',
        name: 'Login',
        component: LoginView,
        meta: { guestOnly: true },
      },
      {
        path: 'register',
        name: 'Register',
        component: RegisterView,
        meta: { guestOnly: true },
      },
    ],
  },
  // Panel de administración / seguridad — solo admin y analista
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ['admin', 'analista'] as UserRole[] },
    children: [
      { path: '', name: 'admin-dashboard', component: AdminDashboardView },
      { path: 'estado', name: 'admin-estado', component: EstadoGeneralView },
      { path: 'autenticacion', name: 'admin-autenticacion', component: AutenticacionView },      { path: 'auditoria', name: 'admin-auditoria', component: AuditoriaView },      { path: 'usuarios', name: 'admin-usuarios', component: AdminUsersView, meta: { requiresAuth: true, roles: ['admin'] as UserRole[] } },
      { path: 'productos', name: 'admin-productos', component: AdminProductsView, meta: { requiresAuth: true, roles: ['admin'] as UserRole[] } },
      { path: 'bloqueos', name: 'admin-bloqueos', component: BloqueosView, meta: { requiresAuth: true, roles: ['admin'] as UserRole[] } },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// useAuthStore se cachea tras la primera importación dinámica.
// Una vez cacheado, el guard es completamente síncrono: Vue Router
// no espera ninguna Promise y el swap de componentes es inmediato.
type UseAuthStore = typeof import('@/stores/authStore')['useAuthStore']
let _useAuthStore: UseAuthStore | null = null

const applyGuard = (
  authStore: ReturnType<UseAuthStore>,
  to: Parameters<Parameters<typeof router.beforeEach>[0]>[0],
  next: Parameters<Parameters<typeof router.beforeEach>[0]>[2]
) => {
  if (to.meta.guestOnly && authStore.isAuthenticated) return next({ name: 'Home' })
  if (to.meta.requiresAuth && !authStore.isAuthenticated)
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  if (to.meta.roles?.length && !authStore.hasAnyRole(...(to.meta.roles as UserRole[])))
    return next({ name: 'Home' })
  next()
}

// Navigation guard para autenticación y autorización
router.beforeEach((to, _from, next) => {
  if (_useAuthStore) {
    // Ruta síncrona: sin await, Vue Router hace el swap al instante
    const authStore = _useAuthStore()
    if (authStore.token && !authStore.user) {
      authStore.fetchMe().then(() => applyGuard(authStore, to, next))
    } else {
      applyGuard(authStore, to, next)
    }
  } else {
    // Solo la primera navegación es async (importación dinámica)
    import('@/stores/authStore').then(m => {
      _useAuthStore = m.useAuthStore
      const authStore = _useAuthStore()
      if (authStore.token && !authStore.user) {
        authStore.fetchMe().then(() => applyGuard(authStore, to, next))
      } else {
        applyGuard(authStore, to, next)
      }
    })
  }
})

export default router
