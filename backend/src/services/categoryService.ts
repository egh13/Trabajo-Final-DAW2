import { prisma } from '../config/prisma'
import type { Category } from '../types'

export const getAllCategories = async (): Promise<Category[]> => {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  return categories.map((c: (typeof categories)[0]) => ({ id: c.id, name: c.name, description: c.description, createdAt: new Date().toISOString() }))
}

export const getCategoryById = async (id: number): Promise<Category | undefined> => {
  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) return undefined
  return { id: category.id, name: category.name, description: category.description, createdAt: new Date().toISOString() }
}

export const createCategory = async (name: string, description: string | null): Promise<Category> => {
  const category = await prisma.category.create({ data: { name, description } })
  return { id: category.id, name: category.name, description: category.description, createdAt: new Date().toISOString() }
}
