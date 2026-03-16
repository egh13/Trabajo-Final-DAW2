import { Request, Response, NextFunction } from 'express'
import type { ApiResponse } from '../types'

// Manejador global para errores
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(`[Error] ${err.message}`)

  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    errors: process.env.NODE_ENV === 'development' ? err.message : null,
  } as ApiResponse<null>)
}

// Rutas no encontradas
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  } as ApiResponse<null>)
}
