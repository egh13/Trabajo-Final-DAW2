import { Request, Response, NextFunction } from 'express'
import authService from '../services/authService'
import { mergeSessionCartIntoUser } from '../services/cartService'
import { createLog, getClientIp } from '../services/admin/logService'
import { sendWelcomeEmail } from '../services/mailService'
import type { ApiResponse, UserPublic } from '../types'

// POST /api/auth/register
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user, token } = await authService.register(req.body)
    const sessionId = req.headers['x-session-id'] as string | undefined
    if (sessionId) await mergeSessionCartIntoUser(sessionId, user.id)

    // Enviar correo de bienvenida de forma asíncrona (no bloquea la respuesta)
    sendWelcomeEmail(user.email, user.name).catch(err =>
      console.error('Error al enviar correo de bienvenida:', err)
    )

    await createLog({ level: 'INFO', module: 'Auth', action: 'Registro de nuevo usuario', userId: user.id, ip: getClientIp(req) })

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

    await createLog({ level: 'INFO', module: 'Auth', action: 'Login exitoso', userId: user.id, ip: getClientIp(req) })

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión correcto.',
      data: { user: user as any, token },    } as ApiResponse<{ user: UserPublic; token: string }>)
  } catch (err: any) {
    if (err.statusCode) {
      await createLog({ level: 'ERROR', module: 'Auth', action: `Login fallido — ${err.message}`, ip: getClientIp(req), detail: `email: ${req.body?.email ?? 'desconocido'}` })
      res.status(err.statusCode).json({ success: false, message: err.message } as ApiResponse<null>)
      return
    }
    next(err)
  }
}

// GET /api/auth/me— requiere autenticación
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
    }    res.status(200).json({ success: true, data: user as any } as ApiResponse<UserPublic>)
  } catch (err) {
    next(err)
  }
}