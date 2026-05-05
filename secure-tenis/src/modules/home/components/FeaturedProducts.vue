<template>
  <section class="products-section">

    <!-- Cabecera de sección -->
    <div class="section-header mb-4">
      <div>
        <p class="section-overline">Nuestra selección</p>
        <h2 class="section-title fw-bold mb-0">
          <i class="bi bi-star-fill text-accent me-2"></i>Productos Destacados
        </h2>
      </div>
      <router-link to="/productos" class="btn btn-outline-dark btn-sm px-4 see-all-btn">
        Ver todos <i class="bi bi-arrow-right ms-1"></i>
      </router-link>
    </div>

    <!-- Filtros de categoría -->
    <div class="category-filters mb-5" data-aos="fade-up">
      <button
        class="filter-pill"
        :class="{ active: selectedCategoryId === null }"
        @click="selectCategory(null)"
      >
        <i class="bi bi-grid-fill me-1"></i>Todos
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="filter-pill"
        :class="{ active: selectedCategoryId === cat.id }"
        @click="selectCategory(cat.id)"
      >
        {{ cat.name }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" style="color: var(--color-accent);" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

    <!-- Sin productos -->
    <div v-else-if="!hasProducts" class="empty-state py-5 text-center">
      <i class="bi bi-box-seam" style="font-size: 3rem; color: var(--color-border);"></i>
      <p class="mt-3 text-muted">No hay productos disponibles en esta categoría.</p>
    </div>

    <!-- Grid de productos -->
    <div v-else class="products-grid">
      <div
        v-for="(product, index) in products"
        :key="product.id"
        class="product-cell"
        data-aos="fade-up"
        :data-aos-delay="Math.min(index, 5) * 80"
        @click="router.push(`/producto/${product.id}`)"
      >
        <!-- Imagen con overlay -->
        <div class="product-img-wrap">
          <img
            v-if="product.image_url"
            :src="product.image_url"
            :alt="product.name"
            class="product-img"
          />
          <div v-else class="product-img-placeholder">
            <i class="bi bi-image"></i>
          </div>

          <!-- Overlay con botón -->
          <div class="product-overlay">
            <button class="btn btn-accent btn-sm px-4 overlay-btn" @click.stop="addItem(product.id)">
              <i class="bi bi-cart-plus me-2"></i>Añadir al carrito
            </button>
          </div>

          <!-- Badge categoría -->
          <span v-if="product.category_name" class="badge-category">
            {{ product.category_name }}
          </span>

          <!-- Badge nuevo -->
          <span v-if="isNew(product.createdAt)" class="badge-new">Nuevo</span>

          <!-- Indicador stock bajo -->
          <span v-if="product.stock > 0 && product.stock <= 5" class="badge-stock">
            ¡Últimas {{ product.stock }}!
          </span>
        </div>

        <!-- Info del producto -->
        <div class="product-info">
          <h5 class="product-name">{{ product.name }}</h5>
          <div class="product-footer">
            <span class="product-price">{{ product.price }}€</span>
            <button class="btn-add-mini" @click.stop="addItem(product.id)" aria-label="Añadir al carrito">
              <i class="bi bi-cart-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA ver más -->
    <div v-if="hasProducts" class="text-center mt-5" data-aos="fade-up">
      <router-link to="/productos" class="btn btn-outline-dark px-5 py-2">
        Explorar todo el catálogo <i class="bi bi-arrow-right ms-2"></i>
      </router-link>
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '@/modules/products/composables/useProducts'
import { useCartStore } from '@/stores/cartStore'
import { fetchCategories } from '@/modules/products/services/categoryService'
import type { Category } from '@/types'

const router = useRouter()
const { products, loading, error, hasProducts, load } = useProducts()
const cartStore = useCartStore()

const categories = ref<Category[]>([])
const selectedCategoryId = ref<number | null>(null)

const addItem = (productId: number) => cartStore.addItem(productId, 1)

const isNew = (createdAt: string) => {
  const diff = Date.now() - new Date(createdAt).getTime()
  return diff < 1000 * 60 * 60 * 24 * 30 // 30 días
}

const selectCategory = async (id: number | null) => {
  selectedCategoryId.value = id
  await load(id ?? undefined)
}

onMounted(async () => {
  await load()
  try {
    const res = await fetchCategories()
    categories.value = res.data ?? []
  } catch {
    // no bloqueamos la vista si las categorías fallan
  }
})
</script>

<style scoped>
/* ── Cabecera ── */
.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-overline {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 0.25rem;
}

.section-title {
  font-size: 1.75rem;
}

.see-all-btn {
  white-space: nowrap;
}

/* ── Filtros ── */
.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-pill {
  padding: 0.4rem 1.1rem;
  border-radius: 50px;
  border: 1.5px solid var(--color-border);
  background: #fff;
  color: var(--color-text);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-pill:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.filter-pill.active {
  background: var(--color-dark);
  border-color: var(--color-dark);
  color: #fff;
}

/* ── Grid ── */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

@media (max-width: 1199px) {
  .products-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 767px) {
  .products-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
}

@media (max-width: 479px) {
  .products-grid { grid-template-columns: 1fr; }
}

/* ── Tarjeta ── */
.product-cell {
  cursor: pointer;
  border-radius: 1rem;
  background: var(--color-cream);
  border: 1px solid var(--color-border);
  overflow: hidden;
  transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
}

.product-cell:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
  border-color: transparent;
}

/* ── Imagen ── */
.product-img-wrap {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: linear-gradient(145deg, var(--color-cream-dark) 0%, #DDD4C4 100%);
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-cell:hover .product-img {
  transform: scale(1.06);
}

.product-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: var(--color-sand);
}

/* ── Overlay ── */
.product-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 1.25rem;
  background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-cell:hover .product-overlay {
  opacity: 1;
}

.overlay-btn {
  transform: translateY(8px);
  transition: transform 0.3s ease;
  font-size: 0.85rem;
  font-weight: 600;
}

.product-cell:hover .overlay-btn {
  transform: translateY(0);
}

/* ── Badges ── */
.badge-category {
  position: absolute;
  top: 0.65rem;
  left: 0.65rem;
  background: rgba(28, 16, 8, 0.82);
  color: var(--color-cream);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.2rem 0.6rem;
  border-radius: 50px;
  backdrop-filter: blur(4px);
}

.badge-new {
  position: absolute;
  top: 0.65rem;
  right: 0.65rem;
  background: var(--color-accent);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.2rem 0.55rem;
  border-radius: 50px;
}

.badge-stock {
  position: absolute;
  bottom: 0.65rem;
  right: 0.65rem;
  background: #ff6b35;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 50px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-cell:hover .badge-stock {
  opacity: 1;
}

/* ── Info ── */
.product-info {
  padding: 0.85rem 1rem 1rem;
}

.product-name {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-price {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-accent);
}

.btn-add-mini {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1.5px solid var(--color-dark);
  background: transparent;
  color: var(--color-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, transform 0.2s;
}

.btn-add-mini:hover {
  background: var(--color-dark);
  color: #fff;
  transform: scale(1.1);
}
</style>
