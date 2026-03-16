import type { ApiResponse } from '@/types'

// En desarrollo usa el proxy de Vite; en producción configurar VITE_API_URL
const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

// Obtener o generar un ID de sesión persistente para el carrito
const getSessionId = (): string => {
  let id = localStorage.getItem('session_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('session_id', id)
  }
  return id
}

const buildHeaders = (): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-session-id': getSessionId(),
  }

  // Adjuntar token JWT si existe
  const token = localStorage.getItem('auth_token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...buildHeaders(), ...options.headers },
  })

  const json: ApiResponse<T> = await res.json()

  if (!res.ok) {
    throw new Error(json.message ?? 'Error en la petición')
  }

  return json
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
