import { Request, Response } from 'express'
import * as orderService from '../services/orderService'
import { createLog, getClientIp } from '../services/logService'
import type { ApiResponse, Order } from '../types'

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId

  if (!userId) {
    res.status(401).json({ success: false, message: 'Usuario no autenticado' } as ApiResponse<null>)
    return
  }

  const data = await orderService.getOrdersByUser(userId)
  res.json({ success: true, data } as ApiResponse<Order[]>)
}

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id)
  const data = await orderService.getOrderById(id)

  if (!data) {
    res.status(404).json({ success: false, message: 'Orden no encontrada' } as ApiResponse<null>)
    return
  }

  res.json({ success: true, data } as ApiResponse<Order>)
}

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId

  if (!userId) {
    res.status(401).json({ success: false, message: 'Usuario no autenticado' } as ApiResponse<null>)
    return
  }
  const data = await orderService.createOrderFromCart(userId)

  if (!data) {
    res.status(400).json({ success: false, message: 'El carrito está vacío o no se pudo procesar' } as ApiResponse<null>)
    return
  }

  await createLog({ level: 'INFO', module: 'Pedidos', action: `Nuevo pedido #${data.id} creado`, userId, ip: getClientIp(req) })

  res.status(201).json({ success: true, data } as ApiResponse<Order>)
}