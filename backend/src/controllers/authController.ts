import { Request, Response, NextFunction } from 'express'
import authService from '../services/authService'
import { mergeSessionCartIntoUser } from '../services/cartService'
import type { ApiResponse, UserPublic } from '../types'

// POST /api/auth/register
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user, token } = await authService.register(req.body)

    const sessionId = req.headers['x-session-id'] as string | undefined
    if (sessionId) await mergeSessionCartIntoUser(sessionId, user.id)

    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente.',
      data: { user: user as any, token }, 
    } as ApiResponse<{ user: UserPublic; token: string }>)
  } catch (err: any) {
    if (err.statusCode) {
      res.status(err.statusCode).json({ success: false, message: err.message } as ApiResponse<null>)
      return
    }
    next(err)
  }
}

// POST /api/auth/login
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user, token } = await authService.login(req.body)

    const sessionId = req.headers['x-session-id'] as string | undefined
    if (sessionId) await mergeSessionCartIntoUser(sessionId, user.id)

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión correcto.',
      data: { user: user as any, token },
    } as ApiResponse<{ user: UserPublic; token: string }>)
  } catch (err: any) {
    if (err.statusCode) {
      res.status(err.statusCode).json({ success: false, message: err.message } as ApiResponse<null>)
      return
    }
    next(err)
  }
}

// GET /api/auth/me — requiere autenticación
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'No autorizado.' } as ApiResponse<null>)
      return
    }

    const user = await authService.findById(req.user.userId)
    
    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado.' } as ApiResponse<null>)
      return
    }

    res.status(200).json({ success: true, data: user as any } as ApiResponse<UserPublic>)
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/users — solo para administradores
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Acceso denegado. Solo administradores.' } as ApiResponse<null>)
      return
    }

    const users = await authService.findAll()
    res.status(200).json({ success: true, data: users } as ApiResponse<UserPublic[]>)
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/users — crear usuario como administrador
export const createUserAsAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Acceso denegado. Solo administradores.' } as ApiResponse<null>)
      return
    }

    const { name, email, password, role } = req.body

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      res.status(400).json({ success: false, message: 'Faltan campos obligatorios: name, email, password' } as ApiResponse<null>)
      return
    }

    const user = await authService.createUser({ name, email, password, role })
    res.status(201).json({ success: true, data: user } as ApiResponse<UserPublic>)
  } catch (err: any) {
    if (err.statusCode) {
      res.status(err.statusCode).json({ success: false, message: err.message } as ApiResponse<null>)
      return
    }
    next(err)
  }
}

// PUT /api/auth/users/:id — editar usuario como administrador
export const updateUserAsAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Acceso denegado. Solo administradores.' } as ApiResponse<null>)
      return
    }

    const userId = Number(req.params.id)
    const { name, email, password, role } = req.body

    const user = await authService.updateUser(userId, { name, email, password, role })
    
    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado.' } as ApiResponse<null>)
      return
    }

    res.status(200).json({ success: true, data: user } as ApiResponse<UserPublic>)
  } catch (err: any) {
    if (err.statusCode) {
      res.status(err.statusCode).json({ success: false, message: err.message } as ApiResponse<null>)
      return
    }
    next(err)
  }
}

// DELETE /api/auth/users/:id — eliminar usuario como administrador
export const deleteUserAsAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Acceso denegado. Solo administradores.' } as ApiResponse<null>)
      return
    }

    const userId = Number(req.params.id)
    const deleted = await authService.deleteUser(userId)

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado.' } as ApiResponse<null>)
      return
    }

    res.status(200).json({ success: true, message: 'Usuario eliminado correctamente.' } as ApiResponse<null>)
  } catch (err: any) {
    if (err.statusCode) {
      res.status(err.statusCode).json({ success: false, message: err.message } as ApiResponse<null>)
      return
    }
    next(err)
  }
}