import db from '../config/db'
import type { Category } from '../types'

export const getAllCategories = (): Category[] => {
  return db.prepare('SELECT * FROM categories ORDER BY name').all() as Category[]
}

export const getCategoryById = (id: number): Category | undefined => {
  return db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as Category | undefined
}

export const createCategory = (name: string, description: string | null): Category => {
  const stmt = db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)')
  const result = stmt.run(name, description)
  return getCategoryById(result.lastInsertRowid as number)!
}
