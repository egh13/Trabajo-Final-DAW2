import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/prisma'
import { jwtConfig } from '../config/jwt'
import type { User, UserPublic, JwtPayload, RegisterBody, LoginBody } from '../types'

const SALT_ROUNDS = 10

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

// Buscar usuario por email
const findByEmail = async (email: string): Promise<User | undefined> => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return undefined
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,    
    role: roleMapFromDB[user.role],
    createdAt: user.createdAt.toISOString()
  }
}

// Buscar usuario por id (datos públicos)
const findById = async (id: number): Promise<UserPublic | undefined> => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return undefined
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: roleMapFromDB[user.role],
    createdAt: user.createdAt.toISOString()
  }
}

// Registrar un nuevo usuario
const register = async (data: RegisterBody): Promise<{ user: UserPublic; token: string }> => {
  const existing = await findByEmail(data.email)
  if (existing) {
    throw Object.assign(new Error('Ya existe una cuenta con ese email.'), { statusCode: 409 })
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: roleMapToDB[data.role ?? 'cliente']
    }
  })

  const userPublic: UserPublic = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: roleMapFromDB[user.role],    
    createdAt: user.createdAt.toISOString()
  }

  const token = generateToken(userPublic)

  return { user: userPublic, token }
}

// Iniciar sesión
const login = async (data: LoginBody): Promise<{ user: UserPublic; token: string }> => {
  const user = await findByEmail(data.email)
  if (!user) {
    throw Object.assign(new Error('Credenciales incorrectas.'), { statusCode: 401 })
  }

  const valid = await bcrypt.compare(data.password, user.password)
  if (!valid) {
    throw Object.assign(new Error('Credenciales incorrectas.'), { statusCode: 401 })
  }

  const publicUser: UserPublic = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }

  const token = generateToken(publicUser)

  return { user: publicUser, token }
}

// Generar token JWT
const generateToken = (user: UserPublic): string => {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  }

  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn as jwt.SignOptions['expiresIn'],
  })
}

// Listar todos los usuarios (solo para admin)
const findAll = async (): Promise<UserPublic[]> => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  })
  
  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: roleMapFromDB[user.role],
    createdAt: user.createdAt.toISOString()
  }))
}

// Crear usuario como administrador
const createUser = async (data: { name: string; email: string; password: string; role?: string }): Promise<UserPublic> => {
  const existing = await findByEmail(data.email)
  if (existing) {
    throw Object.assign(new Error('Ya existe una cuenta con ese email.'), { statusCode: 409 })
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)
  const userRole = data.role ? roleMapToDB[data.role as keyof typeof roleMapToDB] || 'CLIENT' : 'CLIENT'

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: userRole
    }
  })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: roleMapFromDB[user.role],
    createdAt: user.createdAt.toISOString()
  }
}

// Actualizar usuario como administrador
const updateUser = async (id: number, data: { name?: string; email?: string; password?: string; role?: string }): Promise<UserPublic | undefined> => {
  try {
    // Si email se actualiza, verificar que no exista
    if (data.email) {
      const existing = await prisma.user.findUnique({ where: { email: data.email } })
      if (existing && existing.id !== id) {
        throw Object.assign(new Error('Ya existe una cuenta con ese email.'), { statusCode: 409 })
      }
    }

    const updateData: any = {}
    if (data.name) updateData.name = data.name
    if (data.email) updateData.email = data.email
    if (data.password) updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS)
    if (data.role) updateData.role = roleMapToDB[data.role as keyof typeof roleMapToDB] || 'CLIENT'

    const user = await prisma.user.update({
      where: { id },
      data: updateData
    })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: roleMapFromDB[user.role],
      createdAt: user.createdAt.toISOString()
    }
  } catch (err) {
    return undefined
  }
}

// Eliminar usuario como administrador
const deleteUser = async (id: number): Promise<boolean> => {
  try {
    await prisma.user.delete({ where: { id } })
    return true
  } catch (err) {
    return false
  }
}

export default { findByEmail, findById, findAll, createUser, updateUser, deleteUser, register, login }
