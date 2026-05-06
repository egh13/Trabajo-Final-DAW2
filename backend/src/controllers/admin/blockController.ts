import type { Request, Response, NextFunction } from 'express'
import blockService from '../../services/admin/blockService'
import type { ApiResponse } from '../../types'

// Devuelve todos los bloqueos activos
export const getBlocks = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const blocks = await blockService.findAllActive()
    res.json({ success: true, data: blocks } as ApiResponse<typeof blocks>)
  } catch (error) {
    next(error)
  }
}

// Crea un bloqueo manual por IP o usuario
export const createBlock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const block = await blockService.createBlock(req.body)
    res.status(201).json({ success: true, data: block } as ApiResponse<typeof block>)
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ success: false, message: error.message } as ApiResponse<null>)
      return
    }
    next(error)
  }
}

// Elimina un bloqueo existente (desbloquear)
export const deleteBlock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id)
    const deleted = await blockService.removeBlock(id)
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Bloqueo no encontrado.' } as ApiResponse<null>)
      return
    }
    res.json({ success: true, message: 'Bloqueo eliminado.' } as ApiResponse<null>)
  } catch (error) {
    next(error)
  }
}
