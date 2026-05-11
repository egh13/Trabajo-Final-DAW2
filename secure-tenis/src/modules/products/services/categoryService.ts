import { api } from '@/services/apiClient'
import type { Category, ApiResponse } from '@/types'

export const fetchCategories = (): Promise<ApiResponse<Category[]>> =>
  api.get<Category[]>('/categories')

export const createCategory = (data: { name: string; description?: string }): Promise<ApiResponse<Category>> =>
  api.post<Category>('/categories', data)

export const updateCategory = (id: number, data: { name: string; description?: string }): Promise<ApiResponse<Category>> =>
  api.put<Category>(`/categories/${id}`, data)

export const deleteCategory = (id: number): Promise<ApiResponse<null>> =>
  api.delete(`/categories/${id}`)
