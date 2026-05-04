import type { Request, Response, NextFunction } from 'express'
import userService from '../services/userService'
import { createLog, getClientIp } from '../services/logService'
import type { ApiResponse, UserPublic } from '../types'

// Devuelve la lista completa de usuarios
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await userService.findAll()
    res.status(200).json({ success: true, data: users } as ApiResponse<UserPublic[]>)
  } catch (err) {
    next(err)
  }
}

// Crea un nuevo usuario desde el panel de administración
export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role } = req.body

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      res.status(400).json({ success: false, message: 'Faltan campos obligatorios: name, email, password.' } as ApiResponse<null>)
      return
    }    const user = await userService.createUser({ name, email, password, role })

    await createLog({ level: 'INFO', module: 'Usuarios', action: `Usuario creado: ${user.email}`, userId: req.user?.userId, ip: getClientIp(req) })

    res.status(201).json({ success: true, data: user } as ApiResponse<UserPublic>)
  } catch (err: any) {
    if (err.statusCode) {
      res.status(err.statusCode).json({ success: false, message: err.message } as ApiResponse<null>)
      return
    }
    next(err)
  }
}

// Actualiza los datos de un usuario existente
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = Number(req.params.id)
    const { name, email, password, role } = req.body
    const user = await userService.updateUser(userId, { name, email, password, role })

    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado.' } as ApiResponse<null>)
      return
    }

    await createLog({ level: 'INFO', module: 'Usuarios', action: `Usuario actualizado: ${user.email}`, userId: req.user?.userId, ip: getClientIp(req) })

    res.status(200).json({ success: true, data: user } as ApiResponse<UserPublic>)
  } catch (err: any) {
    if (err.statusCode) {
      res.status(err.statusCode).json({ success: false, message: err.message } as ApiResponse<null>)
      return
    }
    next(err)
  }
}

// Elimina un usuario por su ID
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = Number(req.params.id)
    const deleted = await userService.deleteUser(userId)
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado.' } as ApiResponse<null>)
      return
    }

    await createLog({ level: 'INFO', module: 'Usuarios', action: `Usuario eliminado: ID ${userId}`, userId: req.user?.userId, ip: getClientIp(req) })

    res.status(200).json({ success: true, message: 'Usuario eliminado correctamente.' } as ApiResponse<null>)
  } catch (err) {
    next(err)
  }
}
