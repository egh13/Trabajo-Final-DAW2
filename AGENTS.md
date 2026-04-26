# SecureTenis — Guía para Agentes de IA

Ecommerce de zapatillas desarrollado como TFG de 2º DAW. Arquitectura cliente-servidor desacoplada.

- **Backend:** Express + TypeScript + Prisma + MariaDB → `backend/`
- **Frontend:** Vue 3 + Pinia + TypeScript + Bootstrap 5 → `secure-tenis/`
- **Despliegue:** Docker Compose (MariaDB + Backend)

## Comandos de Desarrollo

### Backend (`backend/`)
```bash
npm run dev     # nodemon + ts-node, puerto 3000
npm run seed    # Poblar base de datos (prisma/seed.ts)
```

### Frontend (`secure-tenis/`)
```bash
npm run dev        # Vite dev server
npm run build      # Compilación producción
npm run type-check # vue-tsc validación de tipos
npm run format     # prettier --write
```

### Docker
```bash
docker-compose up   # Inicia MariaDB (3306) + Backend (3000)
```

## Arquitectura

### Backend — Capas

| Capa | Carpeta | Responsabilidad |
|---|---|---|
| Routes | `src/routes/` | Registro de endpoints + aplicación de middlewares |
| Controllers | `src/controllers/` | Recibir petición, llamar servicio, devolver respuesta JSON |
| Services | `src/services/` | Lógica de negocio, acceso a Prisma |
| Validators | `src/validators/` | Esquemas Zod aplicados vía middleware `validate()` |
| Middlewares | `src/middlewares/` | `authenticate`, `authorize`, `validate`, `errorHandler` |
| Types | `src/types/index.ts` | Interfaces y tipos compartidos |

**Patrón de ruta:**
```typescript
router.post('/register', validate(registerSchema), register)
router.get('/me', authenticate, getMe)
router.delete('/admin/:id', authenticate, authorize('admin'), deleteUser)
```

### Frontend — Módulos

```
src/modules/<dominio>/
  views/        # Páginas (componentes raíz de ruta)
  services/     # Llamadas a la API
  composables/  # Lógica reactiva reutilizable
```

**Patrón de store (Pinia):** Setup stores con `defineStore` usando Composition API.

## Convenciones de Nombrado

### Backend y Frontend (TypeScript)
| Elemento | Estilo | Ejemplo |
|---|---|---|
| Variables y funciones | `camelCase` | `addToCart`, `findByEmail` |
| Tipos e interfaces | `PascalCase` | `User`, `ApiResponse<T>` |
| Constantes globales | `UPPER_SNAKE_CASE` | `SALT_ROUNDS` |
| Archivos | `camelCase.ts` | `authService.ts` |

### Frontend (Vue)
| Elemento | Estilo | Ejemplo |
|---|---|---|
| Componentes SFC | `PascalCase.vue` | `LoginView.vue`, `Navbar.vue` |
| Handlers de eventos | `handle` + acción | `handleLogin`, `handleSubmit` |
| Variables reactivas | `camelCase` | `form`, `loading`, `error` |
| Computed | `camelCase` descriptivo | `isAuthenticated`, `itemCount` |

## Flujo de Autenticación

1. Login/Register → Backend genera JWT (`userId`, `email`, `role`)
2. Frontend almacena token en `localStorage` bajo `auth_token`
3. Router guard verifica token; si no hay usuario, llama `fetchMe()`
4. Al autenticarse, carrito anónimo (por `session_id`) se fusiona con el del usuario

**Mapeo de roles:**
- Frontend: `'cliente' | 'admin' | 'analista'`
- Base de datos: `'CLIENT' | 'ADMIN' | 'ANALYST'`
- Los servicios backend convierten con `roleMapFromDB` / `roleMapToDB`

## Formato de Respuesta API

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: unknown
}
```

**Códigos HTTP usados:** `200`, `201`, `400`, `401`, `403`, `404`, `409`, `500`

## Reglas de Calidad de Código

Ver instrucciones detalladas en [.github/instructions/codigo-limpio.instructions.md](.github/instructions/codigo-limpio.instructions.md).

Resumen de reglas obligatorias:
- Comentarios en **español** al inicio de cada bloque explicando su función
- Sin código muerto ni imports no usados
- Gestión de errores explícita en cada operación async
- Bloques ordenados según la convención del fichero (ver instrucciones)
- Variables nombradas según el casing del proyecto
