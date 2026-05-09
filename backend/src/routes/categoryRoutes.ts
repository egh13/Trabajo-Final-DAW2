import { Router } from 'express'
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController'
import { authorize } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', getCategories)
router.get('/:id', getCategoryById)
// Rutas admin
router.post('/', authorize('admin'), createCategory)
router.put('/:id', authorize('admin'), updateCategory)
router.delete('/:id', authorize('admin'), deleteCategory)

export default router
