import { Router } from 'express'
import { register, login, getMe, getUsers, createUserAsAdmin, updateUserAsAdmin, deleteUserAsAdmin } from '../controllers/authController'
import { authenticate } from '../middlewares/authMiddleware'
import { validate } from '../middlewares/validateMiddleware'
import { registerSchema, loginSchema } from '../validators/authValidator'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.get('/me', authenticate, getMe)
router.get('/users', authenticate, getUsers)
router.post('/users', authenticate, createUserAsAdmin)
router.put('/users/:id', authenticate, updateUserAsAdmin)
router.delete('/users/:id', authenticate, deleteUserAsAdmin)

export default router
