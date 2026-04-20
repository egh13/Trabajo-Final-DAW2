import { Request, Response } from 'express'
import * as cartService from '../services/cartService'
import type { ApiResponse, CartItem } from '../types'

// Obtiene sessionId del header y userId del token JWT si está autenticado
const resolveSession = (req: Request): { sessionId: string; userId?: number } => {
  const sessionId = req.headers['x-session-id'] as string
  const userId = req.user?.userId
  return { sessionId, userId }
}

export const getCart = async (req: Request, res: Response): Promise<void> => {
  const { sessionId, userId } = resolveSession(req)

  if (!sessionId) {
    res.status(400).json({ success: false, message: 'Se requiere x-session-id en los headers' } as ApiResponse<null>)
    return
  }

  const data = await cartService.getCartBySession(sessionId, userId)
  res.json({ success: true, data } as ApiResponse<CartItem[]>)
}

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  const { sessionId, userId } = resolveSession(req)
  const { product_id, quantity } = req.body as { product_id: number; quantity: number }

  if (!sessionId) {
    res.status(400).json({ success: false, message: 'Se requiere x-session-id en los headers' } as ApiResponse<null>)
    return
  }

  if (!product_id || !quantity || quantity < 1) {
    res.status(400).json({ success: false, message: 'product_id y quantity son obligatorios' } as ApiResponse<null>)
    return
  }

  const data = await cartService.addToCart(sessionId, product_id, quantity, userId)
  res.status(201).json({ success: true, data } as ApiResponse<CartItem>)
}

export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
  const { sessionId, userId } = resolveSession(req)
  const productId = Number(req.params.productId)
  const { quantity } = req.body as { quantity: number }

  if (!sessionId) {
    res.status(400).json({ success: false, message: 'Se requiere x-session-id en los headers' } as ApiResponse<null>)
    return
  }

  const data = await cartService.updateCartItem(sessionId, productId, quantity, userId)
  res.json({ success: true, data: data ?? null } as ApiResponse<CartItem | null>)
}

export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
  const { sessionId, userId } = resolveSession(req)
  const productId = Number(req.params.productId)

  if (!sessionId) {
    res.status(400).json({ success: false, message: 'Se requiere x-session-id en los headers' } as ApiResponse<null>)
    return
  }

  const removed = await cartService.removeFromCart(sessionId, productId, userId)

  if (!removed) {
    res.status(404).json({ success: false, message: 'Producto no encontrado en el carrito' } as ApiResponse<null>)
    return
  }

  res.json({ success: true, message: 'Producto eliminado del carrito' } as ApiResponse<null>)
}

export const clearCart = async (req: Request, res: Response): Promise<void> => {
  const { sessionId, userId } = resolveSession(req)

  if (!sessionId) {
    res.status(400).json({ success: false, message: 'Se requiere x-session-id en los headers' } as ApiResponse<null>)
    return
  }

  await cartService.clearCart(sessionId, userId)
  res.json({ success: true, message: 'Carrito vaciado correctamente' } as ApiResponse<null>)
}
