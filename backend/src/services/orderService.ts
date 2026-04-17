import { prisma } from '../config/prisma'
import { getCartBySession, clearCart } from './cartService'

export const getOrdersBySession = async (sessionId: string) => {
  return await prisma.order.findMany({
    // Convertimos a número si tu DB usa IDs numéricos
    where: { userId: parseInt(sessionId) || 0 }, 
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  })
}

export const getOrderById = async (id: number) => {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })
}

export const createOrderFromCart = async (sessionId: string) => {
  const cartItems = await getCartBySession(sessionId)
  
  if (!cartItems || cartItems.length === 0) return null

  // Usamos los nombres de tu interfaz CartItem: product_price y quantity
  const total = cartItems.reduce((sum, item) => 
    sum + (item.product_price ?? 0) * item.quantity, 0
  )

  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId: parseInt(sessionId) || 0,
        total: total,
        status: 'pending',
        items: {
          create: cartItems.map((item) => ({
            productId: item.product_id, // Cambiado de productId a product_id
            quantity: item.quantity,
            price: item.product_price ?? 0, // Usamos product_price directamente
          })),
        },
      },
    })

    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.product_id }, // Cambiado de productId a product_id
        data: {
          stock: { decrement: item.quantity }
        }
      })
    }

    await clearCart(sessionId)
    return order
  })
}