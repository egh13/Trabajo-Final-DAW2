<template>
  <div class="container-fluid px-0">
    <div class="row">
      <div class="col-12" data-aos="fade-up">
        <div class="card shadow-sm">
          <div class="card-header-admin d-flex justify-content-between align-items-center">
            <h4 class="mb-0 fw-semibold">
              <i class="bi bi-box-seam me-2"></i>
              Gestión de Productos
            </h4>
            <div class="d-flex gap-2">
              <button class="btn btn-admin-outline btn-sm" @click="openModal">
                <i class="bi bi-plus-circle me-1"></i>
                Nuevo producto
              </button>
              <button class="btn btn-ghost-sm btn-sm" @click="loadProducts">
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
              <p class="mt-2 text-muted small">Cargando productos...</p>
            </div>

            <!-- Error -->
            <div v-else-if="error" class="alert alert-danger">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ error }}
            </div>

            <!-- Lista de productos -->
            <div v-else-if="products.length > 0">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Imagen</th>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Categoría</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in sortedProducts" :key="product.id" @click="goToProduct(product)" class="clickable-row">
                      <td>{{ product.id }}</td>
                      <td>
                        <img v-if="product.image_url" :src="product.image_url" :alt="product.name" class="product-thumb" />
                        <i v-else class="bi bi-image text-muted"></i>
                      </td>
                      <td>{{ product.name }}</td>
                      <td>${{ product.price.toFixed(2) }}</td>
                      <td>{{ product.stock }}</td>
                      <td>{{ product.category_name || 'Sin categoría' }}</td>
                      <td @click.stop>
                        <button class="btn btn-sm btn-outline-admin me-1" @click.stop="editProduct(product)">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" @click.stop="handleDeleteProduct(product)">
                          <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Sin productos -->
            <div v-else class="text-center py-4">
              <i class="bi bi-box text-muted" style="font-size: 3rem;"></i>
              <p class="mt-3 text-muted">No hay productos registrados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para agregar producto -->
    <div v-if="showCreateModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header modal-header-admin">
            <h5 class="modal-title">
              <i class="bi bi-plus-circle me-2"></i> Nuevo Producto
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="formError" class="alert alert-danger alert-dismissible fade show" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>{{ formError }}
              <button type="button" class="btn-close" @click="formError = null"></button>
            </div>

            <form @submit.prevent="createNewProduct">
              <div class="mb-3">
                <label for="name" class="form-label small fw-semibold text-muted">Nombre del producto *</label>
                <input v-model="newProductForm.name" type="text" class="form-control form-control-sm" id="name" placeholder="Ej: Zapatillas Nike" required>
              </div>
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="price" class="form-label small fw-semibold text-muted">Precio *</label>
                  <input v-model.number="newProductForm.price" type="number" step="0.01" class="form-control form-control-sm" id="price" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="stock" class="form-label small fw-semibold text-muted">Stock *</label>
                  <input v-model.number="newProductForm.stock" type="number" class="form-control form-control-sm" id="stock" required>
                </div>
              </div>

              <div class="mb-3">
                <label for="category_id" class="form-label small fw-semibold text-muted">Categoría *</label>
                <div class="d-flex gap-2">
                  <select v-model="newProductForm.category_id" class="form-select form-select-sm flex-grow-1" id="category_id" required>
                    <option value="">Seleccionar categoría...</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                  </select>
                  <button type="button" class="btn btn-outline-admin btn-sm" @click="openCategoryModal" title="Crear nueva categoría">
                    <i class="bi bi-plus-circle"></i>
                  </button>
                </div>
              </div>

              <div class="mb-3">
                <label for="description" class="form-label small fw-semibold text-muted">Descripción</label>
                <textarea v-model="newProductForm.description" class="form-control form-control-sm" id="description" rows="2"></textarea>
              </div>

              <div class="mb-3">
                <label for="image_url" class="form-label small fw-semibold text-muted">URL de imagen</label>
                <input v-model="newProductForm.image_url" type="url" class="form-control form-control-sm" id="image_url">
              </div>

              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-admin btn-sm" :disabled="creatingProduct">
                  <i class="bi me-1" :class="creatingProduct ? 'bi-hourglass-split' : 'bi-check-circle'"></i>
                  {{ creatingProduct ? 'Creando...' : 'Crear Producto' }}
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm" @click="closeModal" :disabled="creatingProduct">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para editar producto -->
    <div v-if="showEditModal" class="modal d-block" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header modal-header-admin">
            <h5 class="modal-title">
              <i class="bi bi-pencil-square me-2"></i> Editar Producto
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeEditModal" :disabled="updatingProduct"></button>
          </div>
          <div class="modal-body">
            <div v-if="formError" class="alert alert-danger alert-dismissible fade show" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>{{ formError }}
              <button type="button" class="btn-close" @click="formError = null"></button>
            </div>

            <form @submit.prevent="updateProduct">
              <div class="mb-3">
                <label for="edit-name" class="form-label small fw-semibold text-muted">Nombre del producto *</label>
                <input v-model="editProductForm.name" type="text" class="form-control form-control-sm" id="edit-name" required>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="edit-price" class="form-label small fw-semibold text-muted">Precio *</label>
                  <input v-model.number="editProductForm.price" type="number" step="0.01" class="form-control form-control-sm" id="edit-price" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="edit-stock" class="form-label small fw-semibold text-muted">Stock *</label>
                  <input v-model.number="editProductForm.stock" type="number" class="form-control form-control-sm" id="edit-stock" required>
                </div>
              </div>

              <div class="mb-3">
                <label for="edit-category_id" class="form-label small fw-semibold text-muted">Categoría *</label>
                <div class="d-flex gap-2">
                  <select v-model="editProductForm.category_id" class="form-select form-select-sm flex-grow-1" id="edit-category_id" required>
                    <option value="">Seleccionar categoría...</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                  </select>
                  <button type="button" class="btn btn-outline-admin btn-sm" @click="openCategoryModal" title="Crear nueva categoría">
                    <i class="bi bi-plus-circle"></i>
                  </button>
                </div>
              </div>

              <div class="mb-3">
                <label for="edit-description" class="form-label small fw-semibold text-muted">Descripción</label>
                <textarea v-model="editProductForm.description" class="form-control form-control-sm" id="edit-description" rows="2"></textarea>
              </div>

              <div class="mb-3">
                <label for="edit-image_url" class="form-label small fw-semibold text-muted">URL de imagen</label>
                <input v-model="editProductForm.image_url" type="url" class="form-control form-control-sm" id="edit-image_url">
              </div>

              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-admin btn-sm" :disabled="updatingProduct">
                  <i class="bi me-1" :class="updatingProduct ? 'bi-hourglass-split' : 'bi-check-circle'"></i>
                  {{ updatingProduct ? 'Actualizando...' : 'Guardar Cambios' }}
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm" @click="closeEditModal" :disabled="updatingProduct">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="deletingProductId" class="modal d-block" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-danger">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle-fill me-2"></i> Confirmar eliminación
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="cancelDeleteProduct"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">
              ¿Estás seguro de que deseas eliminar el producto
              <strong>{{ products.find(p => p.id === deletingProductId)?.name }}</strong>?
              Esta acción no se puede deshacer.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" @click="cancelDeleteProduct">Cancelar</button>
            <button type="button" class="btn btn-danger btn-sm" @click="confirmDeleteProduct">
              <i class="bi bi-trash me-1"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para crear categoría -->
    <div v-if="showCategoryModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5); z-index: 1055;">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header modal-header-admin">
            <h5 class="modal-title">
              <i class="bi bi-plus-circle me-2"></i> Nueva Categoría
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeCategoryModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="categoryFormError" class="alert alert-danger alert-dismissible fade show" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>{{ categoryFormError }}
              <button type="button" class="btn-close" @click="categoryFormError = null"></button>
            </div>

            <form @submit.prevent="createNewCategory">
              <div class="mb-3">
                <label for="category-name" class="form-label small fw-semibold text-muted">Nombre de la categoría *</label>
                <input v-model="newCategoryForm.name" type="text" class="form-control form-control-sm" id="category-name" placeholder="Ej: Zapatillas" required>
              </div>

              <div class="mb-3">
                <label for="category-description" class="form-label small fw-semibold text-muted">Descripción</label>
                <textarea v-model="newCategoryForm.description" class="form-control form-control-sm" id="category-description" rows="2" placeholder="Descripción opcional de la categoría"></textarea>
              </div>

              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-admin btn-sm" :disabled="creatingCategory">
                  <i class="bi me-1" :class="creatingCategory ? 'bi-hourglass-split' : 'bi-check-circle'"></i>
                  {{ creatingCategory ? 'Creando...' : 'Crear Categoría' }}
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm" @click="closeCategoryModal" :disabled="creatingCategory">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Product, Category } from '@/types'
import { fetchProducts, createProduct, updateProduct as updateProductApi, deleteProduct as deleteProductApi } from '@/modules/products/services/productService'
import { fetchCategories, createCategory } from '@/modules/products/services/categoryService'

const router = useRouter()

// Estado
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const creatingProduct = ref(false)
const updatingProduct = ref(false)
const deletingProductId = ref<number | null>(null)
const formError = ref<string | null>(null)
const showCategoryModal = ref(false)
const creatingCategory = ref(false)
const categoryFormError = ref<string | null>(null)

// Formularios
const newProductForm = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category_id: 0,
  image_url: ''
})

const editProductForm = ref({
  id: 0,
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category_id: 0,
  image_url: ''
})

const newCategoryForm = ref({
  name: '',
  description: ''
})

// Productos ordenados por ID
const sortedProducts = computed(() => {
  return [...products.value].sort((a, b) => a.id - b.id)
})

// Funciones
const loadProducts = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await fetchProducts()
    if (response.success && response.data) {
      products.value = response.data
    } else {
      error.value = response.message || 'Error al cargar productos'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error desconocido'
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const response = await fetchCategories()
    if (response.success && response.data) {
      categories.value = response.data
    }
  } catch (err) {
    console.error('Error al cargar categorías:', err)
  }
}

const openModal = () => {
  newProductForm.value = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category_id: 0,
    image_url: ''
  }
  formError.value = null
  showCreateModal.value = true
}

const openCategoryModal = () => {
  newCategoryForm.value = {
    name: '',
    description: ''
  }
  categoryFormError.value = null
  showCategoryModal.value = true
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
}

const createNewCategory = async () => {
  creatingCategory.value = true
  categoryFormError.value = null
  try {
    const response = await createCategory(newCategoryForm.value)
    if (response.success) {
      await loadCategories()
      closeCategoryModal()
    } else {
      categoryFormError.value = response.message || 'Error al crear categoría'
    }
  } catch (err) {
    categoryFormError.value = err instanceof Error ? err.message : 'Error al crear categoría'
  } finally {
    creatingCategory.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
}

const createNewProduct = async () => {
  creatingProduct.value = true
  formError.value = null
  try {
    const response = await createProduct(newProductForm.value)
    if (response.success) {
      await loadProducts()
      closeModal()
    } else {
      formError.value = response.message || 'Error al crear producto'
    }
  } catch (err) {
    formError.value = err instanceof Error ? err.message : 'Error al crear producto'
  } finally {
    creatingProduct.value = false
  }
}

const editProduct = (product: Product) => {
  editProductForm.value = {
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: product.price,
    stock: product.stock,
    category_id: product.category_id,
    image_url: product.image_url || ''
  }
  formError.value = null
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const updateProduct = async () => {
  updatingProduct.value = true
  formError.value = null
  try {
    const { id, ...updateData } = editProductForm.value
    const response = await updateProductApi(id, updateData)
    if (response.success) {
      await loadProducts()
      closeEditModal()
    } else {
      formError.value = response.message || 'Error al actualizar producto'
    }
  } catch (err) {
    formError.value = err instanceof Error ? err.message : 'Error al actualizar producto'
  } finally {
    updatingProduct.value = false
  }
}

const handleDeleteProduct = (product: Product) => {
  deletingProductId.value = product.id
}

const confirmDeleteProduct = async () => {
  if (!deletingProductId.value) return

  const product = products.value.find(p => p.id === deletingProductId.value)
  if (!product) return

  try {
    const response = await deleteProductApi(deletingProductId.value)
    if (response.success) {
      products.value = products.value.filter(p => p.id !== deletingProductId.value)
      deletingProductId.value = null
      alert(`Producto ${product.name} eliminado correctamente`)
    } else {
      alert(response.message || 'Error al eliminar producto')
      deletingProductId.value = null
    }
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Error al eliminar producto')
    deletingProductId.value = null
  }
}

const cancelDeleteProduct = () => {
  deletingProductId.value = null
}

const goToProduct = (product: Product) => {
  router.push(`/producto/${product.id}`)
}

onMounted(() => {
  loadProducts()
  loadCategories()
})
</script>

<style scoped>
.product-thumb {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--color-border);
}
</style>