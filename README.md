# SecureTenis – Ecommerce de Zapatillas
Proyecto desarrollado como Trabajo de Fin de Grado (TFG) para 2º de Desarrollo de Aplicaciones Web (DAW).

## Descripción del Proyecto

* Aplicación ecommerce completamente funcional especializada en la venta de zapatillas.
*  Especial hincapié en el uso de buenas prácticas y herramientas para mejorar la seguridad de la web.

## Arquitectura del Proyecto

La aplicación sigue una arquitectura cliente-servidor desacoplada.

* Frontend: Vue.js aplicando el patrón de diseño MVVM (Model–View–ViewModel).
  - Estilos mediante la librería bootstrap
* Backend: Express.js sobre el entorno Node.js
  - Comunicación mediante endpoints API REST.
  - Base de datos relacional con MariaDB.
  - Prisma ORM para interacciones con la DB
 
> Tanto frontend como backend utilizan TypeScript para asegurar un código más robusto y seguro.

### Características Frontend

* SPA (Single Page Application)
* Componentes reutilizables
* Routing con Vue Router
* Validación de formularios
* Protección de rutas

### Características Backend

* API RESTful
* Autenticación con JWT
* Middleware usando la libreria 'morgan' de npm para:
  - Autenticación
  - Control de roles
  - Manejo de errores
* Encriptación de contraseñas (bcrypt)
* Validación de datos
  - Uso de la librería Zod para la validación de datos en typescript
* Base de Datos con MariaDB
  -  Implementacion de seeders para poblar la DB


## 🚀 Despliegue Local

### Requisitos previos

| Herramienta | Versión mínima | Enlace |
|---|---|---|
| [Docker](https://docs.docker.com/get-docker/) | 24+ | Con el demonio en marcha |
| [Node.js](https://nodejs.org/) | 20+ | Necesario para el frontend |

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Trabajo-Final-DAW2
```

### 2. Lanzar todo el proyecto

El proyecto incluye scripts que automatizan la configuración del `.env`, la instalación de dependencias del frontend, el arranque de los contenedores Docker y la ejecución de Vite.

#### Linux / macOS

```bash
# Primer arranque (incluye seed de la BD)
./start.sh --seed

# Arranques posteriores
./start.sh
```

#### Windows (PowerShell)

```powershell
# Si PowerShell bloquea scripts de terceros, ejecuta esto una sola vez:
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

# Primer arranque (incluye seed de la BD)
.\start.ps1 -Seed

# Arranques posteriores
.\start.ps1
```

Al arrancar por primera vez, el script crea automáticamente `backend/.env` desde `backend/.env.example` con un `JWT_SECRET` aleatorio. Si necesitas configurar el **envío de correos (SMTP)**, edita ese archivo antes de arrancar:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password   # contraseña de aplicación de Google
```

> Para Gmail: activa la autenticación en 2 pasos y genera una [contraseña de aplicación](https://myaccount.google.com/apppasswords).

### Servicios disponibles

| Servicio | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |
| MariaDB | localhost:3306 |

### Parar el proyecto

#### Linux / macOS

```bash
# Ctrl+C en la terminal donde corre start.sh detiene todo automáticamente, o:

./stop.sh           # para los contenedores (conserva la BD)
./stop.sh --clean   # para + elimina la BD (pide confirmación)
```

#### Windows (PowerShell)

```powershell
# Ctrl+C en la terminal donde corre start.ps1 detiene todo automáticamente, o:

.\stop.ps1          # para los contenedores (conserva la BD)
.\stop.ps1 -Clean   # para + elimina la BD (pide confirmación)
```

### Arranque manual (sin scripts)

Si prefieres arrancar los servicios por separado:

```bash
# 1. Configurar el entorno
cp backend/.env.example backend/.env
# Edita backend/.env con tus valores

# 2. Levantar BD + Backend
docker compose up --build -d

# 3. Poblar la BD (solo la primera vez)
docker exec tfg-backend npx ts-node prisma/seed.ts

# 4. Arrancar el frontend
cd secure-tenis
npm install
npm run dev

# 5. Parar
docker compose down        # conserva datos
docker compose down -v     # elimina datos
```

---

## Despliegue Final

### Frontend
* Vercel
### Backend (Servidor + Base de datos)
* Render o Railway
