<template>
  <div class="container-fluid">
    <h2 class="fw-bold mb-4">Estado General del Sistema</h2>

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
    <template v-else-if="stats">
      <!-- Tarjetas de estado -->
      <div class="row g-3 mb-4">
        <div class="col-md-6">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center gap-3">
                <div class="status-indicator bg-success"></div>
                <div>
                  <h6 class="mb-0 text-muted small text-uppercase">Backend</h6>
                  <span class="fw-bold fs-5 text-dark">{{ stats.backend.status }}</span>
                </div>
              </div>
              <hr />
              <div class="row text-center small text-muted">
                <div class="col">
                  <div class="fw-semibold text-dark">{{ stats.backend.latencyMs }} ms</div>
                  Latencia
                </div>
                <div class="col">
                  <div class="fw-semibold text-dark">{{ stats.backend.version }}</div>
                  Versión
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center gap-3">
                <div class="status-indicator bg-success"></div>
                <div>
                  <h6 class="mb-0 text-muted small text-uppercase">Base de Datos</h6>
                  <span class="fw-bold fs-5 text-dark">{{ stats.database.status }}</span>
                </div>
              </div>
              <hr />
              <div class="row text-center small text-muted">
                <div class="col">
                  <div class="fw-semibold text-dark">{{ stats.database.engine }}</div>
                  Motor
                </div>
                <div class="col">
                  <div class="fw-semibold text-dark">{{ stats.database.tables }}</div>
                  Tablas
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contadores generales -->
      <div class="row g-3 mb-4">
        <div class="col" v-for="item in countCards" :key="item.label">
          <div class="card border-0 shadow-sm text-center py-3">
            <div class="card-body">
              <div class="kpi-value" :class="item.color">{{ item.value.toLocaleString('es-ES') }}</div>
              <div class="small text-muted">{{ item.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="row g-3 mb-4">
        <div class="col-md-7">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white fw-semibold">
              <i class="bi bi-bar-chart me-2"></i>Logs por Módulo
            </div>            <div class="card-body">
              <div class="chart-container">
                <Bar :data="moduleChartData" :options="barOptions" />
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-5">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white fw-semibold">
              <i class="bi bi-pie-chart me-2"></i>Logs por Nivel
            </div>
            <div class="card-body d-flex justify-content-center align-items-center">
              <div class="chart-container">
                <Doughnut :data="levelChartData" :options="doughnutOptions" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { fetchSystemStats } from '../services/logService'
import type { SystemStats } from '@/types'

// Registro de componentes Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

const stats = ref<SystemStats | null>(null)
const loading = ref(true)
const error = ref('')

// Colores por nivel de log
const levelColors: Record<string, string> = {
  info: '#22c55e',
  warn: '#f59e0b',
  error: '#ef4444',
  debug: '#3b82f6',
}

// Tarjetas de contadores
const countCards = computed(() => {
  if (!stats.value) return []
  const c = stats.value.counts
  return [
    { label: 'Usuarios', value: c.users, color: 'text-primary' },
    { label: 'Productos', value: c.products, color: 'text-success' },
    { label: 'Pedidos', value: c.orders, color: 'text-warning' },
    { label: 'Categorías', value: c.categories, color: 'text-info' },
    { label: 'Logs', value: c.logs, color: 'text-secondary' },
  ]
})

// Datos del gráfico de barras (logs por módulo)
const moduleChartData = computed(() => ({
  labels: stats.value?.logsByModule.map((m) => m.module) ?? [],
  datasets: [
    {
      label: 'Logs',
      data: stats.value?.logsByModule.map((m) => m.count) ?? [],
      backgroundColor: '#198754',
      borderRadius: 4,
    },
  ],
}))

// Datos del gráfico doughnut (logs por nivel)
const levelChartData = computed(() => ({
  labels: stats.value?.logsByLevel.map((l) => l.level.toUpperCase()) ?? [],
  datasets: [
    {
      data: stats.value?.logsByLevel.map((l) => l.count) ?? [],
      backgroundColor: stats.value?.logsByLevel.map((l) => levelColors[l.level] ?? '#6b7280') ?? [],
    },
  ],
}))

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' as const } },
}

// Carga de datos al montar el componente
onMounted(async () => {
  try {
    stats.value = await fetchSystemStats()
  } catch (e: any) {
    error.value = e.message || 'Error al cargar estadísticas del sistema'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.status-indicator {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
  }
}

.kpi-value {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;
}

.chart-container {
  position: relative;
  height: 260px;
  width: 100%;
}
</style>
