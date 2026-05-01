import { Router } from 'express'
import { register, login, getMe, getUsers } from '../controllers/authController'
import { authenticate } from '../middlewares/authMiddleware'
import { validate } from '../middlewares/validateMiddleware'
import { registerSchema, loginSchema } from '../validators/authValidator'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.get('/me', authenticate, getMe)
router.get('/users', authenticate, getUsers)

export default router
