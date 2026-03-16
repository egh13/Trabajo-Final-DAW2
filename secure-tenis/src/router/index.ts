import MainLayout from '@/layouts/MainLayout.vue'
import HomeView from '@/modules/home/views/HomeView.vue'
import ZapatillasView from '@/modules/products/views/ZapatillasView.vue'
import AccesoriosView from '@/modules/products/views/AccesoriosView.vue'
import RopaView from '@/modules/products/views/RopaView.vue'
import CartView from '@/modules/cart/views/CartView.vue'
import ProductDetailView from '@/modules/products/views/ProductDetailView.vue'
import LoginView from '@/modules/auth/views/LoginView.vue'
import RegisterView from '@/modules/auth/views/RegisterView.vue'
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
    children: [
      { path: '', name: 'Home', component: HomeView },
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
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard para autenticación y autorización
router.beforeEach(async (to, _from, next) => {
  // Importación dinámica para evitar dependencia circular
  const { useAuthStore } = await import('@/stores/authStore')
  const authStore = useAuthStore()

  // Si hay token pero no hay usuario cargado, recuperar sesión
  if (authStore.token && !authStore.user) {
    await authStore.fetchMe()
  }

  // Rutas solo para invitados: redirigir al home si ya está autenticado
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next({ name: 'Home' })
  }

  // Rutas que requieren autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  // Rutas que requieren roles específicos
  if (to.meta.roles && to.meta.roles.length > 0) {
    if (!authStore.hasAnyRole(...to.meta.roles)) {
      return next({ name: 'Home' })
    }
  }

  next()
})

export default router
