import bcrypt from 'bcryptjs'
import { prisma } from '../../config/prisma'
import type { UserPublic } from '../../types'

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

const roleMapToDB = {
  'cliente': 'CLIENT',
  'admin': 'ADMIN',
  'analista': 'ANALYST'
} as const

const roleMapFromDB = {
  'CLIENT': 'cliente',
  'ADMIN': 'admin',
  'ANALYST': 'analista'
} as const

// Mapea un registro de Prisma al tipo público de usuario
const toPublic = (user: { id: number; name: string; email: string; role: keyof typeof roleMapFromDB; createdAt: Date }): UserPublic => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: roleMapFromDB[user.role],
  createdAt: user.createdAt.toISOString()
})

// Obtiene todos los usuarios ordenados por fecha de creación
const findAll = async (): Promise<UserPublic[]> => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
  return users.map(toPublic)
}

// Crea un nuevo usuario con contraseña hasheada
const createUser = async (data: { name: string; email: string; password: string; role?: string }): Promise<UserPublic> => {
  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) {
    throw Object.assign(new Error('Ya existe una cuenta con ese email.'), { statusCode: 409 })
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)
  const role = data.role ? (roleMapToDB[data.role as keyof typeof roleMapToDB] ?? 'CLIENT') : 'CLIENT'

  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, password: hashedPassword, role }
  })

  return toPublic(user)
}

// Actualiza los campos indicados de un usuario existente
const updateUser = async (id: number, data: { name?: string; email?: string; password?: string; role?: string }): Promise<UserPublic | null> => {
  if (data.email) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing && existing.id !== id) {
      throw Object.assign(new Error('Ya existe una cuenta con ese email.'), { statusCode: 409 })
    }
  }

  const updateData: Record<string, unknown> = {}
  if (data.name) updateData.name = data.name
  if (data.email) updateData.email = data.email
  if (data.password) updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS)
  if (data.role) updateData.role = roleMapToDB[data.role as keyof typeof roleMapToDB] ?? 'CLIENT'

  try {
    const user = await prisma.user.update({ where: { id }, data: updateData })
    return toPublic(user)
  } catch {
    return null
  }
}

// Elimina un usuario y sus registros relacionados en una transacción
const deleteUser = async (id: number): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return false

  await prisma.$transaction(async (tx) => {
    // Eliminar ítems de pedidos del usuario
    const orders = await tx.order.findMany({ where: { userId: id }, select: { id: true } })
    const orderIds = orders.map(o => o.id)
    if (orderIds.length > 0) {
      await tx.orderItem.deleteMany({ where: { orderId: { in: orderIds } } })
    }

    // Eliminar pedidos, carrito, logs y bloqueos asociados
    await tx.order.deleteMany({ where: { userId: id } })
    await tx.cartItem.deleteMany({ where: { userId: id } })
    await tx.userLog.deleteMany({ where: { userId: id } })
    await tx.ipBlock.deleteMany({ where: { userId: id } })

    // Eliminar el usuario
    await tx.user.delete({ where: { id } })
  })

  return true
}

export default { findAll, createUser, updateUser, deleteUser }
