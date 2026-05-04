import type { Request, Response, NextFunction } from 'express'
import PDFDocument from 'pdfkit'
import * as logService from '../services/logService'
import type { ApiResponse, PaginatedLogs, UserLogFilters, LogLevel } from '../types'

// Extrae los filtros de la query string de la petición
const extractFilters = (req: Request): UserLogFilters => ({
  search: req.query.search as string | undefined,
  level: req.query.level as LogLevel | undefined,
  module: req.query.module as string | undefined,
  from: req.query.from as string | undefined,
  to: req.query.to as string | undefined,
})

// Devuelve estadísticas de autenticación calculadas desde los logs
export const getAuthStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await logService.getAuthStats()
    res.json({ success: true, data: stats } as ApiResponse<typeof stats>)
  } catch (error) {
    next(error)
  }
}

// Devuelve el listado paginado de logs de auditoría con filtros opcionales
export const getLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filters: UserLogFilters = {
      ...extractFilters(req),
      page: req.query.page ? Number(req.query.page) : 1,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
    }

    const result = await logService.getLogs(filters)
    res.json({ success: true, data: result } as ApiResponse<PaginatedLogs>)
  } catch (error) {
    next(error)
  }
}

// Genera y descarga un archivo CSV con los logs filtrados
export const exportCsv = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const logs = await logService.getAllLogs(extractFilters(req))

    const header = '#,Fecha/Hora,Nivel,Módulo,Usuario,Acción,IP,Detalle'
    const rows = logs.map(log => {
      const fields = [
        log.id,
        log.createdAt,
        log.level,
        log.module,
        log.userName ?? 'Anónimo',
        `"${(log.action ?? '').replace(/"/g, '""')}"`,
        log.ip ?? '',
        `"${(log.detail ?? '').replace(/"/g, '""')}"`,
      ]
      return fields.join(',')
    })

    const csv = [header, ...rows].join('\n')

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename=auditoria.csv')
    res.send('\uFEFF' + csv)
  } catch (error) {
    next(error)
  }
}

// Genera y descarga un archivo PDF con los logs filtrados
export const exportPdf = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const logs = await logService.getAllLogs(extractFilters(req))

    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 30 })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=auditoria.pdf')
    doc.pipe(res)

    // Título del documento
    doc.fontSize(16).font('Helvetica-Bold').text('Auditoría de Actividad', { align: 'center' })
    doc.moveDown(0.5)
    doc.fontSize(9).font('Helvetica').text(
      `Generado: ${new Date().toLocaleString('es-ES')}  —  Total registros: ${logs.length}`,
      { align: 'center' },
    )
    doc.moveDown(1)

    // Cabeceras de la tabla
    const cols = [
      { label: '#', width: 35 },
      { label: 'Fecha/Hora', width: 120 },
      { label: 'Nivel', width: 55 },
      { label: 'Módulo', width: 65 },
      { label: 'Usuario', width: 140 },
      { label: 'Acción', width: 220 },
      { label: 'IP', width: 90 },
    ]

    const startX = doc.x
    let y = doc.y

    // Fondo de cabecera
    const totalWidth = cols.reduce((sum, c) => sum + c.width, 0)
    doc.rect(startX, y, totalWidth, 16).fill('#212529')

    let x = startX
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#ffffff')
    for (const col of cols) {
      doc.text(col.label, x + 3, y + 4, { width: col.width - 6, lineBreak: false })
      x += col.width
    }

    y += 18
    doc.fillColor('#000000').font('Helvetica').fontSize(7)

    // Filas
    for (const log of logs) {
      if (y > doc.page.height - 40) {
        doc.addPage()
        y = doc.y
      }

      const values = [
        String(log.id),
        log.createdAt.replace('T', ' ').substring(0, 19),
        log.level,
        log.module,
        log.userName ?? 'Anónimo',
        log.action,
        log.ip ?? '',
      ]

      x = startX
      for (let i = 0; i < cols.length; i++) {
        doc.text(values[i], x + 3, y, { width: cols[i].width - 6, lineBreak: false })
        x += cols[i].width
      }

      y += 14
    }

    doc.end()
  } catch (error) {
    next(error)
  }
}
