import { api } from '@/services/apiClient'
import type { PaginatedLogs, UserLogFilters } from '@/types'

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
