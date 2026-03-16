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
  user_id: number | null
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

// Roles disponibles en la aplicación
export type UserRole = 'admin' | 'cliente' | 'analista'

export interface User {
  id: number
  name: string
  email: string
  password: string
  role: UserRole
  created_at: string
}

// Datos públicos del usuario (sin contraseña)
export type UserPublic = Omit<User, 'password'>

// Payload contenido en el token JWT
export interface JwtPayload {
  userId: number
  email: string
  role: UserRole
}

// Petición de registro
export interface RegisterBody {
  name: string
  email: string
  password: string
  role?: UserRole
}

// Petición de login
export interface LoginBody {
  email: string
  password: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: unknown
}
