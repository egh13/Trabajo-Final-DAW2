import { prisma } from '../../config/prisma'

// Representación pública de un bloqueo
interface BlockEntry {
  id: number
  ip: string | null
  userId: number | null
  email: string | null
  reason: string
  manual: boolean
  expiresAt: string | null
  createdAt: string
}

// Datos requeridos para crear un bloqueo manual
interface CreateBlockBody {
  ip?: string
  email?: string
  reason: string
  durationMinutes?: number
}

// Obtiene todos los bloqueos activos (no expirados)
const findAllActive = async (): Promise<BlockEntry[]> => {
  const now = new Date()
  const rows = await prisma.ipBlock.findMany({
    where: {
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: now } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  })

  return rows.map(toPublic)
}

// Crea un bloqueo manual por IP, email o ambos
const createBlock = async (data: CreateBlockBody): Promise<BlockEntry> => {
  if (!data.ip && !data.email) {
    throw Object.assign(new Error('Debes indicar una IP o un email para bloquear.'), { statusCode: 400 })
  }

  const expiresAt = data.durationMinutes
    ? new Date(Date.now() + data.durationMinutes * 60 * 1000)
    : null

  const row = await prisma.ipBlock.create({
    data: {
      ip: data.ip ?? null,
      email: data.email ?? null,
      reason: data.reason,
      manual: true,
      expiresAt,
    },
  })

  return toPublic(row)
}

// Elimina (desbloquea) un bloqueo por su ID
const removeBlock = async (id: number): Promise<boolean> => {
  try {
    await prisma.ipBlock.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}

// Comprueba si una IP, un userId o un email están bloqueados
const isBlocked = async (ip: string, userId?: number, email?: string): Promise<{ blocked: boolean; reason?: string }> => {
  const now = new Date()

  const conditions: Record<string, unknown>[] = [{ ip }]
  if (userId) conditions.push({ userId })
  if (email) conditions.push({ email })

  const block = await prisma.ipBlock.findFirst({
    where: {
      OR: conditions,
      AND: [
        {
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: now } },
          ],
        },
      ],
    },
    orderBy: { createdAt: 'desc' },
  })

  if (block) return { blocked: true, reason: block.reason }
  return { blocked: false }
}

// Registra un bloqueo automático por exceso de intentos fallidos (por email)
const createAutoBlock = async (email: string, reason: string, durationMinutes: number): Promise<void> => {
  const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000)
  await prisma.ipBlock.create({
    data: {
      email,
      reason,
      manual: false,
      expiresAt,
    },
  })
}

// Mapea un registro de la DB al tipo público
const toPublic = (row: any): BlockEntry => ({
  id: row.id,
  ip: row.ip,
  userId: row.userId,
  email: row.email ?? null,
  reason: row.reason,
  manual: row.manual,
  expiresAt: row.expiresAt?.toISOString() ?? null,
  createdAt: row.createdAt.toISOString(),
})

export default { findAllActive, createBlock, removeBlock, isBlocked, createAutoBlock }
