import express, { Application } from 'express'
import cors from 'cors'
import morgan from 'morgan'

import categoryRoutes from './routes/categoryRoutes'
import productRoutes from './routes/productRoutes'
import cartRoutes from './routes/cartRoutes'
import orderRoutes from './routes/orderRoutes'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/admin/userRoutes'
import logRoutes from './routes/admin/logRoutes'
import statsRoutes from './routes/admin/statsRoutes'
import blockRoutes from './routes/admin/blockRoutes'
import { checkBlock } from './middlewares/checkBlock'
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware'

const app: Application = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Verificar bloqueo por IP antes de procesar cualquier ruta
app.use(checkBlock)

// Rutas de la API
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/logs', logRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/blocks', blockRoutes)

app.get('/', (req, res) => {
  res.json({ success: true, message: 'API Secure Tenis funcionando correctamente' })
})

// Manejadores de errores — deben ir al final
app.use(notFoundHandler) // se ejecuta si ninguna ruta coincide
app.use(errorHandler)

export default app