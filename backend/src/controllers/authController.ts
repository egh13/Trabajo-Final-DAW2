import { Request, Response, NextFunction } from 'express'
import authService from '../services/authService'
import { mergeSessionCartIntoUser } from '../services/cartService'
import { createLog, getClientIp } from '../services/admin/logService'
import blockService from '../services/admin/blockService'
import { sendWelcomeEmail } from '../services/mailService'
import type { ApiResponse, UserPublic } from '../types'

// Configuración del auto-bloqueo por intentos fallidos
const MAX_FAILED_ATTEMPTS = 5
const FAILED_WINDOW_MS = 10 * 60 * 1000
const AUTO_BLOCK_MINUTES = 15

// Registro en memoria de intentos fallidos por email
const failedAttempts = new Map<string, { count: number; firstAttempt: number }>()

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

    } catch (err: any) {    if (err.statusCode) {
      const ip = getClientIp(req)
      const email = req.body?.email ?? 'desconocido'

      // Registrar intento fallido por email y auto-bloquear si se supera el umbral
      const now = Date.now()
      const entry = failedAttempts.get(email)
      if (!entry || now - entry.firstAttempt > FAILED_WINDOW_MS) {
        failedAttempts.set(email, { count: 1, firstAttempt: now })
      } else {
        entry.count++
        if (entry.count >= MAX_FAILED_ATTEMPTS) {
          await blockService.createAutoBlock(email, `Auto-bloqueo: ${MAX_FAILED_ATTEMPTS} intentos fallidos en ${FAILED_WINDOW_MS / 60000} min`, AUTO_BLOCK_MINUTES)
          await createLog({ level: 'WARNING', module: 'Auth', action: `Usuario auto-bloqueado por ${MAX_FAILED_ATTEMPTS} intentos fallidos`, ip, detail: `email: ${email}` })
          failedAttempts.delete(email)
        }
      }

      await createLog({ level: 'ERROR', module: 'Auth', action: `Login fallido — ${err.message}`, ip, detail: `email: ${email}` })
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