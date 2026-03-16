import { Router } from 'express'
import { getOrders, getOrderById, createOrder } from '../controllers/orderController'

const router = Router()

router.get('/', getOrders)
router.get('/:id', getOrderById)
router.post('/', createOrder)

export default router
