<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h4 class="mb-0">
              <i class="bi bi-people-fill me-2"></i>
              Gestión de Usuarios
            </h4>
            <button class="btn btn-light btn-sm" @click="loadUsers">
              <i class="bi bi-arrow-clockwise me-1"></i>
              Actualizar
            </button>
          </div>
          <div class="card-body">
            <!-- Loading -->
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
              <p class="mt-2 text-muted">Cargando usuarios...</p>
            </div>

            <!-- Error -->
            <div v-else-if="error" class="alert alert-danger">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ error }}
            </div>

            <!-- Lista de usuarios -->
            <div v-else-if="users.length > 0">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Fecha de registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users" :key="user.id">
                      <td>{{ user.id }}</td>
                      <td>{{ user.name }}</td>
                      <td>{{ user.email }}</td>
                      <td>
                        <span 
                          class="badge"
                          :class="getRoleBadgeClass(user.role)"
                        >
                          {{ getRoleLabel(user.role) }}
                        </span>
                      </td>
                      <td>{{ formatDate(user.createdAt) }}</td>
                      <td>
                        <button class="btn btn-sm btn-outline-primary me-1" @click="editUser(user)">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" @click="deleteUser(user)">
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Sin usuarios -->
            <div v-else class="text-center py-4">
              <i class="bi bi-people text-muted" style="font-size: 3rem;"></i>
              <p class="mt-3 text-muted">No hay usuarios registrados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/services/apiClient'
import type { User } from '@/types'

const users = ref<User[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const loadUsers = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await api.get<User[]>('/auth/users')
    users.value = response.data || []
  } catch (err: any) {
    error.value = err.message || 'Error al cargar usuarios'
  } finally {
    loading.value = false
  }
}

const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-danger'
    case 'analista': return 'bg-warning text-dark'
    default: return 'bg-secondary'
  }
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin': return 'Administrador'
    case 'analista': return 'Analista'
    default: return 'Cliente'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const editUser = (user: User) => {
  alert(`Editar usuario: ${user.name} - Funcionalidad pendiente de implementar`)
}

const deleteUser = (user: User) => {
  if (confirm(`¿Estás seguro de eliminar al usuario ${user.name}?`)) {
    alert('Funcionalidad de eliminación pendiente de implementar')
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.card {
  border: none;
  border-radius: 10px;
}

.card-header {
  border-radius: 10px 10px 0 0 !important;
}

.table th {
  border-top: none;
  font-weight: 600;
}

.badge {
  font-size: 0.75rem;
}
</style>