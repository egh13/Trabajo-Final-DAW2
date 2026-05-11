# SecureTenis

Tenda online de zapatillas desarrollado como Trabajo de Fin de Grado (TFG) de 2º DAW.

La aplicacion permite a los usuarios navegar un catalogo de productos, gestionar un carrito de compra y realizar pedidos. Cuenta con un panel de administracion para la gestion de usuarios, pedidos, bloqueos de IP y registro de actividad.

---

## Tecnologias

| Capa | Stack |
|---|---|
| Frontend | Vue 3, Pinia, Vue Router, Bootstrap 5, TypeScript |
| Backend | Node.js, Express, TypeScript |
| Base de datos | MariaDB, Prisma ORM |
| Despliegue local | Docker Compose |

---

### Backend

Organizado en capas con responsabilidades separadas:

```
backend/src/
  routes/         Registro de endpoints y aplicacion de middlewares
  controllers/    Reciben la peticion y devuelven la respuesta JSON
  services/       Logica de negocio y acceso a la base de datos
  middlewares/    Autenticacion, autorizacion, validacion y manejo de errores
  validators/     Esquemas Zod para validacion de entrada
  types/          Interfaces y tipos compartidos
```

### Frontend

Organizado por dominio funcional:

```
secure-tenis/src/modules/<dominio>/
  views/          Paginas (componentes raiz de ruta)
  services/       Llamadas a la API
  composables/    Logica reactiva reutilizable
```

---

## Seguridad

- Autenticacion con JWT (expiracion configurable)
- Control de roles: `CLIENT`, `ADMIN`, `ANALYST`
- Bloqueo de IPs y usuarios desde el panel de administracion
- Proteccion de rutas en frontend y backend
- Validacion de todos los datos de entrada con Zod
- Hash de contrasenas con bcrypt
- Registro de actividad (logs) por usuario y modulo
- Carrito anonimo vinculado por `session_id`, fusionado al autenticarse

---

## Puesta en marcha

### Requisitos

- Docker 24+
- Node.js 20+ 

### Arranque con scripts

Los scripts automatizan la configuracion del `.env`, la instalacion de dependencias del frontend, el arranque de los contenedores y la ejecucion de Vite.

**Linux / macOS**

```bash
# Primer arranque (incluye seed de la base de datos)
./start.sh --seed

# Arranques posteriores
./start.sh
```

**Windows (PowerShell)**

```powershell
# Si PowerShell bloquea scripts, ejecuta esto una sola vez:
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

# Primer arranque
.\start.ps1 -Seed

# Arranques posteriores
.\start.ps1
```

En el primer arranque se genera `backend/.env` automaticamente desde `backend/.env.example` con un `JWT_SECRET` aleatorio.

### Servicios disponibles

| Servicio | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |
| MariaDB | localhost:3306 |

### Parar el proyecto

**Linux / macOS**

```bash
./stop.sh           # Para los contenedores (conserva la base de datos)
./stop.sh --clean   # Para y elimina la base de datos (pide confirmacion)
```

**Windows (PowerShell)**

```powershell
.\stop.ps1
.\stop.ps1 -Clean
```

### Arranque manual (sin scripts)

```bash
# 1. Configurar el entorno
cp backend/.env.example backend/.env
# Editar backend/.env con los valores necesarios

# 2. Levantar base de datos y backend
docker compose up --build -d

# 3. Poblar la base de datos (solo la primera vez)
docker exec tfg-backend npx ts-node prisma/seed.ts

# 4. Arrancar el frontend
cd secure-tenis
npm install
npm run dev
```

Para detener:

```bash
docker compose down      # Conserva los datos
docker compose down -v   # Elimina los datos
```

---

## Configuracion del entorno

El archivo `backend/.env.example` contiene todas las variables disponibles. Las mas relevantes:

```env
PORT=3000
NODE_ENV=development

JWT_SECRET=cambia_este_secreto_en_produccion
JWT_EXPIRES_IN=24h

DATABASE_URL=mysql://username:password@mariadb:3306/mydb

# Opcional: envio de correos
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password

FRONTEND_URL=http://localhost:5173
SALT_ROUNDS=10
```

Para el envio de correos con Gmail, activa la autenticacion en 2 pasos y genera una [contrasena de aplicacion](https://myaccount.google.com/apppasswords).

---

## Despliegue en produccion

| Servicio | Plataforma |
|---|---|
| Frontend | Vercel |
| Backend + Base de datos | Render o Railway |

---

## Licencia

Proyecto academico desarrollado para 2º DAW. Ver `LICENSE` para los terminos completos.
