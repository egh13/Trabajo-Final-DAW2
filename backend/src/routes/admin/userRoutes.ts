import { Router } from 'express'
import { getUsers, createUser, updateUser, deleteUser } from '../../controllers/admin/userController'
import { authenticate, authorize } from '../../middlewares/authMiddleware'

const router = Router()

// Rutas solo para administrador
router.use(authenticate, authorize('admin'))

router.get('/', getUsers)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router
