import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import type { ApiResponse } from '../types'

// Middleware genérico de validación con Zod
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.issues.map((issue: { message: string }) => issue.message)
        res.status(400).json({
          success: false,
          message: 'Error de validación',
          errors: messages,
        } as ApiResponse<null>)
        return
      }
      next(err)
    }
  }
}
