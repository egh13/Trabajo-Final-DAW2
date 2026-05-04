import type { Request } from 'express'
import { prisma } from '../config/prisma'
import type { LogLevel, PaginatedLogs, UserLog, UserLogFilters } from '../types'

// Extrae la IP real del cliente y la normaliza a formato IPv4
const getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for']
  const raw = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.ip ?? req.socket.remoteAddress ?? '0.0.0.0'

  // Convierte IPv4-mapped IPv6 (::ffff:x.x.x.x) a IPv4 puro
  return raw.startsWith('::ffff:') ? raw.slice(7) : raw
}

// Construye el objeto where de Prisma a partir de los filtros comunes
const buildWhere = (filters: UserLogFilters): Record<string, unknown> => {
  const where: Record<string, unknown> = {}

  if (filters.level) where.level = filters.level
  if (filters.module) where.module = filters.module

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
      { detail: { contains: filters.search } },
      { user: { email: { contains: filters.search } } },
    ]
  }

  return where
}

// Mapea una fila de Prisma al tipo UserLog
const mapRow = (row: {
  id: number
  createdAt: Date
  level: string
  module: string
  userId: number | null
  user: { email: string } | null
  action: string
  ip: string | null
  detail: string | null
}): UserLog => ({
  id: row.id,
  createdAt: row.createdAt.toISOString(),
  level: row.level as LogLevel,
  module: row.module,
  userId: row.userId,
  userName: row.user?.email ?? null,
  action: row.action,
  ip: row.ip,
  detail: row.detail,
})

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
  const where = buildWhere(filters)

  const [rows, total] = await Promise.all([
    prisma.userLog.findMany({
      where,
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.userLog.count({ where }),
  ])

  return { data: rows.map(mapRow), total, page, pageSize }
}

// Obtiene todos los logs sin paginar, para exportación
const getAllLogs = async (filters: UserLogFilters): Promise<UserLog[]> => {
  const rows = await prisma.userLog.findMany({
    where: buildWhere(filters),
    include: { user: { select: { email: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return rows.map(mapRow)
}

export { createLog, getLogs, getAllLogs, getClientIp, getAuthStats }

// Estadísticas de autenticación calculadas desde los logs reales
interface AuthStats {
  totalLogins30d: number
  failedAttempts30d: number
  uniqueUsersToday: number
  recentSessions: { user: string; time: string; ok: boolean }[]
  failedAttempts: { time: string; email: string; ip: string; reason: string }[]
  chartData: { day: string; ok: number; fail: number }[]
}

const  getAuthStats = async (): Promise<AuthStats> => {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Logins exitosos en los últimos 30 días
  const totalLogins30d = await prisma.userLog.count({
    where: { module: 'Auth', action: 'Login exitoso', createdAt: { gte: thirtyDaysAgo } },
  })

  // Intentos fallidos en los últimos 30 días
  const failedAttempts30d = await prisma.userLog.count({
    where: { module: 'Auth', action: { startsWith: 'Login fallido' }, createdAt: { gte: thirtyDaysAgo } },
  })

  // Usuarios únicos que hicieron login hoy
  const todayLogins = await prisma.userLog.findMany({
    where: { module: 'Auth', action: 'Login exitoso', createdAt: { gte: todayStart } },
    select: { userId: true },
  })
  const uniqueUsersToday = new Set(todayLogins.map(l => l.userId).filter(Boolean)).size

  // Últimas 10 sesiones (login exitoso + fallido)
  const recentRows = await prisma.userLog.findMany({
    where: { module: 'Auth', OR: [{ action: 'Login exitoso' }, { action: { startsWith: 'Login fallido' } }] },
    include: { user: { select: { email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  const recentSessions = recentRows.map(r => ({
    user: r.user?.email ?? r.detail?.replace('email: ', '') ?? 'Desconocido',
    time: r.createdAt.toISOString(),
    ok: r.action === 'Login exitoso',
  }))

  // Últimos 10 intentos fallidos con detalle
  const failedRows = await prisma.userLog.findMany({
    where: { module: 'Auth', action: { startsWith: 'Login fallido' } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  const failedAttempts = failedRows.map(r => {
    const reason = r.action.replace('Login fallido — ', '').replace('Login fallido — ', '')
    return {
      time: r.createdAt.toISOString(),
      email: r.detail?.replace('email: ', '') ?? 'Desconocido',
      ip: r.ip ?? '',
      reason: reason.charAt(0).toUpperCase() + reason.slice(1),
    }
  })

  // Datos del gráfico: logins vs fallidos por día (últimos 7 días)
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const chartData: AuthStats['chartData'] = []

  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(dayStart)
    dayEnd.setHours(23, 59, 59, 999)

    const [ok, fail] = await Promise.all([
      prisma.userLog.count({
        where: { module: 'Auth', action: 'Login exitoso', createdAt: { gte: dayStart, lte: dayEnd } },
      }),
      prisma.userLog.count({
        where: { module: 'Auth', action: { startsWith: 'Login fallido' }, createdAt: { gte: dayStart, lte: dayEnd } },
      }),
    ])

    chartData.push({ day: dayNames[dayStart.getDay()], ok, fail })
  }

  return { totalLogins30d, failedAttempts30d, uniqueUsersToday, recentSessions, failedAttempts, chartData }
}

