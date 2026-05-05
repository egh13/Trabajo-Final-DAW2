<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header-admin d-flex justify-content-between align-items-center">
            <h4 class="mb-0 fw-semibold">
              <i class="bi bi-people me-2"></i>
              Gestión de Usuarios
            </h4>
            <div class="d-flex gap-2">
              <button class="btn btn-admin-outline btn-sm" @click="openModal">
                <i class="bi bi-plus-circle me-1"></i>
                Nuevo usuario
              </button>
              <button class="btn btn-ghost-sm btn-sm" @click="loadUsers">
                <i class="bi bi-arrow-clockwise me-1"></i>
                Actualizar
              </button>
            </div>
          </div>
          <div class="card-body">
            <!-- Loading -->
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border spinner-admin" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
              <p class="mt-2 text-muted small">Cargando usuarios...</p>
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
                      <th style="width: 60px">#</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Fecha de registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users" :key="user.id">
                      <td class="small text-muted">{{ user.id }}</td>
                      <td class="small fw-semibold">{{ user.name }}</td>
                      <td class="small">{{ user.email }}</td>
                      <td>
                        <span class="badge" :class="getRoleBadgeClass(user.role)">
                          {{ getRoleLabel(user.role) }}
                        </span>
                      </td>
                      <td class="small font-monospace">{{ formatDate(user.createdAt) }}</td>
                      <td>
                        <button class="btn btn-sm btn-outline-admin me-1" @click="editUser(user)">
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

    <!-- Modal para agregar usuario -->
    <div v-if="showCreateModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header modal-header-admin">
            <h5 class="modal-title">
              <i class="bi bi-person-plus me-2"></i> Nuevo Usuario
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="formError" class="alert alert-danger alert-dismissible fade show" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>{{ formError }}
              <button type="button" class="btn-close" @click="formError = null"></button>
            </div>

            <form @submit.prevent="createNewUser">
              <div class="mb-3">
                <label for="name" class="form-label small fw-semibold text-muted">Nombre completo *</label>
                <input v-model="newUserForm.name" type="text" class="form-control form-control-sm" id="name" placeholder="Ej: Juan Pérez" required>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label small fw-semibold text-muted">Email *</label>
                <input v-model="newUserForm.email" type="email" class="form-control form-control-sm" id="email" placeholder="Ej: usuario@example.com" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label small fw-semibold text-muted">Contraseña *</label>
                <input v-model="newUserForm.password" type="password" class="form-control form-control-sm" id="password" placeholder="Mínimo 6 caracteres" required>
              </div>
              <div class="mb-3">
                <label for="role" class="form-label small fw-semibold text-muted">Rol *</label>
                <select v-model="newUserForm.role" class="form-select form-select-sm" id="role" required>
                  <option value="">Seleccionar rol...</option>
                  <option value="cliente">Cliente</option>
                  <option value="admin">Administrador</option>
                  <option value="analista">Analista</option>
                </select>
              </div>
              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-admin btn-sm" :disabled="creatingUser">
                  <i class="bi me-1" :class="creatingUser ? 'bi-hourglass-split' : 'bi-check-circle'"></i>
                  {{ creatingUser ? 'Creando...' : 'Crear Usuario' }}
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm" @click="closeModal" :disabled="creatingUser">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para editar usuario -->
    <div v-if="showEditModal" class="modal d-block" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header modal-header-admin">
            <h5 class="modal-title">
              <i class="bi bi-pencil-square me-2"></i> Editar Usuario
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeEditModal" :disabled="updatingUser"></button>
          </div>
          <div class="modal-body">
            <div v-if="formError" class="alert alert-danger alert-dismissible fade show" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>{{ formError }}
              <button type="button" class="btn-close" @click="formError = null" :disabled="updatingUser"></button>
            </div>

            <form @submit.prevent="updateUser">
              <div class="mb-3">
                <label for="edit-name" class="form-label small fw-semibold text-muted">Nombre completo *</label>
                <input v-model="editUserForm.name" type="text" class="form-control form-control-sm" id="edit-name" required>
              </div>
              <div class="mb-3">
                <label for="edit-email" class="form-label small fw-semibold text-muted">Email *</label>
                <input v-model="editUserForm.email" type="email" class="form-control form-control-sm" id="edit-email" required>
              </div>
              <div class="mb-3">
                <label for="edit-password" class="form-label small fw-semibold text-muted">Contraseña</label>
                <input v-model="editUserForm.password" type="password" class="form-control form-control-sm" id="edit-password" placeholder="Dejar vacío para no cambiar">
                <small class="text-muted">Si dejas este campo vacío, la contraseña no será modificada</small>
              </div>
              <div class="mb-3">
                <label for="edit-role" class="form-label small fw-semibold text-muted">Rol *</label>
                <select v-model="editUserForm.role" class="form-select form-select-sm" id="edit-role" required>
                  <option value="">Seleccionar rol...</option>
                  <option value="cliente">Cliente</option>
                  <option value="admin">Administrador</option>
                  <option value="analista">Analista</option>
                </select>
              </div>
              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-admin btn-sm" :disabled="updatingUser">
                  <i class="bi me-1" :class="updatingUser ? 'bi-hourglass-split' : 'bi-check-circle'"></i>
                  {{ updatingUser ? 'Actualizando...' : 'Guardar Cambios' }}
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm" @click="closeEditModal" :disabled="updatingUser">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="deletingUserId" class="modal d-block" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-danger">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle-fill me-2"></i> Confirmar eliminación
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="cancelDeleteUser"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">
              ¿Estás seguro de que deseas eliminar al usuario
              <strong>{{ users.find(u => u.id === deletingUserId)?.name }}</strong>?
              Esta acción no se puede deshacer.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" @click="cancelDeleteUser">Cancelar</button>
            <button type="button" class="btn btn-danger btn-sm" @click="confirmDeleteUser">
              <i class="bi bi-trash me-1"></i> Eliminar
            </button>
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
const showCreateModal = ref(false)
const showEditModal = ref(false)
const creatingUser = ref(false)
const updatingUser = ref(false)
const deletingUserId = ref<number | null>(null)
const formError = ref<string | null>(null)
const editingUser = ref<User | null>(null)

const newUserForm = ref({
  name: '',
  email: '',
  password: '',
  role: ''
})

const editUserForm = ref({
  name: '',
  email: '',
  password: '',
  role: ''
})

const loadUsers = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await api.get<User[]>('/users')
    users.value = response.data || []
  } catch (err: any) {
    error.value = err.message || 'Error al cargar usuarios'
  } finally {
    loading.value = false
  }
}

const openModal = () => {
  showCreateModal.value = true
  formError.value = null
  newUserForm.value = { name: '', email: '', password: '', role: '' }
}

const closeModal = () => {
  showCreateModal.value = false
  formError.value = null
}

const createNewUser = async () => {
  formError.value = null
  
  if (!newUserForm.value.name.trim() || !newUserForm.value.email.trim() || !newUserForm.value.password.trim() || !newUserForm.value.role) {
    formError.value = 'Todos los campos son obligatorios'
    return
  }

  if (newUserForm.value.password.length < 6) {
    formError.value = 'La contraseña debe tener mínimo 6 caracteres'
    return
  }

  creatingUser.value = true
  
  try {
    const response = await api.post<User>('/users', {
      name: newUserForm.value.name,
      email: newUserForm.value.email,
      password: newUserForm.value.password,
      role: newUserForm.value.role
    })
    
    if (response.data) {
      users.value.unshift(response.data)
      closeModal()
      alert(`Usuario ${response.data.name} creado exitosamente`)
    }
  } catch (err: any) {
    formError.value = err.message || 'Error al crear el usuario'
  } finally {
    creatingUser.value = false
  }
}

const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-success'
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
  editingUser.value = user
  editUserForm.value = {
    name: user.name,
    email: user.email,
    password: '',
    role: user.role
  }
  showEditModal.value = true
  formError.value = null
}

const closeEditModal = () => {
  showEditModal.value = false
  formError.value = null
  editingUser.value = null
}

const updateUser = async () => {
  formError.value = null
  
  if (!editUserForm.value.name.trim() || !editUserForm.value.email.trim() || !editUserForm.value.role) {
    formError.value = 'Nombre, email y rol son obligatorios'
    return
  }

  if (editUserForm.value.password && editUserForm.value.password.length < 6) {
    formError.value = 'Si cambias la contraseña, debe tener mínimo 6 caracteres'
    return
  }

  updatingUser.value = true
  
  try {
    const updateData: any = {
      name: editUserForm.value.name,
      email: editUserForm.value.email,
      role: editUserForm.value.role
    }

    if (editUserForm.value.password) {
      updateData.password = editUserForm.value.password
    }

    const response = await api.put<User>(`/users/${editingUser.value?.id}`, updateData)
    
    if (response.data) {
      const index = users.value.findIndex(u => u.id === editingUser.value?.id)
      if (index > -1) {
        users.value[index] = response.data
      }
      closeEditModal()
      alert(`Usuario ${response.data.name} actualizado exitosamente`)
    }
  } catch (err: any) {
    formError.value = err.message || 'Error al actualizar el usuario'
  } finally {
    updatingUser.value = false
  }
}

const deleteUser = (user: User) => {
  deletingUserId.value = user.id
}

const confirmDeleteUser = async () => {
  if (!deletingUserId.value) return
  
  const user = users.value.find(u => u.id === deletingUserId.value)
  if (!user) return

  try {
    await api.delete(`/users/${deletingUserId.value}`)
    users.value = users.value.filter(u => u.id !== deletingUserId.value)
    deletingUserId.value = null
    alert(`Usuario ${user.name} eliminado correctamente`)
  } catch (err: any) {
    alert('Error al eliminar el usuario: ' + (err.message || 'Error desconocido'))
    deletingUserId.value = null
  }
}

const cancelDeleteUser = () => {
  deletingUserId.value = null
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.card-header-admin {
  background: var(--color-surface, #1E1E1E);
  color: #fff;
  padding: 0.9rem 1.25rem;
  border-radius: 0;
}

.modal-header-admin {
  background: var(--color-garnet, #6B1E2E);
  color: #fff;
}

.modal-header-admin .btn-close {
  filter: invert(1) grayscale(100%) brightness(200%);
}

.btn-admin {
  background: var(--color-garnet, #6B1E2E);
  border-color: var(--color-garnet, #6B1E2E);
  color: #fff;
  font-weight: 600;
}

.btn-admin:hover, .btn-admin:focus {
  background: var(--color-garnet-dark, #4E1420);
  border-color: var(--color-garnet-dark, #4E1420);
  color: #fff;
}

.btn-admin:disabled {
  background: var(--color-garnet, #6B1E2E);
  opacity: 0.6;
}

.btn-admin-outline {
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #fff;
  background: transparent;
  font-weight: 500;
}

.btn-admin-outline:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.6);
}

.btn-outline-admin {
  border-color: var(--color-garnet, #6B1E2E);
  color: var(--color-garnet, #6B1E2E);
}

.btn-outline-admin:hover {
  background: var(--color-garnet, #6B1E2E);
  color: #fff;
}

.btn-ghost-sm {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.btn-ghost-sm:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.spinner-admin {
  color: var(--color-garnet, #6B1E2E);
}

.modal-content {
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.18);
  border: none;
}
</style>