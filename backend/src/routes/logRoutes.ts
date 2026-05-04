import { Router } from 'express'
import { getLogs, exportCsv, exportPdf, getAuthStats } from '../controllers/logController'
import { authenticate, authorize } from '../middlewares/authMiddleware'

const router = Router()

// Estadísticas de autenticación, logs paginados y exportación — solo admin y analista
router.get('/auth-stats', authenticate, authorize('admin', 'analista'), getAuthStats)
router.get('/', authenticate, authorize('admin', 'analista'), getLogs)
router.get('/export/csv', authenticate, authorize('admin', 'analista'), exportCsv)
router.get('/export/pdf', authenticate, authorize('admin', 'analista'), exportPdf)

export default router
