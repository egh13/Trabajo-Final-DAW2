import { api } from '@/services/apiClient'
import type { Order, ApiResponse } from '@/types'

export const fetchOrders = (): Promise<ApiResponse<Order[]>> =>
  api.get<Order[]>('/orders')

export const createOrderRequest = (): Promise<ApiResponse<Order>> =>
  api.post<Order>('/orders', {})
