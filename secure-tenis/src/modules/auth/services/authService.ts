import { api } from '@/services/apiClient'
import type { ApiResponse, AuthResponse, LoginPayload, RegisterPayload, User } from '@/types'

export const loginRequest = (data: LoginPayload): Promise<ApiResponse<AuthResponse>> =>
  api.post<AuthResponse>('/auth/login', data)

export const registerRequest = (data: RegisterPayload): Promise<ApiResponse<AuthResponse>> =>
  api.post<AuthResponse>('/auth/register', data)

export const getMeRequest = (): Promise<ApiResponse<User>> =>
  api.get<User>('/auth/me')
