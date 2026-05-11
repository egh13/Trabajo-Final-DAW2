<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold mb-0">Auditoría de Actividad</h2>      <div class="d-flex gap-2">
        <button class="btn btn-admin btn-sm" :disabled="exporting" @click="exportFile('csv')">
          <i class="bi bi-download me-1"></i> Exportar CSV
        </button>
        <button class="btn btn-outline-secondary btn-sm" :disabled="exporting" @click="exportFile('pdf')">
          <i class="bi bi-filetype-pdf me-1"></i> Exportar PDF
        </button>
      </div>
    </div>    
    <div class="card border-0 shadow-sm mb-4" data-aos="fade-up" data-aos-delay="80">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-md-3">
            <label class="form-label small fw-semibold text-muted">Buscar</label>
            <input v-model="filters.search" type="text" class="form-control form-control-sm" placeholder="Usuario, acción, IP..." @keyup.enter="applyFilters" />
          </div>
          <div class="col-md-2">
            <label class="form-label small fw-semibold text-muted">Nivel</label>
            <select v-model="filters.level" class="form-select form-select-sm">
              <option value="">Todos</option>
              <option value="INFO">INFO</option>
              <option value="WARNING">WARNING</option>
              <option value="ERROR">ERROR</option>
              <option value="DEBUG">DEBUG</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label small fw-semibold text-muted">Módulo</label>
            <select v-model="filters.module" class="form-select form-select-sm">              <option value="">Todos</option>
              <option value="Auth">Auth</option>
              <option value="Productos">Productos</option>
              <option value="Pedidos">Pedidos</option>
              <option value="Categorias">Categorias</option>
              <option value="Sistema">Sistema</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label small fw-semibold text-muted">Desde</label>
            <input v-model="filters.from" type="date" class="form-control form-control-sm" />
          </div>
          <div class="col-md-2">
            <label class="form-label small fw-semibold text-muted">Hasta</label>
            <input v-model="filters.to" type="date" class="form-control form-control-sm" />
          </div>
          <div class="col-md-1 d-grid">
            <button class="btn btn-admin btn-sm" @click="applyFilters">
              <i class="bi bi-funnel"></i>
            </button>
          </div>
        </div>
      </div>
    </div>    <div class="card border-0 shadow-sm" data-aos="fade-up" data-aos-delay="160">
      <div class="table-responsive">
        <table class="table table-hover table-striped mb-0 align-middle">
          <thead class="table-dark">
            <tr>
              <th style="width: 60px">#</th>
              <th>Fecha/Hora</th>
              <th>Nivel</th>
              <th>Módulo</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>IP</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="text-center py-4 text-muted">
                <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                Cargando registros...
              </td>
            </tr>
            <tr v-else-if="error">
              <td colspan="8" class="text-center py-4 text-danger">
                <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
              </td>
            </tr>
            <tr v-else-if="logs.length === 0">
              <td colspan="8" class="text-center py-4 text-muted">No se encontraron registros.</td>
            </tr>
            <tr v-else v-for="log in logs" :key="log.id">
              <td class="small text-muted">{{ log.id }}</td>
              <td class="small font-monospace">{{ formatDate(log.createdAt) }}</td>
              <td>
                <span class="badge" :class="levelClass(log.level)">{{ log.level }}</span>
              </td>
              <td class="small">{{ log.module }}</td>
              <td class="small fw-semibold">{{ log.userName ?? 'Anónimo' }}</td>
              <td class="small">{{ log.action }}</td>
              <td class="small font-monospace">{{ normalizeIp(log.ip ?? '') }}</td>
              <td>
                <button
                  v-if="log.detail"
                  class="btn btn-sm btn-outline-secondary py-0 px-2"
                  :title="log.detail"
                  @click="selectedDetail = log.detail"
                  data-bs-toggle="modal"
                  data-bs-target="#detailModal"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <span v-else class="text-muted small">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="card-footer bg-white d-flex justify-content-between align-items-center">
        <span class="small text-muted">
          Mostrando {{ rangeStart }}-{{ rangeEnd }} de {{ total }} registros
        </span>
        <nav>
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item" :class="{ disabled: filters.page === 1 }">
              <a class="page-link" href="#" @click.prevent="goToPage((filters.page ?? 1) - 1)">←</a>
            </li>
            <li
              v-for="p in visiblePages"
              :key="p"
              class="page-item"
              :class="{ active: p === filters.page }"
            >
              <a
                class="page-link"
                :class="{ 'page-link-active': p === filters.page }"
                href="#"
                @click.prevent="goToPage(p)"
              >{{ p }}</a>
            </li>
            <li class="page-item" :class="{ disabled: filters.page === totalPages() }">
              <a class="page-link" href="#" @click.prevent="goToPage((filters.page ?? 1) + 1)">→</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>

  <!-- Modal de detalle del log -->
  <div class="modal fade" id="detailModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Detalle del registro</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <pre class="small mb-0">{{ selectedDetail }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLogs } from '@/modules/admin/composables/useLogs'
import { downloadExport } from '@/modules/admin/services/logService'
import type { LogLevel } from '@/types'

const { logs, total, loading, error, filters, loadLogs, applyFilters, goToPage, totalPages } = useLogs()

// Detalle seleccionado para el modal
const selectedDetail = ref<string | null>(null)
const exporting = ref(false)

// Descarga los logs en el formato solicitado aplicando los filtros actuales
const exportFile = async (format: 'csv' | 'pdf') => {
  exporting.value = true
  try {
    await downloadExport(format, { ...filters })
  } catch {
    error.value = 'Error al exportar'
  } finally {
    exporting.value = false
  }
}

// Rango de registros visibles en el pie de la tabla
const rangeStart = computed(() => ((filters.page ?? 1) - 1) * (filters.pageSize ?? 10) + 1)
const rangeEnd = computed(() => Math.min((filters.page ?? 1) * (filters.pageSize ?? 10), total.value))

// Páginas visibles en el paginador (máximo 5 alrededor de la actual)
const visiblePages = computed(() => {
  const current = filters.page ?? 1
  const max = totalPages()
  const pages: number[] = []
  const start = Math.max(1, current - 2)
  const end = Math.min(max, start + 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

// Normaliza IPs IPv4-mapped IPv6 a formato IPv4 puro
const normalizeIp = (ip: string): string =>
  ip.startsWith('::ffff:') ? ip.slice(7) : (ip || '—')

// Clase CSS del badge según el nivel del log
const levelClass = (level: LogLevel): string => {
  switch (level) {
    case 'INFO': return 'bg-success'
    case 'WARNING': return 'bg-warning text-dark'
    case 'ERROR': return 'bg-danger'
    case 'DEBUG': return 'bg-secondary'
    default: return 'bg-secondary'
  }
}

// Formatea fecha ISO a formato local legible
const formatDate = (iso: string): string =>
  new Date(iso).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'medium' })

onMounted(loadLogs)
</script>

<style scoped>
.btn-admin {
  background: var(--color-garnet, #6B1E2E);
  border-color: var(--color-garnet, #6B1E2E);
  color: #fff;
  font-weight: 600;
}

.btn-admin:hover {
  background: var(--color-garnet-dark, #4E1420);
  border-color: var(--color-garnet-dark, #4E1420);
  color: #fff;
}

.btn-admin:disabled {
  background: var(--color-garnet, #6B1E2E);
  opacity: 0.6;
}

.page-link-active {
  background: var(--color-garnet, #6B1E2E) !important;
  border-color: var(--color-garnet, #6B1E2E) !important;
  color: #fff !important;
}

pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>

