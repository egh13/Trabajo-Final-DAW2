import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { jwtConfig } from '../config/jwt'
import { createLog } from '../services/admin/logService'
import { getClientIp } from '../utils/getClientIp'
import type { JwtPayload, UserRole, ApiResponse } from '../types'

// Extiende Request para incluir el usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

// Verifica que el token JWT sea válido
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    await createLog({ level: 'WARNING', module: 'Auth', action: `Acceso sin token a ${req.originalUrl}`, ip: getClientIp(req) })
    res.status(401).json({
      success: false,
      message: 'No autorizado. Token no proporcionado.',
    } as ApiResponse<null>)
    return
  }

  const token = header.split(' ')[1]

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as JwtPayload
    req.user = decoded
    next()
  } catch {
    await createLog({ level: 'WARNING', module: 'Auth', action: `Token inválido o expirado en ${req.originalUrl}`, ip: getClientIp(req) })
    res.status(401).json({
      success: false,
      message: 'Token inválido o expirado.',
    } as ApiResponse<null>)
  }
}

// Igual que authenticate pero no rechaza si no hay token (para rutas mixtas como el carrito)
export const optionalAuthenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    next()
    return
  }

  const token = header.split(' ')[1]
  try {
    req.user = jwt.verify(token, jwtConfig.secret) as JwtPayload
  } catch {
    // Token inválido → se ignora, el usuario sigue como anónimo
  }
  next()
}


// Verifica que el usuario tenga uno de los roles permitidos
export const authorize = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autorizado.',
      } as ApiResponse<null>)
      return
    }

    if (!roles.includes(req.user.role)) {
      await createLog({ level: 'WARNING', module: 'Auth', action: `Acceso denegado a ${req.originalUrl} — rol insuficiente`, userId: req.user.userId, ip: getClientIp(req), detail: `rol: ${req.user.role}, requerido: ${roles.join(', ')}` })
      res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso.',
      } as ApiResponse<null>)
      return
    }

    next()
  }
}
