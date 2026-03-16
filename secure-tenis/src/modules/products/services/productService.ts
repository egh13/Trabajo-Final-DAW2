import { api } from '@/services/apiClient'
import type { Product, ApiResponse } from '@/types'

export const fetchProducts = (categoryId?: number): Promise<ApiResponse<Product[]>> => {
  const query = categoryId ? `?category=${categoryId}` : ''
  return api.get<Product[]>(`/products${query}`)
}

export const fetchProductById = (id: number): Promise<ApiResponse<Product>> => {
  return api.get<Product>(`/products/${id}`)
}
