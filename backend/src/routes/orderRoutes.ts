import { Router } from 'express'
import { getOrders, getOrderById, createOrder } from '../controllers/orderController'
import { authenticate } from '../middlewares/authMiddleware'

const router = Router()

router.use(authenticate)

router.get('/', getOrders)
router.get('/:id', getOrderById)
router.post('/', createOrder)

export default router
