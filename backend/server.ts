import dotenv from 'dotenv';
import app from './src/app';
import { prisma } from './src/config/prisma';
import { createLog } from './src/services/admin/logService';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);

  // Verifica la conexión a la base de datos al arrancar y registra el resultado
  try {
    await prisma.$queryRaw`SELECT 1`;
    await createLog({ level: 'DEBUG', module: 'Sistema', action: 'Healthcheck DB OK', ip: '127.0.0.1' });
  } catch (err: any) {
    await createLog({ level: 'ERROR', module: 'Sistema', action: 'Healthcheck DB FAILED', ip: '127.0.0.1', detail: err.message });
  }
});