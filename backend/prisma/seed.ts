import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Limpiando base de datos... 🧹')
  await prisma.userLog.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  console.log('Insertando Categorías... 📁')
  const catZapatillas = await prisma.category.create({ data: { name: 'Zapatillas' } })
  const catAccesorios = await prisma.category.create({ data: { name: 'Accesorios' } })
  const catRopa = await prisma.category.create({ data: { name: 'Ropa' } })
  
  console.log('Insertando Usuarios... 👥')
  const salt = await bcrypt.genSalt(10)
  await prisma.user.createMany({
    data: [
      { name: 'Administrador', email: 'admin@securetenis.com', password: await bcrypt.hash('admin123', salt), role: 'ADMIN' },
      { name: 'Cliente Demo', email: 'cliente@securetenis.com', password: await bcrypt.hash('cliente123', salt), role: 'CLIENT' },
      { name: 'Analista Seguridad', email: 'analista@securetenis.com', password: await bcrypt.hash('analista123', salt), role: 'ANALYST' }
    ]
  })

  console.log('Insertando Productos... 👟')
  await prisma.product.createMany({
    data: [      
      { name: 'Air Phantom X1', description: 'Zapatilla de running con amortiguación reactiva.', price: 149.0, stock: 20, image: 'https://res.cloudinary.com/dqezwrvov/image/upload/v1776687359/Premium-Authentic-Point-Shoe-VANS-Black-ALT1_ovxrdi.jpg', categoryId: catZapatillas.id },
      { name: 'Urban Street Low', description: 'Zapatilla urbana de perfil bajo.', price: 89.0, stock: 35, image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600', categoryId: catZapatillas.id },
      { name: 'Trail Blazer GTX', description: 'Zapatilla de trail impermeable.', price: 129.0, stock: 12, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600', categoryId: catZapatillas.id },
      { name: 'Velocity Sprint', description: 'Zapatilla de competición ultraligera.', price: 189.0, stock: 8, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600', categoryId: catZapatillas.id },
      { name: 'Cloud Walker Pro', description: 'Zapatilla de paseo con plantilla viscoelástica.', price: 99.0, stock: 25, image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600', categoryId: catZapatillas.id },
      { name: 'Collar Runner Gold', description: 'Collar fino chapado en oro.', price: 39.0, stock: 60, image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600', categoryId: catAccesorios.id },
      { name: 'Camiseta Sport Dry', description: 'Camiseta técnica de secado rápido.', price: 34.0, stock: 50, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', categoryId: catRopa.id }    ]
  })

  console.log('Insertando Logs de auditoría... 📋')
  const admin = await prisma.user.findUnique({ where: { email: 'admin@securetenis.com' } })
  const cliente = await prisma.user.findUnique({ where: { email: 'cliente@securetenis.com' } })

  await prisma.userLog.createMany({
    data: [
      { level: 'INFO',    module: 'Auth',      action: 'Login exitoso',                          userId: admin?.id,   ip: '192.168.1.10',  createdAt: new Date('2026-04-27T08:00:00') },
      { level: 'INFO',    module: 'Auth',      action: 'Login exitoso',                          userId: cliente?.id, ip: '192.168.1.42',  createdAt: new Date('2026-04-27T08:05:00') },
      { level: 'ERROR',   module: 'Auth',      action: 'Login fallido — contraseña incorrecta',  userId: null,        ip: '192.168.1.105', createdAt: new Date('2026-04-27T08:10:00'), detail: 'email: desconocido@test.com' },
      { level: 'WARNING', module: 'Auth',      action: 'Acceso sin token a /api/orders',         userId: null,        ip: '45.33.32.156',  createdAt: new Date('2026-04-27T08:15:00') },
      { level: 'INFO',    module: 'Productos', action: 'GET /api/products',                      userId: cliente?.id, ip: '192.168.1.42',  createdAt: new Date('2026-04-27T08:20:00') },
      { level: 'INFO',    module: 'Productos', action: 'GET /api/categories',                    userId: cliente?.id, ip: '192.168.1.42',  createdAt: new Date('2026-04-27T08:25:00') },
      { level: 'INFO',    module: 'Pedidos',   action: 'Nuevo pedido #1 creado',                 userId: cliente?.id, ip: '192.168.1.42',  createdAt: new Date('2026-04-27T08:30:00') },
      { level: 'WARNING', module: 'Sistema',   action: 'Uso de memoria > 80%',                   userId: null,        ip: '127.0.0.1',     createdAt: new Date('2026-04-27T08:35:00'), detail: 'heap: 820MB / 1024MB' },
      { level: 'INFO',    module: 'Sistema',   action: 'Backup automático completado',           userId: null,        ip: '127.0.0.1',     createdAt: new Date('2026-04-27T08:40:00') },
      { level: 'ERROR',   module: 'Auth',      action: 'Login fallido — usuario no encontrado',  userId: null,        ip: '103.21.244.0',  createdAt: new Date('2026-04-27T08:45:00'), detail: 'email: hacker@evil.com' },
      { level: 'INFO',    module: 'Auth',      action: 'Registro de nuevo usuario',              userId: cliente?.id, ip: '192.168.1.88',  createdAt: new Date('2026-04-27T09:00:00') },
      { level: 'DEBUG',   module: 'Sistema',   action: 'Healthcheck DB OK',                      userId: null,        ip: '127.0.0.1',     createdAt: new Date('2026-04-27T09:05:00') },
    ]
  })

  console.log('¡Base de datos MariaDB poblada! ✅')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })