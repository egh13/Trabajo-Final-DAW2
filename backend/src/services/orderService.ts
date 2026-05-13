import { prisma } from '../config/prisma'
import type { Prisma } from '@prisma/client'
import { getCartBySession } from './cartService'

export const getOrdersByUser = async (userId: number) => {
  return await prisma.order.findMany({
    where: { userId },
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

export const createOrderFromCart = async (userId: number) => {
  const cartItems = await getCartBySession('', userId)

  if (!cartItems || cartItems.length === 0) return null

  const total = cartItems.reduce((sum, item) =>
    sum + (item.product_price ?? 0) * item.quantity, 0
  )
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    
    // Verifica que todos los productos tienen stock suficiente antes de procesar
    for (const item of cartItems) {
      const product = await tx.product.findUnique({ where: { id: item.product_id } })
      if (!product || product.stock < item.quantity) {
        const err = new Error(`Stock insuficiente para "${product?.name ?? `producto #${item.product_id}`}"`)
        Object.assign(err, { statusCode: 409 })
        throw err
      }
    }

    const order = await tx.order.create({
      data: {
        userId,
        total,
        status: 'pending',
        items: {
          create: cartItems.map((item) => ({
            productId: item.product_id,
            quantity: item.quantity,
            price: item.product_price ?? 0,
          })),
        },
      },
    })

    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.product_id },
        data: {
          stock: { decrement: item.quantity }
        }
      })
    }

    await tx.cartItem.deleteMany({ where: { userId } })

    return await tx.order.findUnique({
      where: { id: order.id },
      include: { items: { include: { product: true } } }
    })
  })
}