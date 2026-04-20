import { prisma } from '../config/prisma'
import type { Product } from '../types'

const getAllProducts = async (categoryId?: number): Promise<Product[]> => {
  const where = categoryId ? { categoryId } : {}
  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { name: 'asc' }
  })
  return products.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    image_url: product.image,
    category_id: product.categoryId,
    category_name: product.category.name,
    created_at: product.createdAt.toISOString()
  }))
}

const getProductById = async (id: number): Promise<Product | undefined> => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  })
  if (!product) return undefined
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    image_url: product.image,
    category_id: product.categoryId,
    category_name: product.category.name,
    created_at: product.createdAt.toISOString()
  }
}

const createProduct = async (data: Omit<Product, 'id' | 'created_at' | 'category_name'>): Promise<Product> => {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      image: data.image_url,
      categoryId: data.category_id
    },
    include: { category: true }
  })
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    image_url: product.image,
    category_id: product.categoryId,
    category_name: product.category.name,
    created_at: product.createdAt.toISOString()
  }
}

const updateProduct = async (id: number, data: Partial<Omit<Product, 'id' | 'created_at' | 'category_name'>>): Promise<Product | undefined> => {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        image: data.image_url,
        categoryId: data.category_id
      },
      include: { category: true }
    })
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image_url: product.image,
      category_id: product.categoryId,
      category_name: product.category.name,
      created_at: product.createdAt.toISOString()
    }
  } catch {
    return undefined
  }
}

const deleteProduct = async (id: number): Promise<boolean> => {
  try {
    await prisma.product.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct }
