import { Router } from 'express'
import { getLogs } from '../controllers/logController'
import { authenticate, authorize } from '../middlewares/authMiddleware'

const router = Router()

// Solo administradores pueden consultar los logs de auditoría
router.get('/', authenticate, authorize('admin'), getLogs)

export default router
