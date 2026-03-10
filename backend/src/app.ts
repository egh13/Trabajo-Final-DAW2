import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
// app.use('/api/users', userRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

export default app;