import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Tipo local para construir los borradores de log antes de insertar
type LogDraft = {
  level: 'INFO' | 'ERROR' | 'WARNING' | 'DEBUG'
  module: string
  action: string
  userId?: number | null
  ip: string
  createdAt: Date
  detail?: string
}

async function main() {
  console.log('Limpiando base de datos... 🧹')
  await prisma.userLog.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  console.log('Insertando Categorias... 📁')
  const catZapatillas = await prisma.category.create({ data: { name: 'Zapatillas' } })
  const catAccesorios = await prisma.category.create({ data: { name: 'Accesorios' } })
  const catRopa       = await prisma.category.create({ data: { name: 'Ropa' } })

  console.log('Insertando Usuarios... 👥')
  const salt = await bcrypt.genSalt(10)
  await prisma.user.createMany({
    data: [
      { name: 'Administrador',      email: 'admin@securetenis.com',    password: await bcrypt.hash('admin123',    salt), role: 'ADMIN'   },
      { name: 'Cliente Demo',       email: 'cliente@securetenis.com',  password: await bcrypt.hash('cliente123',  salt), role: 'CLIENT'  },
      { name: 'Analista Seguridad', email: 'analista@securetenis.com', password: await bcrypt.hash('analista123', salt), role: 'ANALYST' }
    ]
  })

  console.log('Insertando Productos... 👟')
  await prisma.product.createMany({
    data: [
      { name: 'Air Phantom X1',     description: 'Zapatilla de running con amortiguacion reactiva.', price: 149.0, stock: 20, image: 'https://res.cloudinary.com/dqezwrvov/image/upload/v1776687359/Premium-Authentic-Point-Shoe-VANS-Black-ALT1_ovxrdi.jpg', categoryId: catZapatillas.id },
      { name: 'Urban Street Low',   description: 'Zapatilla urbana de perfil bajo.',                 price:  89.0, stock: 35, image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600', categoryId: catZapatillas.id },
      { name: 'Trail Blazer GTX',   description: 'Zapatilla de trail impermeable.',                  price: 129.0, stock: 12, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600', categoryId: catZapatillas.id },
      { name: 'Velocity Sprint',    description: 'Zapatilla de competicion ultraligera.',            price: 189.0, stock:  8, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600', categoryId: catZapatillas.id },
      { name: 'Cloud Walker Pro',   description: 'Zapatilla de paseo con plantilla viscoelastica.',  price:  99.0, stock: 25, image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600', categoryId: catZapatillas.id },
      { name: 'Collar Runner Gold', description: 'Collar fino chapado en oro.',                      price:  39.0, stock: 60, image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600', categoryId: catAccesorios.id },
      { name: 'Camiseta Sport Dry', description: 'Camiseta tecnica de secado rapido.',               price:  34.0, stock: 50, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', categoryId: catRopa.id       }
    ]
  })

  console.log('Insertando Logs de auditoria... 📋')
  const admin    = await prisma.user.findUnique({ where: { email: 'admin@securetenis.com'    } })
  const cliente  = await prisma.user.findUnique({ where: { email: 'cliente@securetenis.com'  } })
  const analista = await prisma.user.findUnique({ where: { email: 'analista@securetenis.com' } })

  const now  = new Date()
  const logs: LogDraft[] = []

  // Genera logins exitosos y fallidos para los ultimos 3 dias
  for (let daysAgo = 2; daysAgo >= 0; daysAgo--) {
    const day = new Date(now)
    day.setDate(day.getDate() - daysAgo)

    const loginCount = Math.floor(Math.random() * 6) + 2 + (6 - daysAgo)
    for (let i = 0; i < loginCount; i++) {
      const hour   = 8 + Math.floor(Math.random() * 12)
      const minute = Math.floor(Math.random() * 60)
      const user   = [admin, cliente, analista][Math.floor(Math.random() * 3)]
      logs.push({
        level: 'INFO', module: 'Auth', action: 'Login exitoso',
        userId: user?.id, ip: `192.168.1.${10 + i}`,
        createdAt: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute)
      })
    }

    const failEmails = ['hacker@evil.com', 'desconocido@test.com', 'brute@force.net', 'fake@spam.org']
    const failCount  = Math.floor(Math.random() * 4) + 1
    for (let i = 0; i < failCount; i++) {
      const hour = 1 + Math.floor(Math.random() * 22)
      logs.push({
        level: 'ERROR', module: 'Auth', action: 'Login fallido — Credenciales incorrectas.',
        userId: null,
        ip: `103.21.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        createdAt: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, Math.floor(Math.random() * 60)),
        detail: `email: ${failEmails[Math.floor(Math.random() * failEmails.length)]}`
      })
    }
  }

  // Logs adicionales variados para hoy
  const today = (h: number, m: number) =>
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m)

  logs.push(
    { level: 'WARNING', module: 'Auth',      action: 'Acceso sin token a /api/orders', userId: null,        ip: '45.33.32.156', createdAt: today(10, 15) },
    { level: 'INFO',    module: 'Productos', action: 'GET /api/products',               userId: cliente?.id, ip: '192.168.1.42', createdAt: today(10, 20) },
    { level: 'INFO',    module: 'Pedidos',   action: 'Nuevo pedido creado',             userId: cliente?.id, ip: '192.168.1.42', createdAt: today(10, 30) },
    { level: 'INFO',    module: 'Auth',      action: 'Registro de nuevo usuario',       userId: cliente?.id, ip: '192.168.1.88', createdAt: today(11,  0) },
    { level: 'DEBUG',   module: 'Sistema',   action: 'Healthcheck DB OK',               userId: null,        ip: '127.0.0.1',    createdAt: today( 8,  0) }
  )

  // El cast evita el conflicto entre el tipo local y el enum generado por Prisma
  await prisma.userLog.createMany({ data: logs as any[] })

  console.log(`  -> ${logs.length} logs insertados`)
  console.log('Base de datos poblada! ✅')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
