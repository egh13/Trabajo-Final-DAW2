import { prisma } from '../config/prisma'
import type { Category } from '../types'

export const getAllCategories = async (): Promise<Category[]> => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } }
  })

  return categories.map((c: (typeof categories)[0]) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    createdAt: new Date().toISOString(),
    productCount: c._count?.products ?? 0
  }))
}

export const getCategoryById = async (id: number): Promise<Category | undefined> => {
  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) return undefined
  return { id: category.id, name: category.name, description: category.description, createdAt: new Date().toISOString() }
}

export const createCategory = async (name: string, description: string | null): Promise<Category> => {
  const category = await prisma.category.create({
    data: { name, description }
  })
  return { id: category.id, name: category.name, description: category.description, createdAt: new Date().toISOString() }
}

export const updateCategory = async (id: number, name: string, description: string | null): Promise<Category> => {
  const category = await prisma.category.update({
    where: { id },
    data: { name, description }
  })
  return { id: category.id, name: category.name, description: category.description, createdAt: new Date().toISOString() }
}

export const deleteCategory = async (id: number): Promise<void> => {
  // Elimina todos los productos asociados a la categoría antes de eliminar la categoría
  await prisma.product.deleteMany({ where: { categoryId: id } })
  await prisma.category.delete({ where: { id } })
}
