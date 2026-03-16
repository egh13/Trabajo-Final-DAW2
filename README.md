# SecureTenis – Ecommerce de Zapatillas
Proyecto desarrollado como Trabajo de Fin de Grado (TFG) para 2º de Desarrollo de Aplicaciones Web (DAW).

## Descripción del Proyecto

* Aplicación ecommerce completamente funcional especializada en la venta de zapatillas.
*  Especial hincapié en el uso de buenas prácticas en cuanto a la seguridad de la web.

## Arquitectura del Proyecto

La aplicación sigue una arquitectura cliente-servidor desacoplada.

* Frontend: Vue.js aplicando el patrón de diseño MVVM (Model–View–ViewModel).
  - Estilos mediante la librería bootstrap
* Backend: Express.js sobre el entorno Node.js
  - Comunicación mediante endpoints API REST.
  - Base de datos relacional con SQLite3.
 
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
* Base de Datos con SQLite3
  -  Implementacion de seeders para poblar la DB

## Despliegue Final

### Frontend
* Vercel
### Backend (Servidor + Base de datos)
* Render o Railway

## Reparto de Tareas para Desarrollo

> Poner una X cuando se complete la tarea.
## Frontend
### Paginas
- [ ] Página de Inicio – listado de productos destacados, banner
- [ ] Página de Productos (poder filtrar y paginacion)
- [ ] Página para producto individual
- [ ] Página carrito de compras
- [ ] Página Checkout (Sin pasarela de pago)
- [ ] Página panel de Usuario -> CRUD usuario usando API
- [ ] Página panel de Administrador -> CRUD administrador

## Backend
- [ ] CRUD usuarios -> Register, Login, Eliminar y Actualizar
- [ ] CRUD carrito
- [ ] CRUD productos -> panel de administracion
- [ ] Login y autenticación usando JWT (usando middleware)
- [ ] Roles de cliente y administrador (usando middleware)

