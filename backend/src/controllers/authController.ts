import { Request, Response, NextFunction } from 'express'
import authService from '../services/authService'
import { mergeSessionCartIntoUser } from '../services/cartService'
import type { ApiResponse, UserPublic } from '../types'

// POST /api/auth/register
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user, token } = await authService.register(req.body)

    // Fusionar carrito anónimo al nuevo usuario si venía con sesión
    const sessionId = req.headers['x-session-id'] as string | undefined
    if (sessionId) mergeSessionCartIntoUser(sessionId, user.id)

    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente.',
      data: { user, token },
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

    // Fusionar carrito anónimo al usuario autenticado si venía con sesión
    const sessionId = req.headers['x-session-id'] as string | undefined
    if (sessionId) mergeSessionCartIntoUser(sessionId, user.id)

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión correcto.',
      data: { user, token },
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

    const user = authService.findById(req.user.userId)
    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado.' } as ApiResponse<null>)
      return
    }

    res.status(200).json({ success: true, data: user } as ApiResponse<UserPublic>)
  } catch (err) {
    next(err)
  }
}
