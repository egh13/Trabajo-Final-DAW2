import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/prisma'
import { jwtConfig } from '../config/jwt'
import type { User, UserPublic, JwtPayload, RegisterBody, LoginBody } from '../types'

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

export default { findByEmail, findById, register, login }
