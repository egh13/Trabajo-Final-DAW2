import { Router } from 'express'
import { getLogs, exportCsv, exportPdf} from '../../controllers/admin/logController'
import { authenticate, authorize } from '../../middlewares/authMiddleware'

const router = Router()

// Rutas solo disponibles para roles de admin y analista 
router.use(authenticate, authorize('admin', 'analista'))

router.get('/', getLogs)
router.get('/export/csv', exportCsv)
router.get('/export/pdf', exportPdf)

export default router
