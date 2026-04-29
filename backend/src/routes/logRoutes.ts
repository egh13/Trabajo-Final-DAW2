import { Router } from 'express'
import { getLogs, exportCsv, exportPdf } from '../controllers/logController'
import { authenticate, authorize } from '../middlewares/authMiddleware'

const router = Router()

// Logs paginados y endpoints de exportación — solo admin y analista
router.get('/', authenticate, authorize('admin', 'analista'), getLogs)
router.get('/export/csv', authenticate, authorize('admin', 'analista'), exportCsv)
router.get('/export/pdf', authenticate, authorize('admin', 'analista'), exportPdf)

export default router
