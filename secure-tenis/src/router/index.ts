import MainLayout from '@/layouts/MainLayout.vue'
import HomeView from '@/modules/home/views/HomeView.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Definir rutas para el router
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    // Rutas que implementan el MainLayout
    children: [
      { path: '', name: 'Home', component: HomeView },
    ],
  },
]

// Crear router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
