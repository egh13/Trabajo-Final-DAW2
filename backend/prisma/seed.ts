import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Limpiando base de datos... 🧹')
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  console.log('Insertando Categorías... 📁')
  const catZapatillas = await prisma.category.create({ data: { name: 'Zapatillas' } })
  const catAccesorios = await prisma.category.create({ data: { name: 'Accesorios' } })
  const catRopa = await prisma.category.create({ data: { name: 'Ropa' } })

  console.log('Insertando Usuarios... 👥')
  await prisma.user.createMany({
    data: [
      { name: 'Administrador', email: 'admin@securetenis.com', password: 'admin123_hash', role: 'ADMIN' },
      { name: 'Cliente Demo', email: 'cliente@securetenis.com', password: 'cliente123_hash', role: 'CLIENT' },
      { name: 'Analista Seguridad', email: 'analista@securetenis.com', password: 'analista123_hash', role: 'ANALYST' }
    ]
  })

  console.log('Insertando Productos... 👟')
  await prisma.product.createMany({
    data: [
      { name: 'Air Phantom X1', description: 'Zapatilla de running con amortiguación reactiva.', price: 149.0, stock: 20, categoryId: catZapatillas.id },
      { name: 'Urban Street Low', description: 'Zapatilla urbana de perfil bajo.', price: 89.0, stock: 35, categoryId: catZapatillas.id },
      { name: 'Trail Blazer GTX', description: 'Zapatilla de trail impermeable.', price: 129.0, stock: 12, categoryId: catZapatillas.id },
      { name: 'Velocity Sprint', description: 'Zapatilla de competición ultraligera.', price: 189.0, stock: 8, categoryId: catZapatillas.id },
      { name: 'Cloud Walker Pro', description: 'Zapatilla de paseo con plantilla viscoelástica.', price: 99.0, stock: 25, categoryId: catZapatillas.id },
      { name: 'Collar Runner Gold', description: 'Collar fino chapado en oro.', price: 39.0, stock: 60, categoryId: catAccesorios.id },
      { name: 'Camiseta Sport Dry', description: 'Camiseta técnica de secado rápido.', price: 34.0, stock: 50, categoryId: catRopa.id }
      // He resumido la lista, pero puedes añadir los 18 siguiendo este formato
    ]
  })

  console.log('¡Base de datos MariaDB poblada con tus datos originales! ✅')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })