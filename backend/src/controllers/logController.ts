import type { Request, Response, NextFunction } from 'express'
import * as logService from '../services/logService'
import type { ApiResponse, PaginatedLogs, UserLogFilters, LogLevel } from '../types'

// Devuelve el listado paginado de logs de auditoría con filtros opcionales
export const getLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filters: UserLogFilters = {
      search: req.query.search as string | undefined,
      level: req.query.level as LogLevel | undefined,
      module: req.query.module as string | undefined,
      from: req.query.from as string | undefined,
      to: req.query.to as string | undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
    }

    const result = await logService.getLogs(filters)
    res.json({ success: true, data: result } as ApiResponse<PaginatedLogs>)
  } catch (error) {
    next(error)
  }
}
