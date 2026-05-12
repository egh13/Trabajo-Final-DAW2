import { Router } from 'express'
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController'
import { optionalAuthenticate } from '../middlewares/authMiddleware'

const router = Router()

router.use(optionalAuthenticate)

router.get('/', getCart)
router.post('/', addToCart)
router.put('/:productId', updateCartItem)
router.delete('/clear', clearCart)
router.delete('/:productId', removeFromCart)

export default router
