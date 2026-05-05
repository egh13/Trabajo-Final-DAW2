<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold mb-0">Autenticación y Accesos</h2>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2 text-muted">Cargando estadísticas...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
    </div>

    <!-- Contenido con datos reales -->
    <template v-else-if="stats">      <div class="row g-3 mb-3">
        <div class="col-md-4">
          <div class="card border-0 shadow-sm text-center py-3">
            <div class="card-body">
              <div class="kpi-value text-success">{{ stats.totalLogins30d.toLocaleString('es-ES') }}</div>
              <div class="small text-muted">Inicios de sesión (30d)</div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm text-center py-3">
            <div class="card-body">
              <div class="kpi-value text-danger">{{ stats.failedAttempts30d }}</div>
              <div class="small text-muted">Intentos fallidos (30d)</div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm text-center py-3">
            <div class="card-body">
              <div class="kpi-value text-success">{{ stats.uniqueUsersToday }}</div>
              <div class="small text-muted">Usuarios activos hoy</div>
            </div>
          </div>
        </div>
      </div><div class="row g-3 mb-3">        <!-- Gráfico de logins vs fallidos -->
        <div class="col-md-8">
          <div class="card border-0 shadow-sm">
            <div class="card-header border-bottom py-2">
              <span class="fw-semibold small">Inicios de sesión vs Intentos fallidos (últimos 7 días)</span>
            </div>
            <div class="card-body">
              <div class="chart-container">
                <Bar :data="loginChartData" :options="loginChartOptions" />
              </div>
            </div>
          </div>
        </div>

        <!-- Últimas sesiones -->
        <div class="col-md-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header border-bottom py-2">
              <span class="fw-semibold small">Últimas sesiones</span>
            </div>
            <ul class="list-group list-group-flush">
              <li
                v-for="(s, i) in stats.recentSessions.slice(0, 5)"
                :key="i"
                class="list-group-item list-group-item-sm d-flex justify-content-between align-items-center py-1 px-3"
              >
                <div>
                  <div class="fw-semibold" style="font-size:0.8rem">{{ s.user }}</div>
                  <div class="text-muted" style="font-size: 0.72rem">{{ formatRelative(s.time) }}</div>
                </div>
                <span class="badge rounded-pill" :class="s.ok ? 'bg-success' : 'bg-danger'">
                  {{ s.ok ? 'OK' : 'Fallido' }}
                </span>
              </li>
              <li v-if="stats.recentSessions.length === 0" class="list-group-item text-center text-muted small py-3">
                Sin sesiones recientes
              </li>
            </ul>
          </div>
        </div>
      </div>      <!-- Tabla de intentos fallidos con filtros y paginación -->
      <div class="card border-0 shadow-sm">
        <div class="card-header border-bottom d-flex justify-content-between align-items-center py-2">
          <span class="fw-semibold small">
            <i class="bi bi-shield-exclamation me-2 text-danger"></i>Últimos intentos fallidos
          </span>
          <span class="badge bg-danger">{{ attemptsTotal }}</span>
        </div>

        <!-- Filtros -->
        <div class="card-body py-2 border-bottom">
          <div class="row g-2 align-items-end">
            <div class="col-md-5">
              <input
                v-model="attemptsFilters.search"
                type="text"
                class="form-control form-control-sm"
                placeholder="Email, IP, motivo..."
                @keyup.enter="applyFilters"
              />
            </div>
            <div class="col-md-3">
              <input v-model="attemptsFilters.from" type="date" class="form-control form-control-sm" />
            </div>
            <div class="col-md-3">
              <input v-model="attemptsFilters.to" type="date" class="form-control form-control-sm" />
            </div>
            <div class="col-md-1 d-grid">
              <button class="btn btn-success btn-sm" @click="applyFilters">
                <i class="bi bi-funnel"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-hover table-striped mb-0 align-middle">
            <thead class="table-dark">
              <tr>
                <th>Fecha/Hora</th>
                <th>Email</th>
                <th>IP</th>
                <th>Motivo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="attemptsLoading">
                <td colspan="4" class="text-center py-3 text-muted">
                  <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                  Cargando...
                </td>
              </tr>
              <tr v-else-if="attempts.length === 0">
                <td colspan="4" class="text-center text-muted py-3">Sin intentos fallidos registrados</td>
              </tr>
              <tr v-else v-for="(a, i) in attempts" :key="i">
                <td class="small font-monospace">{{ formatDate(a.createdAt) }}</td>
                <td class="small fw-semibold">{{ formatDetail(a.detail ?? '') }}</td>
                <td class="small font-monospace">{{ normalizeIp(a.ip ?? '') }}</td>
                <td><span class="badge bg-danger">{{ a.action }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div class="card-footer bg-white d-flex justify-content-between align-items-center py-2">
          <span class="small text-muted">
            {{ attemptsTotal }} registro{{ attemptsTotal !== 1 ? 's' : '' }}
          </span>
          <nav v-if="totalPages() > 1">
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" :class="{ disabled: attemptsFilters.page === 1 }">
                <a class="page-link" href="#" @click.prevent="goToPage((attemptsFilters.page ?? 1) - 1)">←</a>
              </li>
              <li
                v-for="p in visiblePages"
                :key="p"
                class="page-item"
                :class="{ active: p === attemptsFilters.page }"
              >
                <a
                  class="page-link"
                  :class="{ 'bg-success border-success text-white': p === attemptsFilters.page }"
                  href="#"
                  @click.prevent="goToPage(p)"
                >{{ p }}</a>
              </li>
              <li class="page-item" :class="{ disabled: attemptsFilters.page === totalPages() }">
                <a class="page-link" href="#" @click.prevent="goToPage((attemptsFilters.page ?? 1) + 1)">→</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { useAuthStats } from '@/modules/admin/composables/useAuthStats'
import { useFailedAttempts } from '@/modules/admin/composables/useFailedAttempts'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const { stats, loading, error, load } = useAuthStats()
const { attempts, total: attemptsTotal, loading: attemptsLoading, filters: attemptsFilters, applyFilters, goToPage, totalPages, visiblePages } = useFailedAttempts()

// Datos del gráfico de logins vs fallidos por día
const loginChartData = computed(() => ({
  labels: stats.value?.chartData.map((d) => d.day) ?? [],
  datasets: [
    {
      label: 'Exitosos',
      data: stats.value?.chartData.map((d) => d.ok) ?? [],
      backgroundColor: '#22c55e',
      borderRadius: 4,
    },
    {
      label: 'Fallidos',
      data: stats.value?.chartData.map((d) => d.fail) ?? [],
      backgroundColor: '#ef4444',
      borderRadius: 4,
    },
  ],
}))

const loginChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' as const } },
  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
}

// Formatea una fecha ISO a formato legible
const formatDate = (iso: string): string => {
  return new Date(iso).toLocaleString('es-ES', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

// Formatea una fecha ISO a fecha y hora exacta en formato local
const formatRelative = (iso: string): string =>
  new Date(iso).toLocaleString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

// Normaliza IPs IPv4-mapped IPv6 a formato IPv4 puro
const normalizeIp = (ip: string): string =>
  ip.startsWith('::ffff:') ? ip.slice(7) : (ip || '—')

// Extrae el valor del campo detail eliminando el prefijo "email: "
const formatDetail = (detail: string): string =>
  detail.startsWith('email: ') ? detail.slice(7) : (detail || '—')

onMounted(() => {
  load()
  applyFilters()
})
</script>

<style scoped>
.kpi-value {
  font-size: 1.9rem;
  font-weight: 800;
  line-height: 1.2;
}

.chart-container {
  position: relative;
  height: 260px;
  width: 100%;
}
</style>
