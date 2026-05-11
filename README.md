<div align="center">

# SecureTenis

### Ecommerce de zapatillas con panel de administración completo

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MariaDB](https://img.shields.io/badge/MariaDB-10+-003545?style=for-the-badge&logo=mariadb&logoColor=white)](https://mariadb.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

<br/>

> Proyecto de Fin de Grado · 2º DAW · 2025–2026

</div>

---

## Descripción

**SecureTenis** es una plataforma de comercio electrónico especializada en zapatillas deportivas. Desarrollada como TFG de 2.º DAW, aborda el reto real de construir una tienda online completa con autenticación y autorización segura, gestión de carrito persistente (tanto para usuarios anónimos como autenticados) y un panel de administración con múltiples funcionalidades.

El proyecto demuestra la integración de un frontend reactivo en **Vue 3** con un backend **Express** tipado en **TypeScript**, usando **Prisma ORM** sobre **MariaDB** y desplegando toda la infraestructura con **Docker Compose**.

---

## Características principales

### Tienda
- Catálogo de productos con filtrado por categoría y búsqueda
- Carrito persistente: funciona sin cuenta y se fusiona automáticamente al iniciar sesión
- Gestión de cantidad, eliminación de artículos y vaciado de carrito
- Proceso de compra con reducción de stock automática en base de datos
- Historial de pedidos por usuario

### Autenticación y seguridad
- Registro e inicio de sesión con **JWT** (expiración configurable)
- Control de acceso por roles: `CLIENT`, `ADMIN`, `ANALYST`
- Auto-bloqueo tras 5 intentos de login fallidos en 10 minutos
- Bloqueo manual de usuarios e IPs desde el panel
- Middleware de comprobación de bloqueo en cada petición
- Hash de contraseñas con **bcrypt**
- Correo de bienvenida automático al registrarse (SMTP configurable)

### Panel de administración
- Gestión de usuarios: listado, cambio de rol, bloqueo/desbloqueo
- Gestión de pedidos con actualización de estado
- Gestión de productos y categorías (CRUD completo)
- Registro de actividad (logs) con niveles INFO, WARNING, ERROR, DEBUG
- Estadísticas del negocio con gráficas (Chart.js)
- Gestión de bloqueos de IP y usuarios

## Arquitectura

### Diagrama de comunicación entre capas

```
CLIENTE (Vue 3 + Vite)
  Vue Router (guards)  +  Pinia (stores)  +  Composables
                       |
                 API Client (fetch)
              + x-session-id header
                       |  HTTP/JSON
                       v
BACKEND (Express 5)
  checkBlock -> Router -> Validator (Zod)
                    |
              Controller -> Service -> Prisma ORM
                    |
              errorHandler
                       |
                       v
MariaDB (Docker)
  Users, Products, Categories, Orders
  CartItems, OrderItems, UserLogs, IpBlocks
```

### Gestión de estado con Pinia

El proyecto sigue el principio de **separación de responsabilidades** entre stores y composables:

| Capa | Responsabilidad | Ejemplos |
|---|---|---|
| **Stores (Pinia)** | Estado global compartido entre vistas, llamadas a la API, manejo de errores | `authStore`, `cartStore` |
| **Composables** | Lógica reactiva local o reutilizable dentro de un módulo | Filtros de productos, paginación |
| **Services** | Llamadas HTTP puras, sin estado | `orderService`, `cartService` |

Esta separación permite que el carrito, por ejemplo, sea accesible desde el `Navbar`, el `CartView` y el flujo de checkout sin duplicar peticiones ni estado.

---

## Stack tecnológico

### Frontend

| Tecnología | Versión | Uso |
|---|---|---|
| Vue 3 | 3.5 | Framework reactivo con Composition API y script setup |
| Vite | 7.x | Bundler y servidor de desarrollo |
| Pinia | 3.x | Gestión de estado global |
| Vue Router | 5.x | Navegación SPA con navigation guards |
| TypeScript | 5.9 | Tipado estático en todo el frontend |
| Bootstrap | 5.3 | Sistema de diseño y componentes UI |
| Bootstrap Icons | — | Iconografía |
| Chart.js + vue-chartjs | 4.x | Gráficas en el panel de administración |

### Backend

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | 20+ | Runtime del servidor |
| Express | 5.x | Framework HTTP |
| TypeScript | 5.9 | Tipado estático en todo el backend |
| Prisma ORM | 6.x | Acceso a base de datos con tipado |
| Zod | 4.x | Validación de datos de entrada |
| bcryptjs | 3.x | Hash seguro de contraseñas |
| jsonwebtoken | 9.x | Autenticación con JWT |
| Nodemailer | 8.x | Envío de correos transaccionales |
| morgan | 1.x | Logging de peticiones HTTP |

### Base de datos e infraestructura

| Tecnología | Uso |
|---|---|
| MariaDB 10+ | Base de datos relacional principal |
| Prisma Migrate | Migraciones versionadas del esquema |
| Docker Compose | Orquestación de contenedores (backend + BD) |

---

## Instalación y configuración

### Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 24+
- [Node.js](https://nodejs.org/) 20+

### Arranque con scripts (recomendado)

**Windows (PowerShell)**

```powershell
# Si PowerShell bloquea scripts, ejecuta esto una sola vez:
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

# Primer arranque (instala dependencias, genera .env y siembra la BD)
.\start.ps1 -Seed

# Arranques posteriores
.\start.ps1
```

**Linux / macOS**

```bash
# Primer arranque
./start.sh --seed

# Arranques posteriores
./start.sh
```

El script automatiza:
1. Copia de `backend/.env.example` a `backend/.env` con un `JWT_SECRET` aleatorio
2. `npm install` del frontend
3. `docker compose up --build -d`
4. Seed de la base de datos (solo con `--seed` / `-Seed`)

### Arranque manual

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd Trabajo-Final-DAW2

# 2. Configurar variables de entorno
cp backend/.env.example backend/.env

# 3. Levantar backend y base de datos
docker compose up --build -d

# 4. Sembrar datos de ejemplo (solo la primera vez)
docker exec tfg-backend npx ts-node prisma/seed.ts

# 5. Arrancar el frontend
cd secure-tenis
npm install
npm run dev
```

### Variables de entorno

Crea `backend/.env` a partir de `backend/.env.example`:

```env
PORT=3000
NODE_ENV=development

JWT_SECRET=cambia_este_secreto_en_produccion
JWT_EXPIRES_IN=24h
SALT_ROUNDS=10

DATABASE_URL=mysql://username:password@mariadb:3306/mydb

# Correo (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password

FRONTEND_URL=http://localhost:5173
```

> Para el envío de correos con Gmail, activa la autenticación en 2 pasos y genera una [contraseña de aplicación](https://myaccount.google.com/apppasswords).

### Servicios disponibles

| Servicio | URL |
|---|---|
| Frontend (Vite) | http://localhost:5173 |
| Backend (API) | http://localhost:3000 |
| MariaDB | localhost:3306 |

### Parar el proyecto

```powershell
# Windows
.\stop.ps1          # Para los contenedores (conserva la BD)
.\stop.ps1 -Clean   # Para y elimina los datos
```

```bash
# Linux / macOS
./stop.sh
./stop.sh --clean
```

---

## Estructura de carpetas

```
Trabajo-Final-DAW2/
├── docker-compose.yml
├── start.ps1 / start.sh
├── stop.ps1 / stop.sh
│
├── backend/                    # API REST (Express + TypeScript)
│   ├── prisma/
│   │   ├── schema.prisma       # Modelo de datos
│   │   ├── seed.ts             # Datos de ejemplo
│   │   └── migrations/
│   └── src/
│       ├── app.ts
│       ├── config/             # Prisma client, JWT
│       ├── controllers/        # Request -> Service -> Response JSON
│       │   └── admin/
│       ├── middlewares/        # Auth, bloqueos, validación, errores
│       ├── routes/
│       │   └── admin/
│       ├── services/           # Lógica de negocio y acceso a datos
│       │   └── admin/
│       ├── types/
│       ├── utils/
│       └── validators/         # Esquemas Zod
│
└── secure-tenis/               # SPA (Vue 3 + Vite + TypeScript)
    └── src/
        ├── App.vue
        ├── main.ts
        ├── layouts/
        ├── modules/            # Organización por dominio funcional
        │   ├── auth/
        │   ├── cart/
        │   ├── checkout/
        │   ├── home/
        │   ├── products/
        │   └── admin/
        ├── router/             # Guards de autenticación y rol
        ├── services/           # apiClient.ts (fetch wrapper)
        ├── stores/             # authStore, cartStore
        └── types/
```

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

---

<div align="center">

Proyecto académico · **Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW)** · 2025–2026

</div>
