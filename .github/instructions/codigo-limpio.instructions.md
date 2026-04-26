---
description: "Usa cuando escribas, modifiques o revises código TypeScript o Vue. Aplica estilo limpio: sin código muerto, sin comentarios de instrucción, bloques ordenados, comentarios en español, gestión de errores y casing del proyecto."
applyTo: "**/*.{ts,vue,tsx}"
---

# Estilo de Código: Limpio, Ordenado y Funcional

## Principios generales

- Escribe **siempre código funcional y limpio**; si una función no se usa, no la incluyas.
- **No dejes código muerto**: sin variables no usadas, sin imports no usados, sin bloques comentados que resten claridad.
- **No añadas comentarios que expliquen la instrucción en sí** (p.ej. `// Añadido por instrucción de estilo`). Los comentarios deben explicar la lógica del negocio, no la razón de la edición.
- Cada edición debe dejar el archivo en mejor estado que antes. Si tocas un bloque, déjalo limpio.

## Convención de nombres (casing)

Ajusta siempre el casing al ya existente en el proyecto:

| Entidad | Convención |
|---------|-----------|
| Variables y funciones | `camelCase` |
| Clases, tipos e interfaces | `PascalCase` |
| Constantes globales/de entorno | `UPPER_SNAKE_CASE` |
| Componentes Vue | `PascalCase` (nombre de archivo y `<script>`) |
| Rutas de archivo | `kebab-case` cuando sean nuevos archivos |

No mezcles convenciones dentro del mismo archivo. Si detectas inconsistencias en código existente que **no** estás modificando, no las cambies salvo que se te pida explícitamente.

## Orden de bloques dentro de un archivo

### TypeScript (backend/services/controllers)

1. Imports externos (librerías de terceros)
2. Imports internos (módulos del proyecto, con alias `@` o rutas relativas)
3. Tipos e interfaces locales
4. Constantes del módulo
5. Lógica principal (funciones, clases, handlers)
6. Exports

### Vue (SFC)

1. `<script setup lang="ts">` con el siguiente orden interno:
   - Imports
   - Props y emits
   - Stores y composables
   - Estado reactivo (`ref`, `reactive`, `computed`)
   - Funciones y handlers
   - Lifecycle hooks (`onMounted`, etc.)
2. `<template>`
3. `<style scoped>`

## Comentarios en español

- Añade **un comentario en español al comienzo de cada bloque lógico** que explique su función.
- El comentario debe describir **qué hace** el bloque, no el cómo (el código lo explica por sí solo).
- Usa comentarios de línea `//` para bloques breves y comentarios de bloque `/* */` solo si el bloque es especialmente complejo o requiere contexto adicional.
- **No** traduzcas ni modifiques comentarios existentes en inglés de librerías o código que no sea tuyo.

```ts
// Obtiene el usuario activo y verifica que tenga permisos de administrador
const usuario = await usuarioService.obtenerPorId(id);
if (!usuario?.esAdmin) throw Object.assign(new Error('Acceso denegado'), { statusCode: 403 });
```

## Gestión de errores

### Backend (Express / Prisma)

- Envuelve siempre la lógica de controladores en `try/catch`.
- Propaga errores con `next(err)` usando `statusCode` para que el middleware de errores los capture.
- No silencies errores con `catch(() => {})` vacío.

```ts
// Gestión de errores del controlador
try {
  const resultado = await servicio.ejecutar(datos);
  res.status(200).json(resultado);
} catch (error) {
  next(error);
}
```

### Frontend (Vue / Pinia)

- Captura errores en `try/catch` dentro de las acciones del store o composables.
- Almacena el mensaje de error en un `ref<string | null>` y exponlo en el estado.
- Limpia el error al inicio de cada acción antes de ejecutar lógica nueva.

```ts
// Restablece el estado de error antes de la operación
error.value = null;
try {
  const datos = await servicio.obtener();
  items.value = datos;
} catch (e) {
  error.value = e instanceof Error ? e.message : 'Error inesperado';
}
```

## Imports

- Agrupa imports: primero externos (librerías), luego internos (proyecto).
- Usa `import type { ... }` para importar solo tipos.
- Elimina cualquier import que no se use en el archivo.
- En el frontend usa el alias `@` para rutas absolutas; en el backend usa rutas relativas.

## Lo que nunca debe aparecer en el código generado

- Bloques de código comentados que no aporten valor (`// const foo = ...`)
- Variables declaradas pero no usadas
- Funciones definidas pero nunca llamadas
- `console.log` de depuración en código de producción
- Comentarios que expliquen por qué se hizo un cambio en base a esta instrucción
