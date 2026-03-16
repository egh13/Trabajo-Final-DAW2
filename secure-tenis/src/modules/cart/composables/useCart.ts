import { useCartStore } from '@/stores/cartStore'

// Exporta el store directamente como composable para mantener compatibilidad con los consumidores existentes
export function useCart() {
  return useCartStore()
}
