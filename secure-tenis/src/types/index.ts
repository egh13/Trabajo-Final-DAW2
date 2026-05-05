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
  createdAt: string
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
  createdAt: string
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

// Niveles de severidad de un log
export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG'

// Registro individual de auditoría
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

// Filtros aplicables a la consulta de logs
export interface UserLogFilters {
  search?: string
  level?: LogLevel | ''
  module?: string
  from?: string
  to?: string
  page?: number
  pageSize?: number
}

// Respuesta paginada del endpoint de logs
export interface PaginatedLogs {
  data: UserLog[]
  total: number
  page: number
  pageSize: number
}

// Estadísticas de autenticación del panel de administración
export interface AuthStats {
  totalLogins30d: number
  failedAttempts30d: number
  uniqueUsersToday: number
  recentSessions: { user: string; time: string; ok: boolean }[]
  failedAttempts: { time: string; email: string; ip: string; reason: string }[]
  chartData: { day: string; ok: number; fail: number }[]
}
