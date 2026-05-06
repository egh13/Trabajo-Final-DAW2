import { api } from '@/services/apiClient'
import type { IpBlock } from '@/types'

// Obtiene todos los bloqueos activos
export const fetchBlocks = async (): Promise<IpBlock[]> => {
  const res = await api.get<IpBlock[]>('/blocks')
  if (!res.data) throw new Error('Respuesta inesperada del servidor')
  return res.data
}

// Crea un bloqueo manual por IP o email
export const createBlock = async (data: { ip?: string; email?: string; reason: string; durationMinutes?: number }): Promise<IpBlock> => {
  const res = await api.post<IpBlock>('/blocks', data)
  if (!res.data) throw new Error(res.message ?? 'Error al crear bloqueo')
  return res.data
}

// Elimina un bloqueo por su ID
export const deleteBlock = async (id: number): Promise<void> => {
  const res = await api.delete(`/blocks/${id}`)
  if (!res.success) throw new Error(res.message ?? 'Error al eliminar bloqueo')
}
