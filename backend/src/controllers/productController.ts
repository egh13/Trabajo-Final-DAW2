import { Request, Response } from 'express'
import * as productService from '../services/productService'
import type { ApiResponse, Product } from '../types'

export const getProducts = (req: Request, res: Response): void => {
  const categoryId = req.query.category ? Number(req.query.category) : undefined
  const data = productService.getAllProducts(categoryId)
  res.json({ success: true, data } as ApiResponse<Product[]>)
}

export const getProductById = (req: Request, res: Response): void => {
  const id = Number(req.params.id)
  const data = productService.getProductById(id)

  if (!data) {
    res.status(404).json({ success: false, message: 'Producto no encontrado' } as ApiResponse<null>)
    return
  }

  res.json({ success: true, data } as ApiResponse<Product>)
}

export const createProduct = (req: Request, res: Response): void => {
  const { name, description, price, stock, image_url, category_id } = req.body as Partial<Product>

  if (!name?.trim() || price === undefined || !category_id) {
    res.status(400).json({ success: false, message: 'Faltan campos obligatorios: name, price, category_id' } as ApiResponse<null>)
    return
  }

  const data = productService.createProduct({
    name: name.trim(),
    description: description ?? null,
    price,
    stock: stock ?? 0,
    image_url: image_url ?? null,
    category_id,
  })

  res.status(201).json({ success: true, data } as ApiResponse<Product>)
}

export const updateProduct = (req: Request, res: Response): void => {
  const id = Number(req.params.id)
  const data = productService.updateProduct(id, req.body as Partial<Product>)

  if (!data) {
    res.status(404).json({ success: false, message: 'Producto no encontrado' } as ApiResponse<null>)
    return
  }

  res.json({ success: true, data } as ApiResponse<Product>)
}

export const deleteProduct = (req: Request, res: Response): void => {
  const id = Number(req.params.id)
  const deleted = productService.deleteProduct(id)

  if (!deleted) {
    res.status(404).json({ success: false, message: 'Producto no encontrado' } as ApiResponse<null>)
    return
  }

  res.json({ success: true, message: 'Producto eliminado correctamente' } as ApiResponse<null>)
}
