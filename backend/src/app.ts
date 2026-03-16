import express, { Application } from 'express'
import cors from 'cors'
import morgan from 'morgan'

import categoryRoutes from './routes/categoryRoutes'
import productRoutes from './routes/productRoutes'
import cartRoutes from './routes/cartRoutes'
import orderRoutes from './routes/orderRoutes'
import authRoutes from './routes/authRoutes'
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware'

// Inicializar la DB al arrancar la aplicación
import './config/db'

const app: Application = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Rutas de la API
app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)

app.get('/', (req, res) => {
  res.json({ success: true, message: 'API Secure Tenis funcionando correctamente' })
})

// Manejadores de errores — deben ir al final
app.use(notFoundHandler) // se ejecuta si ninguna ruta coincide
app.use(errorHandler)

export default app