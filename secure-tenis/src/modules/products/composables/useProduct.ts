import { ref } from 'vue'
import type { Product } from '@/types'
import { fetchProductById } from '@/modules/products/services/productService'

export function useProduct() {
  const product = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const load = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const res = await fetchProductById(id)
      product.value = res.data ?? null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar el producto'
    } finally {
      loading.value = false
    }
  }

  return { product, loading, error, load }
}
