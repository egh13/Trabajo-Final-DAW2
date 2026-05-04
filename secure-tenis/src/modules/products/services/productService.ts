import { api } from '@/services/apiClient'
import type { Product, ApiResponse } from '@/types'

export const fetchProducts = (categoryId?: number): Promise<ApiResponse<Product[]>> => {
  const query = categoryId ? `?category=${categoryId}` : ''
  return api.get<Product[]>(`/products${query}`)
}

export const fetchProductById = (id: number): Promise<ApiResponse<Product>> => {
  return api.get<Product>(`/products/${id}`)
}

export const createProduct = (product: Omit<Product, 'id' | 'createdAt'>): Promise<ApiResponse<Product>> => {
  return api.post<Product>('/products', product)
}

export const updateProduct = (id: number, product: Partial<Product>): Promise<ApiResponse<Product>> => {
  return api.put<Product>(`/products/${id}`, product)
}

export const deleteProduct = (id: number): Promise<ApiResponse<void>> => {
  return api.delete<void>(`/products/${id}`)
}
