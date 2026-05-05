import type { Request, Response, NextFunction } from 'express'
import * as statsService from '../../services/admin/statsService'
import type { ApiResponse } from '../../types'

// Devuelve estadísticas de autenticación calculadas desde los logs
export const getAuthStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await statsService.getAuthStats()
    res.json({ success: true, data: stats } as ApiResponse<typeof stats>)
  } catch (error) {
    next(error)
  }
}

// Devuelve estadísticas generales del sistema (conteos, distribuciones)
export const getSystemStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await statsService.getSystemStats()
    res.json({ success: true, data: stats } as ApiResponse<typeof stats>)
  } catch (error) {
    next(error)
  }
}