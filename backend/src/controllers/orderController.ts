import { Request, Response } from 'express'
import PDFDocument from 'pdfkit'
import jwt from 'jsonwebtoken'
import * as orderService from '../services/orderService'
import { createLog } from '../services/admin/logService'
import { getClientIp } from '../utils/getClientIp'
import { jwtConfig } from '../config/jwt'
import type { ApiResponse, Order, JwtPayload } from '../types'

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId

  if (!userId) {
    res.status(401).json({ success: false, message: 'Usuario no autenticado' } as ApiResponse<null>)
    return
  }

  const data = await orderService.getOrdersByUser(userId)
  res.json({ success: true, data } as ApiResponse<Order[]>)
}

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id)
  const data = await orderService.getOrderById(id)

  if (!data) {
    res.status(404).json({ success: false, message: 'Orden no encontrada' } as ApiResponse<null>)
    return
  }

  res.json({ success: true, data } as ApiResponse<Order>)
}

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId

  if (!userId) {
    res.status(401).json({ success: false, message: 'Usuario no autenticado' } as ApiResponse<null>)
    return
  }
  const data = await orderService.createOrderFromCart(userId)

  if (!data) {
    res.status(400).json({ success: false, message: 'El carrito está vacío o no se pudo procesar' } as ApiResponse<null>)
    return
  }

  await createLog({ level: 'INFO', module: 'Pedidos', action: `Nuevo pedido #${data.id} creado`, userId, ip: getClientIp(req) })

  res.status(201).json({ success: true, data } as ApiResponse<Order>)
}

export const getInvoicePdf = async (req: Request, res: Response): Promise<void> => {
  // Authenticate via query param (the PDF is opened directly in a new tab)
  const token = req.query.token as string | undefined
  if (!token) {
    res.status(401).json({ success: false, message: 'Token no proporcionado' } as ApiResponse<null>)
    return
  }

  let userId: number
  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as JwtPayload
    userId = decoded.userId
  } catch {
    res.status(401).json({ success: false, message: 'Token inválido o expirado' } as ApiResponse<null>)
    return
  }

  const orderId = Number(req.params.id)

  const order = await orderService.getOrderById(orderId)

  if (!order || order.userId !== userId) {
    res.status(404).json({ success: false, message: 'Pedido no encontrado' } as ApiResponse<null>)
    return
  }

  const doc = new PDFDocument({ size: 'A4', margin: 50 })

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `inline; filename=factura-${order.id}.pdf`)
  doc.pipe(res)

  // --- Header ---
  doc.fontSize(22).font('Helvetica-Bold').text('Secure Tenis', { align: 'center' })
  doc.moveDown(0.3)
  doc.fontSize(10).font('Helvetica').fillColor('#666')
    .text('Tu tienda de confianza', { align: 'center' })
  doc.moveDown(1.5)

  // --- Invoice info ---
  doc.fillColor('#000').fontSize(12).font('Helvetica-Bold')
    .text(`Factura #${order.id}`)
  doc.fontSize(10).font('Helvetica')
    .text(`Fecha: ${new Date(order.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`)
    .text(`Estado: ${order.status}`)
  doc.moveDown(1.5)

  // --- Table header ---
  const tableTop = doc.y
  const col = { name: 50, qty: 320, price: 400, total: 480 }

  doc.fontSize(10).font('Helvetica-Bold').fillColor('#333')
  doc.text('Producto', col.name, tableTop)
  doc.text('Cant.', col.qty, tableTop, { width: 60, align: 'right' })
  doc.text('Precio', col.price, tableTop, { width: 70, align: 'right' })
  doc.text('Subtotal', col.total, tableTop, { width: 70, align: 'right' })

  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).strokeColor('#ccc').stroke()

  // --- Table rows ---
  let y = tableTop + 25
  doc.font('Helvetica').fillColor('#000')

  for (const item of order.items) {
    const name = item.product?.name ?? `Producto #${item.productId}`
    const subtotal = item.price * item.quantity

    doc.text(name, col.name, y, { width: 260 })
    doc.text(String(item.quantity), col.qty, y, { width: 60, align: 'right' })
    doc.text(`$${item.price.toFixed(2)}`, col.price, y, { width: 70, align: 'right' })
    doc.text(`$${subtotal.toFixed(2)}`, col.total, y, { width: 70, align: 'right' })
    y += 20
  }

  // --- Total ---
  doc.moveTo(50, y + 5).lineTo(550, y + 5).strokeColor('#ccc').stroke()
  y += 15
  doc.fontSize(12).font('Helvetica-Bold')
    .text(`Total: $${order.total.toFixed(2)}`, col.total - 80, y, { width: 150, align: 'right' })

  doc.moveDown(3)
  doc.fontSize(9).font('Helvetica').fillColor('#999')
    .text('Gracias por tu compra en Secure Tenis.', 50, undefined, { align: 'center' })

  doc.end()
}