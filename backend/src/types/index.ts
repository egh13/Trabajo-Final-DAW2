export interface Category {
  id: number
  name: string
  description: string | null
  createdAt: string
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
  createdAt: string
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
  userId: number
  total: number
  status: string
  createdAt: Date
  items?: OrderItem[]
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  price: number
}

// Roles disponibles en la aplicación
export type UserRole = 'admin' | 'cliente' | 'analista'

export interface User {
  id: number
  name: string
  email: string
  password: string
  role: UserRole
  createdAt: string
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

// Niveles de log disponibles
export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG'

// Registro de auditoría de usuario
export interface UserLog {
  id: number
  createdAt: string
  level: LogLevel
  module: string
  userId: number | null
  userName: string | null
  action: string
  ip: string | null
  detail: string | null
}

// Parámetros de filtrado para los logs
export interface UserLogFilters {
  search?: string
  level?: LogLevel
  module?: string
  from?: string
  to?: string
  page?: number
  pageSize?: number
}

// Respuesta paginada de logs
export interface PaginatedLogs {
  data: UserLog[]
  total: number
  page: number
  pageSize: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: unknown
}
