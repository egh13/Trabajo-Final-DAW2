import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem } from '@/types'
import {
  fetchCart,
  addItemToCart,
  updateItemInCart,
  removeItemFromCart,
  clearCartRequest,
} from '@/modules/cart/services/cartService'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + (item.product_price ?? 0) * item.quantity, 0)
  )

  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const load = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await fetchCart()
      items.value = res.data ?? []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar el carrito'
    } finally {
      loading.value = false
    }
  }

  const addItem = async (productId: number, quantity = 1) => {
    error.value = null
    try {
      await addItemToCart(productId, quantity)
      await load()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al añadir al carrito'
    }
  }

  const updateItem = async (productId: number, quantity: number) => {
    error.value = null
    try {
      await updateItemInCart(productId, quantity)
      await load()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar el carrito'
    }
  }

  const removeItem = async (productId: number) => {
    error.value = null
    try {
      await removeItemFromCart(productId)
      await load()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar del carrito'
    }
  }

  const clearCart = async () => {
    error.value = null
    try {
      await clearCartRequest()
      items.value = []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al vaciar el carrito'
    }
  }

  return { items, loading, error, total, itemCount, load, addItem, updateItem, removeItem, clearCart }
})
