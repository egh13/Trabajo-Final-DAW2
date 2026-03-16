import { ref, computed } from 'vue'
import type { Product } from '@/types'
import { fetchProducts } from '@/modules/products/services/productService'

export function useProducts(categoryId?: number) {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const hasProducts = computed(() => products.value.length > 0)

  const load = async (catId?: number) => {
    loading.value = true
    error.value = null
    try {
      const res = await fetchProducts(catId ?? categoryId)
      products.value = res.data ?? []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar productos'
    } finally {
      loading.value = false
    }
  }

  return { products, loading, error, hasProducts, load }
}
