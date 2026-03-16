import { Request, Response } from 'express'
import * as cartService from '../services/cartService'
import type { ApiResponse, CartItem } from '../types'

// Obtiene session_id del header y user_id del token JWT si está autenticado
const resolveSession = (req: Request): { sessionId: string; userId?: number } => {
  const sessionId = req.headers['x-session-id'] as string
  const userId = req.user?.userId
  return { sessionId, userId }
}

export const getCart = (req: Request, res: Response): void => {
  const { sessionId, userId } = resolveSession(req)

  if (!sessionId) {
    res.status(400).json({ success: false, message: 'Se requiere x-session-id en los headers' } as ApiResponse<null>)
    return
  }

  const data = cartService.getCartBySession(sessionId, userId)
  res.json({ success: true, data } as ApiResponse<CartItem[]>)
}

export const addToCart = (req: Request, res: Response): void => {
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

  const data = cartService.addToCart(sessionId, product_id, quantity, userId)
  res.status(201).json({ success: true, data } as ApiResponse<CartItem>)
}

export const updateCartItem = (req: Request, res: Response): void => {
  const { sessionId, userId } = resolveSession(req)
  const productId = Number(req.params.productId)
  const { quantity } = req.body as { quantity: number }

  if (!sessionId) {
    res.status(400).json({ success: false, message: 'Se requiere x-session-id en los headers' } as ApiResponse<null>)
    return
  }

  const data = cartService.updateCartItem(sessionId, productId, quantity, userId)
  res.json({ success: true, data: data ?? null } as ApiResponse<CartItem | null>)
}

export const removeFromCart = (req: Request, res: Response): void => {
  const { sessionId, userId } = resolveSession(req)
  const productId = Number(req.params.productId)

  if (!sessionId) {
    res.status(400).json({ success: false, message: 'Se requiere x-session-id en los headers' } as ApiResponse<null>)
    return
  }

  const removed = cartService.removeFromCart(sessionId, productId, userId)

  if (!removed) {
    res.status(404).json({ success: false, message: 'Producto no encontrado en el carrito' } as ApiResponse<null>)
    return
  }

  res.json({ success: true, message: 'Producto eliminado del carrito' } as ApiResponse<null>)
}

export const clearCart = (req: Request, res: Response): void => {
  const { sessionId, userId } = resolveSession(req)

  if (!sessionId) {
    res.status(400).json({ success: false, message: 'Se requiere x-session-id en los headers' } as ApiResponse<null>)
    return
  }

  cartService.clearCart(sessionId, userId)
  res.json({ success: true, message: 'Carrito vaciado correctamente' } as ApiResponse<null>)
}
