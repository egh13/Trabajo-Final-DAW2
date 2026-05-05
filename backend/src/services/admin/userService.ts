import bcrypt from 'bcryptjs'
import { prisma } from '../../config/prisma'
import type { UserPublic } from '../../types'

const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;

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

// Elimina un usuario por su ID
const deleteUser = async (id: number): Promise<boolean> => {
  try {
    await prisma.user.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}

export default { findAll, createUser, updateUser, deleteUser }
