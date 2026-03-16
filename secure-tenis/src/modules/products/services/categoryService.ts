import { api } from '@/services/apiClient'
import type { Category, ApiResponse } from '@/types'

export const fetchCategories = (): Promise<ApiResponse<Category[]>> =>
  api.get<Category[]>('/categories')
