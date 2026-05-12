<template>
  <div class="container-fluid px-0">
    <div class="row">
      <div class="col-12" data-aos="fade-up">
        <div class="card shadow-sm">
          <div class="card-header-admin d-flex justify-content-between align-items-center">
            <h4 class="mb-0 fw-semibold">
              <i class="bi bi-tags me-2"></i>
              Gestión de Categorías
            </h4>
            <div class="d-flex gap-2">
              <button class="btn btn-admin-outline btn-sm" @click="openModal">
                <i class="bi bi-plus-circle me-1"></i>
                Nueva categoría
              </button>
              <button class="btn btn-ghost-sm btn-sm" @click="loadCategories">
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
              <p class="mt-2 text-muted small">Cargando categorías...</p>
            </div>

            <!-- Error -->
            <div v-else-if="error" class="alert alert-danger">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ error }}
            </div>

            <!-- Lista de categorías -->
            <div v-else-if="categories.length > 0">
              <div class="row g-3">
                <div v-for="category in categories" :key="category.id" class="col-md-6 col-lg-4">
                  <div class="card h-100 border-0 shadow-sm">
                    <div class="card-header bg-light d-flex justify-content-between align-items-center">
                      <h6 class="mb-0 fw-semibold">{{ category.name }}</h6>
                      <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary" type="button" data-bs-toggle="dropdown">
                          <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#" @click="editCategory(category)">
                            <i class="bi bi-pencil me-2"></i>Editar
                          </a></li>
                          <li><a class="dropdown-item text-danger" href="#" @click="handleDeleteCategory(category)">
                            <i class="bi bi-trash me-2"></i>Eliminar
                          </a></li>
                        </ul>
                      </div>
                    </div>
                    <div class="card-body">
                      <p class="text-muted small mb-3">{{ category.description || 'Sin descripción' }}</p>

                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-primary">{{ category.productCount || 0 }} productos</span>
                        <button class="btn btn-sm btn-outline-primary" @click="viewCategoryProducts(category)">
                        <i class="bi me-1" :class="expandedCategoryId === category.id ? 'bi-chevron-up' : 'bi-eye'"></i>
                          {{ expandedCategoryId === category.id ? 'Ocultar productos' : 'Ver productos' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Productos expandidos -->
              <div v-if="expandedCategoryId" class="mt-4">
                <div class="card border-0 shadow-sm">
                  <div class="card-header card-header-admin d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">
                      <i class="bi bi-box-seam me-2"></i>
                      Productos en "{{ selectedCategory?.name }}"
                    </h6>
                    <button class="btn btn-sm btn-outline-light" @click="expandedCategoryId = null; categoryProducts = []; selectedCategory = null">
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                  <div class="card-body">
                    <div v-if="categoryProductsLoading" class="text-center py-3">
                      <div class="spinner-border spinner-border-sm" role="status"></div>
                      <span class="ms-2">Cargando productos...</span>
                    </div>
                    <div v-else-if="categoryProducts.length === 0" class="text-center py-3 text-muted">
                      No hay productos en esta categoría
                    </div>
                    <div v-else class="table-responsive">
                      <table class="table table-hover table-sm">
                        <thead class="table-dark">
                          <tr>
                            <th>ID</th>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Cambiar Categoría</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="product in categoryProducts" :key="product.id">
                            <td class="small">{{ product.id }}</td>
                            <td>
                              <img v-if="product.image_url" :src="product.image_url" :alt="product.name" class="product-thumb-small" />
                              <i v-else class="bi bi-image text-muted"></i>
                            </td>
                            <td class="small fw-semibold">{{ product.name }}</td>
                            <td class="small">${{ product.price.toFixed(2) }}</td>
                            <td class="small">{{ product.stock }}</td>
                            <td>
                              <select
                                class="form-select form-select-sm"
                                :value="product.category_id"
                                @change="changeProductCategory(product, $event)"
                                :disabled="changingCategory[product.id]"
                              >
                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                  {{ cat.name }}
                                </option>
                              </select>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sin categorías -->
            <div v-else class="text-center py-4">
              <i class="bi bi-tags text-muted" style="font-size: 3rem;"></i>
              <p class="mt-3 text-muted">No hay categorías registradas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para agregar categoría -->
    <div v-if="showCreateModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header modal-header-admin">
            <h5 class="modal-title">
              <i class="bi bi-plus-circle me-2"></i> Nueva Categoría
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="formError" class="alert alert-danger alert-dismissible fade show" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>{{ formError }}
              <button type="button" class="btn-close" @click="formError = null"></button>
            </div>

            <form @submit.prevent="createNewCategory">
              <div class="mb-3">
                <label for="name" class="form-label small fw-semibold text-muted">Nombre de la categoría *</label>
                <input v-model="newCategoryForm.name" type="text" class="form-control form-control-sm" id="name" placeholder="Ej: Zapatillas" required>
              </div>

              <div class="mb-3">
                <label for="description" class="form-label small fw-semibold text-muted">Descripción</label>
                <textarea v-model="newCategoryForm.description" class="form-control form-control-sm" id="description" rows="2" placeholder="Descripción opcional de la categoría"></textarea>
              </div>

              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-admin btn-sm" :disabled="creatingCategory">
                  <i class="bi me-1" :class="creatingCategory ? 'bi-hourglass-split' : 'bi-check-circle'"></i>
                  {{ creatingCategory ? 'Creando...' : 'Crear Categoría' }}
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm" @click="closeModal" :disabled="creatingCategory">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para editar categoría -->
    <div v-if="showEditModal" class="modal d-block" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header modal-header-admin">
            <h5 class="modal-title">
              <i class="bi bi-pencil-square me-2"></i> Editar Categoría
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeEditModal" :disabled="updatingCategory"></button>
          </div>
          <div class="modal-body">
            <div v-if="formError" class="alert alert-danger alert-dismissible fade show" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>{{ formError }}
              <button type="button" class="btn-close" @click="formError = null"></button>
            </div>

            <form @submit.prevent="updateCategory">
              <div class="mb-3">
                <label for="edit-name" class="form-label small fw-semibold text-muted">Nombre de la categoría *</label>
                <input v-model="editCategoryForm.name" type="text" class="form-control form-control-sm" id="edit-name" required>
              </div>

              <div class="mb-3">
                <label for="edit-description" class="form-label small fw-semibold text-muted">Descripción</label>
                <textarea v-model="editCategoryForm.description" class="form-control form-control-sm" id="edit-description" rows="2"></textarea>
              </div>

              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-admin btn-sm" :disabled="updatingCategory">
                  <i class="bi me-1" :class="updatingCategory ? 'bi-hourglass-split' : 'bi-check-circle'"></i>
                  {{ updatingCategory ? 'Actualizando...' : 'Guardar Cambios' }}
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm" @click="closeEditModal" :disabled="updatingCategory">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>



    <!-- Modal de confirmación de eliminación -->
    <div v-if="deletingCategoryId" class="modal d-block" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-danger">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle-fill me-2"></i> Confirmar eliminación
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="cancelDeleteCategory"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">
              ¿Estás seguro de que deseas eliminar la categoría
              <strong>{{ categories.find(c => c.id === deletingCategoryId)?.name }}</strong>?
              Esta acción no se puede deshacer.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" @click="cancelDeleteCategory">Cancelar</button>
            <button type="button" class="btn btn-danger btn-sm" @click="confirmDeleteCategory">
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
import type { Category, Product } from '@/types'
import { fetchCategories, createCategory, updateCategory as updateCategoryApi, deleteCategory as deleteCategoryApi } from '@/modules/products/services/categoryService'
import { fetchProducts, updateProduct } from '@/modules/products/services/productService'

const categories = ref<Category[]>([])
const categoryProducts = ref<Product[]>([])
const selectedCategory = ref<Category | null>(null)
const loading = ref(false)
const categoryProductsLoading = ref(false)
const error = ref<string | null>(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const expandedCategoryId = ref<number | null>(null)
const creatingCategory = ref(false)
const updatingCategory = ref(false)
const deletingCategoryId = ref<number | null>(null)
const changingCategory = ref<Record<number, boolean>>({})
const formError = ref<string | null>(null)

// Formularios
const newCategoryForm = ref({
  name: '',
  description: ''
})

const editCategoryForm = ref({
  id: 0,
  name: '',
  description: ''
})

// Funciones
const loadCategories = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await fetchCategories()
    if (response.success && response.data) {
      categories.value = response.data
    } else {
      error.value = response.message || 'Error al cargar categorías'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error desconocido'
  } finally {
    loading.value = false
  }
}

const openModal = () => {
  newCategoryForm.value = {
    name: '',
    description: ''
  }
  formError.value = null
  showCreateModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
}

const createNewCategory = async () => {
  creatingCategory.value = true
  formError.value = null
  try {
    const response = await createCategory(newCategoryForm.value)
    if (response.success) {
      await loadCategories()
      closeModal()
    } else {
      formError.value = response.message || 'Error al crear categoría'
    }
  } catch (err) {
    formError.value = err instanceof Error ? err.message : 'Error al crear categoría'
  } finally {
    creatingCategory.value = false
  }
}

const editCategory = (category: Category) => {
  editCategoryForm.value = {
    id: category.id,
    name: category.name,
    description: category.description || ''
  }
  formError.value = null
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const updateCategory = async () => {
  updatingCategory.value = true
  formError.value = null
  try {
    const { id, ...updateData } = editCategoryForm.value
    const response = await updateCategoryApi(id, updateData)
    if (response.success) {
      await loadCategories()
      closeEditModal()
    } else {
      formError.value = response.message || 'Error al actualizar categoría'
    }
  } catch (err) {
    formError.value = err instanceof Error ? err.message : 'Error al actualizar categoría'
  } finally {
    updatingCategory.value = false
  }
}

const handleDeleteCategory = (category: Category) => {
  deletingCategoryId.value = category.id
}

const confirmDeleteCategory = async () => {
  if (!deletingCategoryId.value) return

  const category = categories.value.find(c => c.id === deletingCategoryId.value)
  if (!category) return

  try {
    const response = await deleteCategoryApi(deletingCategoryId.value)
    if (response.success) {
      categories.value = categories.value.filter(c => c.id !== deletingCategoryId.value)
      deletingCategoryId.value = null
      alert(`Categoría ${category.name} eliminada correctamente`)
    } else {
      alert(response.message || 'Error al eliminar categoría')
      deletingCategoryId.value = null
    }
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Error al eliminar categoría')
    deletingCategoryId.value = null
  }
}

const cancelDeleteCategory = () => {
  deletingCategoryId.value = null
}

const viewCategoryProducts = async (category: Category) => {
  if (expandedCategoryId.value === category.id) {
    // Si ya está expandida, colapsar
    expandedCategoryId.value = null
    categoryProducts.value = []
    selectedCategory.value = null
  } else {
    // Expandir
    expandedCategoryId.value = category.id
    selectedCategory.value = category
    categoryProductsLoading.value = true

    try {
      const response = await fetchProducts(category.id)
      if (response.success && response.data) {
        categoryProducts.value = response.data
      } else {
        categoryProducts.value = []
      }
    } catch (err) {
      categoryProducts.value = []
      console.error('Error al cargar productos:', err)
    } finally {
      categoryProductsLoading.value = false
    }
  }
}



const changeProductCategory = async (product: Product, event: Event) => {
  const target = event.target as HTMLSelectElement
  const newCategoryId = Number(target.value)

  if (newCategoryId === product.category_id) return

  changingCategory.value[product.id] = true

  try {
    const response = await updateProduct(product.id, { category_id: newCategoryId })
    if (response.success) {
      // Si la nueva categoría es diferente a la categoría expandida, remover el producto de la lista
      if (newCategoryId !== expandedCategoryId.value) {
        categoryProducts.value = categoryProducts.value.filter(p => p.id !== product.id)
      } else {
        // Actualizar el producto en la lista local
        const updatedProduct = categoryProducts.value.find(p => p.id === product.id)
        if (updatedProduct) {
          updatedProduct.category_id = newCategoryId
          updatedProduct.category_name = categories.value.find(c => c.id === newCategoryId)?.name || updatedProduct.category_name
        }
      }
      // Recargar categorías para actualizar los contadores
      await loadCategories()
    } else {
      alert('Error al cambiar la categoría del producto')
      // Restaurar el valor anterior
      target.value = product.category_id.toString()
    }
  } catch (err) {
    alert('Error al cambiar la categoría del producto')
    // Restaurar el valor anterior
    target.value = product.category_id.toString()
  } finally {
    changingCategory.value[product.id] = false
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.product-thumb-small {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}
</style>