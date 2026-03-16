<template>
  <div>
    <h2 class="fw-bold mb-4">
      <i class="bi bi-cart3 me-2"></i>Tu Carrito
    </h2>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

    <div v-else-if="items.length === 0" class="text-center text-muted py-5">
      <i class="bi bi-cart-x" style="font-size: 3rem;"></i>
      <p class="mt-3">El carrito está vacío.</p>
      <router-link to="/" class="btn btn-dark px-4">Ver Productos</router-link>
    </div>

    <div v-else class="row g-4">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
          <ul class="list-group list-group-flush">
            <li
              v-for="item in items"
              :key="item.id"
              class="list-group-item d-flex align-items-center gap-3 py-3"
            >
              <div class="cart-img-placeholder bg-light rounded d-flex align-items-center justify-content-center flex-shrink-0">
                <i class="bi bi-image text-secondary"></i>
              </div>

              <div class="flex-grow-1">
                <p class="fw-semibold mb-1">{{ item.product_name }}</p>
                <small class="text-muted">${{ item.product_price }} / ud.</small>
              </div>

              <div class="d-flex align-items-center gap-2">
                <button
                  class="btn btn-outline-secondary btn-sm"
                  @click="updateItem(item.product_id, item.quantity - 1)"
                  :disabled="item.quantity <= 1"
                >
                  <i class="bi bi-dash"></i>
                </button>
                <span class="fw-semibold" style="min-width: 1.5rem; text-align:center;">{{ item.quantity }}</span>
                <button
                  class="btn btn-outline-secondary btn-sm"
                  @click="updateItem(item.product_id, item.quantity + 1)"
                >
                  <i class="bi bi-plus"></i>
                </button>
              </div>

              <span class="fw-bold text-accent" style="min-width: 5rem; text-align:right;">
                ${{ ((item.product_price ?? 0) * item.quantity).toFixed(2) }}
              </span>

              <button class="btn btn-link text-danger p-0" @click="removeItem(item.product_id)">
                <i class="bi bi-trash"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card border-0 shadow-sm p-4">
          <h5 class="fw-bold mb-3">Resumen</h5>
          <div class="d-flex justify-content-between mb-2 text-muted">
            <span>Subtotal ({{ itemCount }} artículos)</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>
          <hr />
          <div class="d-flex justify-content-between fw-bold fs-5 mb-4">
            <span>Total</span>
            <span class="text-accent">${{ total.toFixed(2) }}</span>
          </div>
          <button class="btn btn-dark w-100 mb-2" @click="handleCheckout">
            <i class="bi bi-bag-check me-2"></i>Finalizar Compra
          </button>
          <button class="btn btn-outline-secondary w-100 btn-sm" @click="clearCart">
            Vaciar carrito
          </button>
          <p v-if="orderSuccess" class="text-success text-center mt-3 small fw-semibold">
            Pedido realizado correctamente.
          </p>
          <p v-if="checkoutError" class="text-danger text-center mt-3 small">
            {{ checkoutError }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cartStore'
import { createOrderRequest } from '@/modules/checkout/services/orderService'

const cartStore = useCartStore()
const { items, loading, error, total, itemCount } = storeToRefs(cartStore)
const { load, updateItem, removeItem, clearCart } = cartStore

const orderSuccess = ref(false)
const checkoutError = ref<string | null>(null)

const handleCheckout = async () => {
  orderSuccess.value = false
  checkoutError.value = null
  try {
    await createOrderRequest()
    orderSuccess.value = true
    await cartStore.load()
  } catch (err) {
    checkoutError.value = err instanceof Error ? err.message : 'Error al procesar el pedido'
  }
}

onMounted(() => cartStore.load())
</script>

<style scoped>
.cart-img-placeholder {
  width: 56px;
  height: 56px;
  font-size: 1.4rem;
}

.text-accent {
  color: var(--color-accent);
}
</style>
