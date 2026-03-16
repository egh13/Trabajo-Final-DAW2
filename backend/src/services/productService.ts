import db from '../config/db'
import type { Product } from '../types'

const BASE_QUERY = `
  SELECT p.*, c.name AS category_name
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
`

export const getAllProducts = (categoryId?: number): Product[] => {
  if (categoryId) {
    return db.prepare(`${BASE_QUERY} WHERE p.category_id = ? ORDER BY p.name`).all(categoryId) as Product[]
  }
  return db.prepare(`${BASE_QUERY} ORDER BY p.name`).all() as Product[]
}

export const getProductById = (id: number): Product | undefined => {
  return db.prepare(`${BASE_QUERY} WHERE p.id = ?`).get(id) as Product | undefined
}

export const createProduct = (data: Omit<Product, 'id' | 'created_at' | 'category_name'>): Product => {
  const stmt = db.prepare(`
    INSERT INTO products (name, description, price, stock, image_url, category_id)
    VALUES (@name, @description, @price, @stock, @image_url, @category_id)
  `)
  const result = stmt.run(data)
  return getProductById(result.lastInsertRowid as number)!
}

export const updateProduct = (id: number, data: Partial<Omit<Product, 'id' | 'created_at' | 'category_name'>>): Product | undefined => {
  const existing = getProductById(id)
  if (!existing) return undefined

  const merged = { ...existing, ...data }
  db.prepare(`
    UPDATE products
    SET name = @name, description = @description, price = @price,
        stock = @stock, image_url = @image_url, category_id = @category_id
    WHERE id = @id
  `).run({ ...merged, id })

  return getProductById(id)
}

export const deleteProduct = (id: number): boolean => {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(id)
  return result.changes > 0
}
