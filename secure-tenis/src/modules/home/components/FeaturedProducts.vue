<template>
  <section>
    <h2 class="fw-bold mb-4 text-dark">
      <i class="text-warning me-2"></i>Productos Destacados
    </h2>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else-if="!hasProducts" class="text-center text-muted py-5">
      No hay productos disponibles.
    </div>

    <div v-else class="row g-4">
      <div v-for="product in products" :key="product.id" class="col-12 col-sm-6 col-lg-4">        <div class="card h-100 shadow-sm border-0 product-card" @click="router.push(`/producto/${product.id}`)">
          <div class="card-img-placeholder d-flex align-items-center justify-content-center bg-light">
            <i class="bi bi-image text-secondary" style="font-size: 3rem;"></i>
          </div>
          <div class="card-body d-flex flex-column">
            <span class="badge bg-secondary mb-2 align-self-start">{{ product.category_name }}</span>
            <h5 class="card-title fw-semibold">{{ product.name }}</h5>
            <p class="card-text text-muted small flex-grow-1">{{ product.description }}</p>
            <div class="d-flex align-items-center justify-content-between mt-3">
              <span class="fs-5 fw-bold text-accent">${{ product.price }}</span>
              <button class="btn btn-dark btn-sm px-3" @click.stop="addItem(product.id)">
                <i class="bi bi-cart-plus me-1"></i>Añadir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '@/modules/products/composables/useProducts'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const { products, loading, error, hasProducts, load } = useProducts()
const cartStore = useCartStore()

const addItem = (productId: number, quantity = 1) => cartStore.addItem(productId, quantity)

onMounted(() => load())
</script>

<style scoped>
.product-card {
  transition: transform var(--transition-speed), box-shadow var(--transition-speed);
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.card-img-placeholder {
  height: 180px;
  border-bottom: 1px solid var(--color-border);
}

.text-accent {
  color: var(--color-accent);
}
</style>
