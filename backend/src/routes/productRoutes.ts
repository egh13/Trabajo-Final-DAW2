import { Router } from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController'
import { authenticate, authorize } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', getProducts)
router.get('/:id', getProductById)
// Rutas admin
router.post('/', authenticate, authorize('admin'), createProduct)
router.put('/:id', authenticate, authorize('admin'), updateProduct)
router.delete('/:id', authenticate, authorize('admin'), deleteProduct)

export default router
