import db from '../config/db'
import type { CartItem } from '../types'

const BASE_QUERY = `
  SELECT ci.*, p.name AS product_name, p.price AS product_price, p.image_url
  FROM cart_items ci
  JOIN products p ON ci.product_id = p.id
`

// Resuelve el carrito por user_id si está autenticado, si no por session_id
export const getCartBySession = (sessionId: string, userId?: number): CartItem[] => {
  if (userId) {
    return db.prepare(`${BASE_QUERY} WHERE ci.user_id = ?`).all(userId) as CartItem[]
  }
  return db.prepare(`${BASE_QUERY} WHERE ci.session_id = ? AND ci.user_id IS NULL`).all(sessionId) as CartItem[]
}

export const addToCart = (sessionId: string, productId: number, quantity: number, userId?: number): CartItem => {
  if (userId) {
    // Carrito vinculado al usuario autenticado
    db.prepare(`
      INSERT INTO cart_items (session_id, user_id, product_id, quantity)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(session_id, product_id) DO UPDATE SET quantity = quantity + excluded.quantity
    `).run(sessionId, userId, productId, quantity)
  } else {
    db.prepare(`
      INSERT INTO cart_items (session_id, user_id, product_id, quantity)
      VALUES (?, NULL, ?, ?)
      ON CONFLICT(session_id, product_id) DO UPDATE SET quantity = quantity + excluded.quantity
    `).run(sessionId, productId, quantity)
  }

  const where = userId
    ? `WHERE ci.user_id = ? AND ci.product_id = ?`
    : `WHERE ci.session_id = ? AND ci.user_id IS NULL AND ci.product_id = ?`

  const key = userId ?? sessionId
  return db.prepare(`${BASE_QUERY} ${where}`).get(key, productId) as CartItem
}

export const updateCartItem = (sessionId: string, productId: number, quantity: number, userId?: number): CartItem | undefined => {
  if (quantity <= 0) {
    removeFromCart(sessionId, productId, userId)
    return undefined
  }

  if (userId) {
    db.prepare('UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?').run(quantity, userId, productId)
    return db.prepare(`${BASE_QUERY} WHERE ci.user_id = ? AND ci.product_id = ?`).get(userId, productId) as CartItem
  }

  db.prepare('UPDATE cart_items SET quantity = ? WHERE session_id = ? AND user_id IS NULL AND product_id = ?').run(quantity, sessionId, productId)
  return db.prepare(`${BASE_QUERY} WHERE ci.session_id = ? AND ci.user_id IS NULL AND ci.product_id = ?`).get(sessionId, productId) as CartItem
}

export const removeFromCart = (sessionId: string, productId: number, userId?: number): boolean => {
  const result = userId
    ? db.prepare('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?').run(userId, productId)
    : db.prepare('DELETE FROM cart_items WHERE session_id = ? AND user_id IS NULL AND product_id = ?').run(sessionId, productId)
  return result.changes > 0
}

export const clearCart = (sessionId: string, userId?: number): void => {
  if (userId) {
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId)
  } else {
    db.prepare('DELETE FROM cart_items WHERE session_id = ? AND user_id IS NULL').run(sessionId)
  }
}

// Migra el carrito de sesión anónima al usuario recién autenticado
export const mergeSessionCartIntoUser = (sessionId: string, userId: number): void => {
  const sessionItems = db
    .prepare('SELECT product_id, quantity FROM cart_items WHERE session_id = ? AND user_id IS NULL')
    .all(sessionId) as { product_id: number; quantity: number }[]

  if (sessionItems.length === 0) return

  const insertOrUpdate = db.prepare(`
    INSERT INTO cart_items (session_id, user_id, product_id, quantity)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(session_id, product_id) DO UPDATE SET quantity = quantity + excluded.quantity
  `)

  const merge = db.transaction(() => {
    for (const item of sessionItems) {
      insertOrUpdate.run(sessionId, userId, item.product_id, item.quantity)
    }
    // Elimina los ítems anónimos de esa sesión
    db.prepare('DELETE FROM cart_items WHERE session_id = ? AND user_id IS NULL').run(sessionId)
  })

  merge()
}
