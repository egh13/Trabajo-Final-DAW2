import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { jwtConfig } from '../config/jwt'
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
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
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
    res.status(401).json({
      success: false,
      message: 'Token inválido o expirado.',
    } as ApiResponse<null>)
  }
}

// Verifica que el usuario tenga uno de los roles permitidos
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autorizado.',
      } as ApiResponse<null>)
      return
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso.',
      } as ApiResponse<null>)
      return
    }

    next()
  }
}
