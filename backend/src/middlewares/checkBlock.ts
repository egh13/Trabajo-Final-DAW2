import type { Request, Response, NextFunction } from 'express'
import blockService from '../services/admin/blockService'
import { getClientIp } from '../utils/getClientIp'
import type { ApiResponse } from '../types'

// Rechaza la petición si la IP o el usuario (por email) están bloqueados
export const checkBlock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const ip = getClientIp(req)
  const userId = req.user?.userId
  const email = (req.body?.email as string | undefined) ?? req.user?.email

  const result = await blockService.isBlocked(ip, userId, email)

  if (result.blocked) {
    res.status(403).json({
      success: false,
      message: `Acceso bloqueado: ${result.reason}`,
    } as ApiResponse<null>)
    return
  }

  next()
}
