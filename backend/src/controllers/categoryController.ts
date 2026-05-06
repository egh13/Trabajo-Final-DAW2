import { Request, Response } from 'express'
import * as categoryService from '../services/categoryService'
import type { ApiResponse, Category } from '../types'

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  const data = await categoryService.getAllCategories()
  res.json({ success: true, data } as ApiResponse<Category[]>)
}

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const { name, description } = req.body as { name: string; description?: string }

  if (!name?.trim()) {
    res.status(400).json({ success: false, message: 'El nombre es obligatorio' } as ApiResponse<null>)
    return
  }

  try {
    const data = await categoryService.createCategory(name.trim(), description ?? null)
    res.status(201).json({ success: true, data } as ApiResponse<Category>)
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ success: false, message: 'Ya existe una categoría con ese nombre' } as ApiResponse<null>)
      return
    }
    res.status(500).json({ success: false, message: 'Error interno del servidor' } as ApiResponse<null>)
  }
}

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id)
  const data = await categoryService.getCategoryById(id)

  if (!data) {
    res.status(404).json({ success: false, message: 'Categoría no encontrada' } as ApiResponse<null>)
    return
  }

  res.json({ success: true, data } as ApiResponse<Category>)
}

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id)
  const { name, description } = req.body as { name: string; description?: string }

  if (!name?.trim()) {
    res.status(400).json({ success: false, message: 'El nombre es obligatorio' } as ApiResponse<null>)
    return
  }

  try {
    const data = await categoryService.updateCategory(id, name.trim(), description ?? null)
    res.json({ success: true, data } as ApiResponse<Category>)
  } catch (error) {
    res.status(404).json({ success: false, message: 'Categoría no encontrada' } as ApiResponse<null>)
  }
}

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id)

  try {
    await categoryService.deleteCategory(id)
    res.json({ success: true, message: 'Categoría eliminada correctamente' } as ApiResponse<null>)
  } catch (error) {
    res.status(404).json({ success: false, message: 'Categoría no encontrada' } as ApiResponse<null>)
  }
}
