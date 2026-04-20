import { prisma } from '../config/prisma'
import type { CartItem } from '../types'

// Resuelve el carrito por user_id si está autenticado, si no por session_id
export const getCartBySession = async (sessionId: string, userId?: number): Promise<CartItem[]> => {
  const where = userId
    ? { userId }
    : { sessionId, userId: null }

  const cartItems = await prisma.cartItem.findMany({
    where,
    include: { product: true }
  })

  return cartItems.map(item => ({
    id: item.id,
    session_id: item.sessionId,
    user_id: item.userId,
    product_id: item.productId,
    quantity: item.quantity,
    product_name: item.product.name,
    product_price: item.product.price,
    image_url: item.product.image
  }))
}

export const addToCart = async (sessionId: string, productId: number, quantity: number, userId?: number): Promise<CartItem> => {
  const data = userId
    ? { sessionId, userId, productId, quantity }
    : { sessionId, productId, quantity }

  const cartItem = await prisma.cartItem.upsert({
    where: { sessionId_productId: { sessionId, productId } },
    update: { quantity: { increment: quantity } },
    create: data,
    include: { product: true }
  })

  return {
    id: cartItem.id,
    session_id: cartItem.sessionId,
    user_id: cartItem.userId,
    product_id: cartItem.productId,
    quantity: cartItem.quantity,
    product_name: cartItem.product.name,
    product_price: cartItem.product.price,
    image_url: cartItem.product.image
  }
}

export const updateCartItem = async (sessionId: string, productId: number, quantity: number, userId?: number): Promise<CartItem | undefined> => {
  if (quantity <= 0) {
    await removeFromCart(sessionId, productId, userId)
    return undefined
  }

  try {
    const cartItem = await prisma.cartItem.update({
      where: { sessionId_productId: { sessionId, productId } },
      data: { quantity },
      include: { product: true }
    })

    return {
      id: cartItem.id,
      session_id: cartItem.sessionId,
      user_id: cartItem.userId,
      product_id: cartItem.productId,
      quantity: cartItem.quantity,
      product_name: cartItem.product.name,
      product_price: cartItem.product.price,
      image_url: cartItem.product.image
    }
  } catch {
    return undefined
  }
}

export const removeFromCart = async (sessionId: string, productId: number, userId?: number): Promise<boolean> => {
  try {
    await prisma.cartItem.delete({
      where: { sessionId_productId: { sessionId, productId } }
    })
    return true
  } catch {
    return false
  }
}

export const clearCart = async (sessionId: string, userId?: number): Promise<void> => {
  const where = userId
    ? { userId }
    : { sessionId, userId: null }

  await prisma.cartItem.deleteMany({ where })
}

// Migra el carrito de sesión anónima al usuario recién autenticado
export const mergeSessionCartIntoUser = async (sessionId: string, userId: number): Promise<void> => {
  const sessionItems = await prisma.cartItem.findMany({
    where: { sessionId, userId: null }
  })

  for (const item of sessionItems) {
    await prisma.cartItem.upsert({
      where: { sessionId_productId: { sessionId: `user_${userId}`, productId: item.productId } },
      update: { quantity: { increment: item.quantity }, userId },
      create: { sessionId: `user_${userId}`, userId, productId: item.productId, quantity: item.quantity }
    })
  }

  await prisma.cartItem.deleteMany({ where: { sessionId, userId: null } })
}
