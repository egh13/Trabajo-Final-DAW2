import { api } from '@/services/apiClient'
import type { AuthStats, PaginatedLogs, SystemStats, UserLogFilters } from '@/types'

// Construye la query string a partir de los filtros activos
const buildQuery = (filters: UserLogFilters): string => {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.level) params.set('level', filters.level)
  if (filters.module) params.set('module', filters.module)
  if (filters.from) params.set('from', filters.from)
  if (filters.to) params.set('to', filters.to)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.pageSize) params.set('pageSize', String(filters.pageSize))
  return params.toString() ? `?${params.toString()}` : ''
}

// Recupera los logs de auditoría paginados y filtrados
export const fetchLogs = async (filters: UserLogFilters): Promise<PaginatedLogs> => {
  const res = await api.get<PaginatedLogs>(`/logs${buildQuery(filters)}`)
  if (!res.data) throw new Error('Respuesta inesperada del servidor')
  return res.data
}

// Descarga un archivo de exportación (CSV o PDF) con los filtros actuales
export const downloadExport = async (format: 'csv' | 'pdf', filters: UserLogFilters): Promise<void> => {
  const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'
  const token = localStorage.getItem('auth_token')
  const query = buildQuery(filters)

  const res = await fetch(`${BASE_URL}/logs/export/${format}${query}`, {
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  })

  if (!res.ok) throw new Error('Error al exportar')

  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `auditoria.${format}`
  a.click()
  URL.revokeObjectURL(url)
}

// Obtiene las estadísticas de autenticación para el panel de administración
export const fetchAuthStats = async (): Promise<AuthStats> => {
  const res = await api.get<AuthStats>('/stats/auth-stats')
  if (!res.data) throw new Error('Respuesta inesperada del servidor')
  return res.data
}

// Obtiene las estadísticas generales del sistema
export const fetchSystemStats = async (): Promise<SystemStats> => {
  const res = await api.get<SystemStats>('/stats/system-stats')
  if (!res.data) throw new Error('Respuesta inesperada del servidor')
  return res.data
}
