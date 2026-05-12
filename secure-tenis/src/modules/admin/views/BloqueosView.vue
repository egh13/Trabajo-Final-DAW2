<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fetchBlocks, createBlock, deleteBlock } from '../services/blockService'
import { formatDate } from '@/utils/formatters'
import type { IpBlock } from '@/types'

// Estado reactivo
const blocks = ref<IpBlock[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const showForm = ref(false)

// Formulario de nuevo bloqueo
const form = ref({ ip: '', email: '', reason: '', durationMinutes: '' })
const formError = ref<string | null>(null)
const submitting = ref(false)

// Separar bloqueos manuales y automáticos
const manualBlocks = computed(() => blocks.value.filter(b => b.manual))
const autoBlocks = computed(() => blocks.value.filter(b => !b.manual))

// Carga los bloqueos activos desde la API
const load = async () => {
  error.value = null
  try {
    blocks.value = await fetchBlocks()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error al cargar bloqueos'
  } finally {
    loading.value = false
  }
}

// Envía el formulario de bloqueo manual
const submitBlock = async () => {  formError.value = null
  if (!form.value.ip && !form.value.email) {
    formError.value = 'Debes indicar una IP o un email.'
    return
  }
  if (!form.value.reason) {
    formError.value = 'Debes indicar un motivo.'
    return
  }

  submitting.value = true
  try {    await createBlock({
      ip: form.value.ip || undefined,
      email: form.value.email || undefined,
      reason: form.value.reason,
      durationMinutes: form.value.durationMinutes ? Number(form.value.durationMinutes) : undefined,
    })
    form.value = { ip: '', email: '', reason: '', durationMinutes: '' }
    showForm.value = false
    await load()
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Error al crear bloqueo'
  } finally {
    submitting.value = false
  }
}

// Elimina un bloqueo y recarga la lista
const handleDelete = async (id: number) => {
  if (!confirm('¿Seguro que deseas desbloquear este registro?')) return
  try {
    await deleteBlock(id)
    await load()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error al eliminar bloqueo'
  }
}

onMounted(load)
</script>

<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold mb-0">Control de Bloqueos</h2>
      <button class="btn btn-success btn-sm" @click="showForm = !showForm">
        <i class="bi bi-plus-circle me-1"></i>
        {{ showForm ? 'Cancelar' : 'Nuevo bloqueo' }}
      </button>
    </div>

    <!-- Formulario de bloqueo manual -->
    <div v-if="showForm" class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <h6 class="fw-semibold mb-3"><i class="bi bi-shield-plus me-2"></i>Crear bloqueo manual</h6>
        <div v-if="formError" class="alert alert-danger py-2 small">{{ formError }}</div>
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label small fw-semibold">IP</label>
            <input v-model="form.ip" type="text" class="form-control form-control-sm" placeholder="Ej: 192.168.1.100" />
          </div>          <div class="col-md-3">
            <label class="form-label small fw-semibold">Email</label>
            <input v-model="form.email" type="email" class="form-control form-control-sm" placeholder="usuario@ejemplo.com" />
          </div>
          <div class="col-md-3">
            <label class="form-label small fw-semibold">Motivo</label>
            <input v-model="form.reason" type="text" class="form-control form-control-sm" placeholder="Motivo del bloqueo" />
          </div>
          <div class="col-md-2">
            <label class="form-label small fw-semibold">Duración (min)</label>
            <input v-model="form.durationMinutes" type="number" class="form-control form-control-sm" placeholder="Indefinido" />
          </div>
          <div class="col-md-2 d-flex align-items-end">
            <button class="btn btn-success btn-sm w-100" :disabled="submitting" @click="submitBlock">
              <span v-if="submitting" class="spinner-border spinner-border-sm me-1"></span>
              Bloquear
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2 text-muted">Cargando bloqueos...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
    </div>

    <template v-else>
      <!-- KPIs -->
      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <div class="card border-0 shadow-sm text-center py-3">
            <div class="card-body">
              <div class="kpi-value text-danger">{{ blocks.length }}</div>
              <div class="small text-muted">Bloqueos activos</div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm text-center py-3">
            <div class="card-body">
              <div class="kpi-value text-warning">{{ autoBlocks.length }}</div>
              <div class="small text-muted">Automáticos</div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm text-center py-3">
            <div class="card-body">
              <div class="kpi-value text-primary">{{ manualBlocks.length }}</div>
              <div class="small text-muted">Manuales</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de bloqueos -->
      <div class="card border-0 shadow-sm">
        <div class="card-header border-bottom d-flex justify-content-between align-items-center py-2">
          <span class="fw-semibold small">
            <i class="bi bi-shield-x me-2 text-danger"></i>Bloqueos activos
          </span>
          <span class="badge bg-danger">{{ blocks.length }}</span>
        </div>
        <div class="table-responsive">
          <table class="table table-hover table-striped mb-0 align-middle">            <thead class="table-dark">              <tr>
                <th>IP</th>
                <th>Email</th>
                <th>Motivo</th>
                <th>Tipo</th>
                <th>Expira</th>
                <th>Creado</th>
                <th class="text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="blocks.length === 0">
                <td colspan="7" class="text-center text-muted py-3">No hay bloqueos activos</td>
              </tr>
              <tr v-for="b in blocks" :key="b.id">
                <td class="small font-monospace">{{ b.ip ?? '—' }}</td>
                <td class="small">{{ b.email ?? '—' }}</td>
                <td class="small">{{ b.reason }}</td>
                <td>
                  <span class="badge" :class="b.manual ? 'bg-primary' : 'bg-warning text-dark'">
                    {{ b.manual ? 'Manual' : 'Automático' }}
                  </span>
                </td>
                <td class="small">{{ b.expiresAt ? formatDate(b.expiresAt) : 'Permanente' }}</td>
                <td class="small">{{ formatDate(b.createdAt) }}</td>
                <td class="text-center">
                  <button class="btn btn-outline-success btn-sm" @click="handleDelete(b.id)" title="Desbloquear">
                    <i class="bi bi-unlock"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

