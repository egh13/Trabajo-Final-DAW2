import { api } from '@/services/apiClient'
import type { CartItem, ApiResponse } from '@/types'

export const fetchCart = (): Promise<ApiResponse<CartItem[]>> =>
  api.get<CartItem[]>('/cart')

export const addItemToCart = (product_id: number, quantity: number): Promise<ApiResponse<CartItem>> =>
  api.post<CartItem>('/cart', { product_id, quantity })

export const updateItemInCart = (productId: number, quantity: number): Promise<ApiResponse<CartItem | null>> =>
  api.put<CartItem | null>(`/cart/${productId}`, { quantity })

export const removeItemFromCart = (productId: number): Promise<ApiResponse<null>> =>
  api.delete<null>(`/cart/${productId}`)

export const clearCartRequest = (): Promise<ApiResponse<null>> =>
  api.delete<null>('/cart/clear')
