<template>
  <div>
    <!-- Migas de pan -->
    <nav aria-label="breadcrumb" class="mb-4">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/">Inicio</router-link>
        </li>
        <li v-if="product" class="breadcrumb-item">
          <router-link :to="`/${product.category_name?.toLowerCase()}`">
            {{ product.category_name }}
          </router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ product?.name ?? 'Producto' }}
        </li>
      </ol>
    </nav>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

    <div v-else-if="!product" class="text-center text-muted py-5">
      Producto no encontrado.
      <div class="mt-3">
        <router-link to="/" class="btn btn-dark btn-sm">Volver al inicio</router-link>
      </div>
    </div>

    <div v-else class="row g-5">
      <!-- Imagen -->
      <div class="col-md-5">
        <div class="product-img-wrapper rounded-3 bg-light d-flex align-items-center justify-content-center shadow-sm">
          <img
            v-if="product.image_url"
            :src="product.image_url"
            :alt="product.name"
            class="img-fluid rounded-3"
          />
          <i v-else class="bi bi-image text-secondary" style="font-size: 6rem;"></i>
        </div>
      </div>

      <!-- Detalle -->
      <div class="col-md-7 d-flex flex-column">
        <span class="badge bg-secondary align-self-start mb-2">{{ product.category_name }}</span>
        <h1 class="fw-bold mb-2">{{ product.name }}</h1>
        <p class="text-muted mb-4">{{ product.description }}</p>

        <div class="d-flex align-items-center gap-3 mb-4">
          <span class="display-6 fw-bold text-accent">${{ product.price }}</span>
          <span
            class="badge"
            :class="product.stock > 0 ? 'bg-success' : 'bg-danger'"
          >
            {{ product.stock > 0 ? `${product.stock} en stock` : 'Sin stock' }}
          </span>
        </div>

        <!-- Selector de cantidad -->
        <div class="d-flex align-items-center gap-3 mb-4">
          <div class="input-group quantity-input">
            <button class="btn btn-outline-secondary" @click="decrement" :disabled="quantity <= 1">
              <i class="bi bi-dash"></i>
            </button>
            <input
              type="number"
              class="form-control text-center"
              v-model.number="quantity"
              min="1"
              :max="product.stock"
              readonly
              tabindex="-1"
              aria-hidden="true"
            />
            <button class="btn btn-outline-secondary" @click="increment" :disabled="quantity >= product.stock">
              <i class="bi bi-plus"></i>
            </button>
          </div>
        </div>

        <div class="d-flex gap-3 flex-wrap">
          <button
            class="btn btn-dark btn-lg px-5"
            :disabled="product.stock === 0 || addingToCart"
            @click="handleAddToCart"
          >
            <span v-if="addingToCart" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <i v-else class="bi bi-cart-plus me-2"></i>
            Añadir al carrito
          </button>
          <router-link to="/cart" class="btn btn-outline-dark btn-lg px-4">
            <i class="bi bi-cart3 me-1"></i>Ver carrito
          </router-link>
        </div>

        <p v-if="addedFeedback" class="text-success mt-3 fw-semibold small">
          <i class="bi bi-check-circle me-1"></i>Producto añadido al carrito.
        </p>

        <!-- Info adicional -->
        <hr class="mt-4" />
        <ul class="list-unstyled text-muted small mt-2 d-flex flex-column gap-2">
          <li><i class="bi bi-truck me-2"></i>Envío gratuito en pedidos superiores a $80</li>
          <li><i class="bi bi-arrow-counterclockwise me-2"></i>Devoluciones gratuitas en 30 días</li>
          <li><i class="bi bi-shield-check me-2"></i>Pago seguro garantizado</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProduct } from '@/modules/products/composables/useProduct'
import { useCartStore } from '@/stores/cartStore'

const route = useRoute()
const { product, loading, error, load } = useProduct()
const cartStore = useCartStore()

const quantity = ref(1)
const addingToCart = ref(false)
const addedFeedback = ref(false)

const increment = () => {
  if (product.value && quantity.value < product.value.stock) quantity.value++
}

const decrement = () => {
  if (quantity.value > 1) quantity.value--
}

const handleAddToCart = async () => {
  if (!product.value) return
  addingToCart.value = true
  await cartStore.addItem(product.value.id, quantity.value)
  addingToCart.value = false
  addedFeedback.value = true
  setTimeout(() => { addedFeedback.value = false }, 3000)
}

onMounted(() => load(Number(route.params.id)))
</script>

<style scoped>
.product-img-wrapper {
  min-height: 380px;
  border: 1px solid var(--color-border);
}

.quantity-input {
  width: 130px;
}

/* Oculta los spinner/arrows nativos del input type=number en distintos navegadores
   y ajusta el padding para evitar que el número quede cubierto. */
.quantity-input input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
  -webkit-appearance: none; /* Safari/Chrome */
  appearance: textfield;
  padding-right: 0.5rem; /* espacio extra a la derecha para asegurar visibilidad */
  text-align: center;
  box-sizing: border-box;
  /* Evitar selección y foco del input: solo usar botones +/- para cambiar cantidad */
  user-select: none;
  caret-color: transparent; /* ocultar cursor de texto */
  pointer-events: none; /* impide interacción con el input */
}

.quantity-input input[type="number"]::-webkit-inner-spin-button,
.quantity-input input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Estilo para inputs readonly: fondo transparente y cursor por defecto */
.quantity-input input[type="number"]:read-only {
  background-color: transparent;
  cursor: default;
}

.text-accent {
  color: var(--color-accent);
}
</style>
