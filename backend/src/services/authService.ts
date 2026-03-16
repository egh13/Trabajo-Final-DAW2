import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../config/db'
import { jwtConfig } from '../config/jwt'
import type { User, UserPublic, JwtPayload, RegisterBody, LoginBody } from '../types'

const SALT_ROUNDS = 10

// Buscar usuario por email
const findByEmail = (email: string): User | undefined => {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined
}

// Buscar usuario por id (datos públicos)
const findById = (id: number): UserPublic | undefined => {
  return db
    .prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?')
    .get(id) as UserPublic | undefined
}

// Registrar un nuevo usuario
const register = async (data: RegisterBody): Promise<{ user: UserPublic; token: string }> => {
  const existing = findByEmail(data.email)
  if (existing) {
    throw Object.assign(new Error('Ya existe una cuenta con ese email.'), { statusCode: 409 })
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)

  const result = db
    .prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)')
    .run(data.name, data.email, hashedPassword, data.role ?? 'cliente')

  const user: UserPublic = {
    id: result.lastInsertRowid as number,
    name: data.name,
    email: data.email,
    role: data.role ?? 'cliente',
    created_at: new Date().toISOString(),
  }

  const token = generateToken(user)

  return { user, token }
}

// Iniciar sesión
const login = async (data: LoginBody): Promise<{ user: UserPublic; token: string }> => {
  const user = findByEmail(data.email)
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
    created_at: user.created_at,
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
