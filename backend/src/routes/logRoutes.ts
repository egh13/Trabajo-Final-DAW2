import { Router } from 'express'
import { getLogs } from '../controllers/logController'
import { authenticate, authorize } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', authenticate, authorize('admin', 'analista'), getLogs)

export default router
