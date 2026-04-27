import { prisma } from '../config/prisma'
import type { LogLevel, PaginatedLogs, UserLog, UserLogFilters } from '../types'

// Crea un nuevo registro de auditoría en la base de datos
const createLog = async (params: {
  level: LogLevel
  module: string
  action: string
  userId?: number
  ip?: string
  detail?: string
}): Promise<void> => {
  await prisma.userLog.create({
    data: {
      level: params.level,
      module: params.module,
      action: params.action,
      userId: params.userId ?? null,
      ip: params.ip ?? null,
      detail: params.detail ?? null,
    },
  })
}

// Obtiene los logs paginados aplicando los filtros indicados
const getLogs = async (filters: UserLogFilters): Promise<PaginatedLogs> => {
  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 10
  const skip = (page - 1) * pageSize

  const where: Record<string, unknown> = {}

  if (filters.level) {
    where.level = filters.level
  }

  if (filters.module) {
    where.module = filters.module
  }

  if (filters.from || filters.to) {
    where.createdAt = {
      ...(filters.from ? { gte: new Date(filters.from) } : {}),
      ...(filters.to ? { lte: new Date(`${filters.to}T23:59:59`) } : {}),
    }
  }

  if (filters.search) {
    where.OR = [
      { action: { contains: filters.search } },
      { module: { contains: filters.search } },
      { ip: { contains: filters.search } },
      { user: { email: { contains: filters.search } } },
    ]
  }

  const [rows, total] = await Promise.all([
    prisma.userLog.findMany({
      where,
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.userLog.count({ where }),
  ])

  const data: UserLog[] = rows.map(row => ({
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    level: row.level as LogLevel,
    module: row.module,
    userId: row.userId,
    userName: row.user?.email ?? null,
    action: row.action,
    ip: row.ip,
    detail: row.detail,
  }))

  return { data, total, page, pageSize }
}

export { createLog, getLogs }
