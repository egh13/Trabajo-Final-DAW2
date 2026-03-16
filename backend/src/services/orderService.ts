import db from '../config/db'
import { getCartBySession, clearCart } from './cartService'
import type { Order, OrderItem } from '../types'

export const getOrdersBySession = (sessionId: string): Order[] => {
  return db.prepare('SELECT * FROM orders WHERE session_id = ? ORDER BY created_at DESC').all(sessionId) as Order[]
}

export const getOrderById = (id: number): { order: Order; items: OrderItem[] } | undefined => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as Order | undefined
  if (!order) return undefined

  const items = db.prepare(`
    SELECT oi.*, p.name AS product_name
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `).all(id) as OrderItem[]

  return { order, items }
}

export const createOrderFromCart = (sessionId: string): Order | null => {
  const cartItems = getCartBySession(sessionId)
  if (cartItems.length === 0) return null

  const total = cartItems.reduce((sum, item) => sum + (item.product_price ?? 0) * item.quantity, 0)

  // Transacción para garantizar consistencia
  const createOrder = db.transaction(() => {
    const orderResult = db.prepare(
      'INSERT INTO orders (session_id, total) VALUES (?, ?)'
    ).run(sessionId, total)

    const orderId = orderResult.lastInsertRowid as number

    const insertItem = db.prepare(
      'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)'
    )

    for (const item of cartItems) {
      insertItem.run(orderId, item.product_id, item.quantity, item.product_price ?? 0)
      // Reducir el stock del producto
      db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(item.quantity, item.product_id)
    }

    clearCart(sessionId)

    return db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as Order
  })

  return createOrder()
}
