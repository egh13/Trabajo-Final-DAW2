import { Request, Response } from 'express'
import * as categoryService from '../services/categoryService'
import type { ApiResponse, Category } from '../types'

export const getCategories = (req: Request, res: Response): void => {
  const data = categoryService.getAllCategories()
  res.json({ success: true, data } as ApiResponse<Category[]>)
}

export const getCategoryById = (req: Request, res: Response): void => {
  const id = Number(req.params.id)
  const data = categoryService.getCategoryById(id)

  if (!data) {
    res.status(404).json({ success: false, message: 'Categoría no encontrada' } as ApiResponse<null>)
    return
  }

  res.json({ success: true, data } as ApiResponse<Category>)
}

export const createCategory = (req: Request, res: Response): void => {
  const { name, description } = req.body as { name: string; description?: string }

  if (!name?.trim()) {
    res.status(400).json({ success: false, message: 'El nombre es obligatorio' } as ApiResponse<null>)
    return
  }

  try {
    const data = categoryService.createCategory(name.trim(), description ?? null)
    res.status(201).json({ success: true, data } as ApiResponse<Category>)
  } catch (error) {
    res.status(409).json({ success: false, message: 'La categoría ya existe' } as ApiResponse<null>)
  }
}
