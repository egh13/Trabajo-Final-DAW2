import db from '../config/db'
import bcrypt from 'bcryptjs'

const seedCategories = (): Record<string, number> => {
  const insertCategory = db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)')

  const zapatillas = insertCategory.run('Zapatillas', 'Calzado deportivo y urbano de alta calidad')
  const accesorios = insertCategory.run('Accesorios', 'Complementos y joyería deportiva y casual')
  const ropa       = insertCategory.run('Ropa', 'Ropa deportiva y técnica')

  return {
    zapatillas: zapatillas.lastInsertRowid as number,
    accesorios: accesorios.lastInsertRowid as number,
    ropa:       ropa.lastInsertRowid as number,
  }
}

const seedProducts = (categoryIds: Record<string, number>): void => {
  const insertProduct = db.prepare(
    'INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES (?, ?, ?, ?, ?, ?)'
  )

  // Zapatillas
  insertProduct.run('Air Phantom X1',    'Zapatilla de running con amortiguación reactiva y suela de carbono.',           149, 20, null, categoryIds.zapatillas)
  insertProduct.run('Urban Street Low',  'Zapatilla urbana de perfil bajo con suela vulcanizada y cuero sintético.',      89,  35, null, categoryIds.zapatillas)
  insertProduct.run('Trail Blazer GTX',  'Zapatilla de trail con membrana impermeable y agarre extremo en barro.',        129, 12, null, categoryIds.zapatillas)
  insertProduct.run('Velocity Sprint',   'Zapatilla de competición ultraligera para velocidad en pista.',                 189, 8,  null, categoryIds.zapatillas)
  insertProduct.run('Cloud Walker Pro',  'Zapatilla de paseo con plantilla viscoelástica y horma ancha.',                 99,  25, null, categoryIds.zapatillas)
  insertProduct.run('Retro Court 90',    'Zapatilla estilo retro inspirada en el tenis de los años 90.',                  79,  40, null, categoryIds.zapatillas)
  insertProduct.run('HikeMax Summit',    'Bota-zapatilla de senderismo con tobillera reforzada y puntera protegida.',     119, 15, null, categoryIds.zapatillas)
  insertProduct.run('Slide Comfort',     'Zapatilla tipo slide para recuperación post-entrenamiento.',                    45,  50, null, categoryIds.zapatillas)
  insertProduct.run('Neon Racer Knit',   'Zapatilla con upper de punto elástico y suela dentada bicolor.',                109, 18, null, categoryIds.zapatillas)
  insertProduct.run('Grip Master Sala',  'Zapatilla de fútbol sala con suela de goma antideslizante interior.',           95,  22, null, categoryIds.zapatillas)

  // Accesorios
  insertProduct.run('Collar Runner Gold',   'Collar fino chapado en oro con colgante de zapatilla en miniatura.',         39,  60, null, categoryIds.accesorios)
  insertProduct.run('Collar Urban Silver',  'Collar de cadena de plata de ley con dije deportivo ajustable.',             49,  45, null, categoryIds.accesorios)
  insertProduct.run('Gorra Snapback Pro',   'Gorra de visera plana con bordado en 3D y cierre ajustable trasero.',        29,  80, null, categoryIds.accesorios)
  insertProduct.run('Gorra Running Mesh',   'Gorra técnica de malla transpirable con reflectante y visera curva.',        24,  65, null, categoryIds.accesorios)
  insertProduct.run('Anillo Street Stack',  'Anillo de acero inoxidable con textura cruzada estilo urbano.',              19,  90, null, categoryIds.accesorios)
  insertProduct.run('Anillo Gold Lace',     'Anillo chapado en oro con detalle de cordón de zapatilla grabado.',          29,  55, null, categoryIds.accesorios)

  // Ropa
  insertProduct.run('Camiseta Sport Dry',   'Camiseta técnica de secado rápido con tejido antibacteriano.',               34,  50, null, categoryIds.ropa)
  insertProduct.run('Shorts Training Pro',  'Short de entrenamiento con bolsillo lateral y cintura elástica.',            29,  40, null, categoryIds.ropa)
}

const seedUsers = (): void => {
  const insertUser = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)')
  const hash = bcrypt.hashSync('123456', 10)

  insertUser.run('Administrador', 'admin@securetenis.com', hash, 'admin')
  insertUser.run('Cliente Demo', 'cliente@securetenis.com', hash, 'cliente')
  insertUser.run('Analista Seguridad', 'analista@securetenis.com', hash, 'analista')
}

export const runSeeders = (): void => {
  const categoryCount = (db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number }).count

  if (categoryCount > 0) {
    console.log('[Seeders] La base de datos ya tiene datos. Se omite la ejecución.')
    return
  }

  const seed = db.transaction(() => {
    seedUsers()
    const categoryIds = seedCategories()
    seedProducts(categoryIds)
  })

  seed()
  console.log('[Seeders] Datos iniciales insertados correctamente.')
}
