import { Router } from 'express'
import { getAuthStats, getSystemStats } from '../../controllers/admin/statsController'
import { authenticate, authorize } from '../../middlewares/authMiddleware'

const router = Router()

// Rutas solo disponibles para roles de admin y analista 
router.use(authenticate, authorize('admin', 'analista'))

router.get('/system-stats', getSystemStats)
router.get('/auth-stats', getAuthStats)

export default router
