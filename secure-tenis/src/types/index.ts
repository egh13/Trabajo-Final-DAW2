export interface Category {
  id: number
  name: string
  description: string | null
  created_at: string
}

export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  image_url: string | null
  category_id: number
  category_name?: string
  created_at: string
}

export interface CartItem {
  id: number
  session_id: string
  product_id: number
  quantity: number
  product_name?: string
  product_price?: number
  image_url?: string | null
}

export interface Order {
  id: number
  session_id: string
  total: number
  status: 'pending' | 'paid' | 'cancelled'
  created_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  unit_price: number
  product_name?: string
}

// Roles del sistema
export type UserRole = 'admin' | 'cliente' | 'analista'

// Datos públicos del usuario
export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  created_at: string
}

// Respuesta de login/register
export interface AuthResponse {
  user: User
  token: string
}

// Formulario de registro — el rol siempre es 'cliente', lo asigna el backend
export interface RegisterPayload {
  name: string
  email: string
  password: string
}

// Formulario de login
export interface LoginPayload {
  email: string
  password: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}
