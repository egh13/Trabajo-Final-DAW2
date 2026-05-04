import { Router } from 'express'
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController'
import { authenticate, authorize } from '../middlewares/authMiddleware'

const router = Router()

// Todas las rutas requieren autenticación y rol de administrador
router.use(authenticate, authorize('admin'))

router.get('/', getUsers)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router
