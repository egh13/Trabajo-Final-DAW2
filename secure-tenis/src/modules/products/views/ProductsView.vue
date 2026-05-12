<template>
  <div>
    <div class="d-flex align-items-center justify-content-between mb-4">      <h2 class="fw-bold mb-0">
        <i :class="`bi ${resolvedIcon} me-2`"></i>{{ resolvedTitle }}
      </h2>
      <span class="text-muted small">{{ products.length }} resultado(s)</span>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

    <div v-else-if="!hasProducts" class="text-center text-muted py-5">
      No hay productos en esta sección.
    </div>    
    <div v-else class="row g-4">
      <div
        v-for="(product, index) in products"
        :key="product.id"
        class="col-12 col-sm-6 col-lg-4"
        data-aos="fade-up"
        :data-aos-delay="(index % 3) * 100"
      >
        <div class="card h-100 shadow-sm border-0 product-card" @click="router.push(`/producto/${product.id}`)">          <div class="card-img-wrapper">
            <img
              v-if="product.image_url"
              :src="product.image_url"
              :alt="product.name"
              class="card-img-top"
            />
            <div v-else class="card-img-placeholder d-flex align-items-center justify-content-center">
              <i class="bi bi-image text-secondary" style="font-size: 3rem;"></i>
            </div>
          </div>
          <div class="card-body d-flex flex-column">
            <span class="badge bg-secondary mb-2 align-self-start">{{ product.category_name }}</span>
            <h5 class="card-title fw-semibold">{{ product.name }}</h5>
            <p class="card-text text-muted small flex-grow-1">{{ product.description }}</p>
            <div class="d-flex align-items-center justify-content-between mt-3">
              <span class="fs-5 fw-bold text-accent">{{ product.price }}€</span>
              <button class="btn btn-dark btn-sm px-3" @click.stop="addItem(product.id)">
                <i class="bi bi-cart-plus me-1"></i>Añadir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProducts } from '@/modules/products/composables/useProducts'
import { fetchCategories } from '@/modules/products/services/categoryService'
import { useCartStore } from '@/stores/cartStore'
import type { Category } from '@/types'

const route = useRoute()
const router = useRouter()
const { products, loading, error, hasProducts, load } = useProducts()
const cartStore = useCartStore()

// Categorías disponibles para resolver el slug de la ruta
const categories = ref<Category[]>([])

const addItem = (productId: number, quantity = 1) => cartStore.addItem(productId, quantity)

// Resuelve la categoría activa a partir del slug de la URL
const activeCategory = computed<Category | undefined>(() => {
  const slug = route.params.slug as string | undefined
  if (!slug) return undefined
  return categories.value.find(c => c.name.toLowerCase() === slug.toLowerCase())
})

const resolvedTitle = computed(() => activeCategory.value?.name ?? 'Todos los productos')
const resolvedIcon = computed(() => activeCategory.value ? 'bi-tag' : 'bi-grid')

// Carga las categorías y luego los productos de la categoría activa
const init = async () => {
  const res = await fetchCategories()
  categories.value = res.data ?? []
  load(activeCategory.value?.id)
}

// Recarga los productos al cambiar de slug (navegación entre categorías)
watch(() => route.params.slug, () => load(activeCategory.value?.id))

onMounted(init)
</script>

<style scoped>
.product-card {
  transition: transform var(--transition-speed), box-shadow var(--transition-speed);
  border-radius: 0.875rem;
  overflow: hidden;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg) !important;
}

.card-img-wrapper {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: linear-gradient(145deg, var(--color-cream-dark) 0%, #DDD4C4 100%);
  border-bottom: 1px solid var(--color-border);
}

.card-img-wrapper .card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .card-img-top {
  transform: scale(1.06);
}

.card-img-placeholder {
  aspect-ratio: 4 / 3;
  background: linear-gradient(145deg, var(--color-cream-dark) 0%, #DDD4C4 100%);
  border-bottom: 1px solid var(--color-border);
}
</style>
