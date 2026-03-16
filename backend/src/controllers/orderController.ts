import { Request, Response } from 'express'
import * as orderService from '../services/orderService'
import type { ApiResponse, Order } from '../types'

export const getOrders = (req: Request, res: Response): void => {
  const sessionId = req.headers['x-session-id'] as string

  if (!sessionId) {
    res.status(400).json({ success: false, message: 'Se requiere x-session-id en los headers' } as ApiResponse<null>)
    return
  }

  const data = orderService.getOrdersBySession(sessionId)
  res.json({ success: true, data } as ApiResponse<Order[]>)
}

export const getOrderById = (req: Request, res: Response): void => {
  const id = Number(req.params.id)
  const data = orderService.getOrderById(id)

  if (!data) {
    res.status(404).json({ success: false, message: 'Orden no encontrada' } as ApiResponse<null>)
    return
  }

  res.json({ success: true, data } as ApiResponse<typeof data>)
}

export const createOrder = (req: Request, res: Response): void => {
  const sessionId = req.headers['x-session-id'] as string

  if (!sessionId) {
    res.status(400).json({ success: false, message: 'Se requiere x-session-id en los headers' } as ApiResponse<null>)
    return
  }

  const data = orderService.createOrderFromCart(sessionId)

  if (!data) {
    res.status(400).json({ success: false, message: 'El carrito está vacío' } as ApiResponse<null>)
    return
  }

  res.status(201).json({ success: true, data } as ApiResponse<Order>)
}
