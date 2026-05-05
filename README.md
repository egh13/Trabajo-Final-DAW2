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


## 🚀 Despliegue Local con Docker

### Requisitos previos

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución.

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Trabajo-Final-DAW2
```

### 2. Configurar variables de entorno del backend

Copia el archivo de ejemplo y edítalo con tus valores:

```bash
cp backend/.env.example backend/.env
```

Edita `backend/.env`:

```env
PORT=3000
JWT_SECRET=tu_secreto_seguro
JWT_EXPIRES_IN=24h
DATABASE_URL=mysql://username:password@mariadb:3306/mydb
DATABASE_USER=username
DATABASE_PASSWORD=password
DATABASE_NAME=mydb
DATABASE_HOST=mariadb
DATABASE_PORT=3306

# Configuración SMTP para envío de correos (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
FRONTEND_URL=http://localhost:5173
```

### Configuración de envío de correos (opcional)

Para habilitar el envío automático de correos de bienvenida a nuevos usuarios:

1. **Gmail SMTP**: Crea una "contraseña de aplicación" en tu cuenta Google:
   - Ve a [Google Account Settings](https://myaccount.google.com/)
   - Activa la autenticación de 2 factores
   - Genera una "contraseña de aplicación" para usar como `SMTP_PASS`

2. **Otros proveedores SMTP**: Ajusta las variables según tu proveedor:
   - Outlook/Hotmail: `SMTP_HOST=smtp-mail.outlook.com`, `SMTP_PORT=587`
   - Yahoo: `SMTP_HOST=smtp.mail.yahoo.com`, `SMTP_PORT=587`

> ⚠️ Las credenciales deben coincidir con las del servicio `mariadb` en `docker-compose.yml`.

### 3. Levantar el backend + MariaDB

Desde la raíz del proyecto:

```bash
docker compose up --build
```

Esto realiza automáticamente:
1. Construcción de la imagen del backend
2. Arranque del contenedor de MariaDB
3. Aplicación de las migraciones (`prisma migrate deploy`)
4. Inicio del servidor Express en el puerto `3000`

### 4. Poblar la base de datos (seed)

Una vez los contenedores estén en ejecución:

```bash
docker exec tfg-backend npx ts-node prisma/seed.ts
```

Esto insertará categorías, usuarios y productos de ejemplo.

### 5. Ejecutar el frontend en local

```bash
cd secure-tenis
npm install
npm run dev
```

### Servicios disponibles

| Servicio | URL |
|---|---|
| Backend | http://localhost:3000 |
| MariaDB | localhost:3306 |
| Frontend | http://localhost:5173 |

### Parar los contenedores

```bash
# Solo parar
docker compose down

# Parar y eliminar datos de la BD
docker compose down -v
```

---

## Despliegue Final

### Frontend
* Vercel
### Backend (Servidor + Base de datos)
* Render o Railway
