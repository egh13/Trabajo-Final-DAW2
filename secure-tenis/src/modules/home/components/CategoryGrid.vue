<template>
  <section class="categories-section">

    <div class="section-header mb-4">
      <p class="section-overline">Explora</p>
      <h2 class="section-title">Nuestras Categorías</h2>
    </div>

    <div v-if="categories.length" class="categories-grid">
      <router-link
        v-for="(cat, idx) in displayCategories"
        :key="cat.id"
        :to="cat.route"
        class="category-card"
        :class="`category-card--${idx}`"
        data-aos="fade-up"
        :data-aos-delay="idx * 80"
      >
        <div class="cat-icon">
          <i :class="`bi ${cat.icon}`" />
        </div>
        <span class="cat-name">{{ cat.name }}</span>
        <i class="bi bi-arrow-right cat-arrow" />
      </router-link>
    </div>

    <!-- Fallback si la API aún no responde -->
    <div v-else class="categories-grid">
      <router-link class="category-card category-card--0" to="/zapatillas">
        <div class="cat-icon"><i class="bi bi-lightning-fill" /></div>
        <span class="cat-name">Zapatillas</span>
        <i class="bi bi-arrow-right cat-arrow" />
      </router-link>
      <router-link class="category-card category-card--1" to="/ropa">
        <div class="cat-icon"><i class="bi bi-tags-fill" /></div>
        <span class="cat-name">Ropa</span>
        <i class="bi bi-arrow-right cat-arrow" />
      </router-link>
      <router-link class="category-card category-card--2" to="/accesorios">
        <div class="cat-icon"><i class="bi bi-stars" /></div>
        <span class="cat-name">Accesorios</span>
        <i class="bi bi-arrow-right cat-arrow" />
      </router-link>
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { fetchCategories } from '@/modules/products/services/categoryService'
import type { Category } from '@/types'

const categories = ref<Category[]>([])

const routeMap: Record<string, string> = {
  zapatillas: '/zapatillas',
  ropa: '/ropa',
  accesorios: '/accesorios',
}

const iconMap: Record<string, string> = {
  zapatillas: 'bi-lightning-fill',
  ropa: 'bi-tags-fill',
  accesorios: 'bi-stars',
}

const displayCategories = computed(() =>
  categories.value.map(cat => ({
    ...cat,
    route: routeMap[cat.name.toLowerCase()] ?? '/productos',
    icon: iconMap[cat.name.toLowerCase()] ?? 'bi-grid-fill',
  }))
)

onMounted(async () => {
  try {
    const res = await fetchCategories()
    categories.value = res.data ?? []
  } catch {
    // fallback estático ya visible en el template
  }
})
</script>

<style scoped>
.section-overline {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-garnet);
  margin-bottom: 0.2rem;
}

.section-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-espresso);
  margin: 0;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

@media (max-width: 768px) {
  .categories-grid { grid-template-columns: 1fr; }
}

/* ── Card ── */
.category-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 2rem 1.5rem;
  border-radius: 1rem;
  text-decoration: none;
  min-height: 180px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.category-card--0 {
  background: linear-gradient(145deg, #1E1E1E 0%, #282828 100%);
}
.category-card--1 {
  background: linear-gradient(145deg, #3A2820 0%, #4A3530 100%);
}
.category-card--2 {
  background: linear-gradient(145deg, var(--color-garnet) 0%, var(--color-garnet-dark) 100%);
}

.cat-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: #F4F4F2;
}

.cat-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #F4F4F2;
  flex: 1;
}

.cat-arrow {
  color: rgba(240, 240, 240, 0.4);
  font-size: 0.9rem;
  align-self: flex-end;
  transition: transform 0.2s, color 0.2s;
}

.category-card:hover .cat-arrow {
  transform: translateX(5px);
  color: #F4F4F2;
}
</style>
