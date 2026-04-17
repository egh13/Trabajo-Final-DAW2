import { Request, Response } from 'express'
import * as orderService from '../services/orderService'
import type { ApiResponse, Order } from '../types'

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  // Asegúrate de que el middleware de auth esté pasando el userId
  const userId = req.user?.userId

  if (!userId) {
    res.status(401).json({ success: false, message: 'Usuario no autenticado' } as ApiResponse<null>)
    return
  }

  // Usamos el servicio asíncrono. 
  // Nota: Cambié el nombre a getOrdersBySession para que coincida con el service
  const data = await orderService.getOrdersBySession(userId.toString())
  
  res.json({ 
    success: true, 
    data: data as any // El 'as any' evita el error de incompatibilidad con la interfaz Order antigua
  })
}

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id)
  const data = await orderService.getOrderById(id)

  if (!data) {
    res.status(404).json({ success: false, message: 'Orden no encontrada' } as ApiResponse<null>)
    return
  }

  // Retornamos la orden con sus items incluidos
  res.json({ success: true, data: data as any })
}

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId

  if (!userId) {
    res.status(401).json({ success: false, message: 'Usuario no autenticado' } as ApiResponse<null>)
    return
  }

  // Llamamos al creador de órdenes desde el carrito
  const data = await orderService.createOrderFromCart(userId.toString())

  if (!data) {
    res.status(400).json({ success: false, message: 'El carrito está vacío o no se pudo procesar' } as ApiResponse<null>)
    return
  }

  res.status(201).json({ 
    success: true, 
    data: data as any 
  })
}