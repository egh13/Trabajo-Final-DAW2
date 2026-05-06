import { Router } from 'express'
import { getBlocks, createBlock, deleteBlock } from '../../controllers/admin/blockController'
import { authenticate, authorize } from '../../middlewares/authMiddleware'

const router = Router()

// Rutas de bloqueo — administradores y analistas
router.use(authenticate, authorize('admin', 'analista'))

router.get('/', getBlocks)
router.post('/', createBlock)
router.delete('/:id', deleteBlock)

export default router
