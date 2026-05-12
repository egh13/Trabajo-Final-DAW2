import { Router } from 'express'
import { getOrders, getOrderById, createOrder, getInvoicePdf } from '../controllers/orderController'
import { authenticate } from '../middlewares/authMiddleware'

const router = Router()

// Invoice uses token via query param (opened in new browser tab)
router.get('/:id/invoice', getInvoicePdf)

router.use(authenticate)

router.get('/', getOrders)
router.get('/:id', getOrderById)
router.post('/', createOrder)

export default router
