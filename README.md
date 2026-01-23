# Trabajo-Final-DAW2
### Hecho por Mario Muela, Daniel Gatón y Eric García


# Proyecto Final DAW2 – Ciberseguridad y Protección de Datos

## 📌 Descripción general

Este proyecto consiste en el desarrollo de una **página web tipo ecommerce** cuyo objetivo principal es **demostrar y analizar vulnerabilidades web comunes**, aplicadas a un entorno controlado y educativo.

La aplicación simula una tienda online funcional, pero contiene **vulnerabilidades intencionadas** para poder estudiarlas, explotarlas y posteriormente proponer medidas de mitigación, todo ello enfocado al ámbito de la **ciberseguridad y la protección de datos**.

> ⚠️ **Aviso importante:** Este proyecto es exclusivamente educativo. No debe desplegarse en entornos reales ni utilizarse con fines maliciosos.

---

## 🎯 Objetivos del proyecto

* Comprender el funcionamiento de vulnerabilidades web comunes.
* Identificar riesgos de seguridad en aplicaciones web.
* Analizar el impacto de estas vulnerabilidades en la protección de datos.
* Proponer y documentar medidas de mitigación.
* Aplicar conocimientos de DAW2 (backend, frontend, bases de datos y seguridad).

---

## 🛒 Descripción de la aplicación (Ecommerce)

La web representa una **tienda online** con las siguientes funcionalidades básicas:

* Catálogo de productos
* Buscador de productos
* Sistema de usuarios (registro / login)
* Carrito de la compra
* Proceso de compra
* Panel de administración básico

Estas funcionalidades serán el punto de entrada para introducir distintas vulnerabilidades.

---

## 🧨 Vulnerabilidades a demostrar

La aplicación incluirá, de forma intencionada, las siguientes vulnerabilidades:

### 1. SQL Injection (SQLi)

* Formularios de login vulnerables
* Búsquedas sin consultas preparadas
* Manipulación de parámetros GET/POST

**Objetivo:**

* Acceso no autorizado
* Obtención de datos sensibles

---

### 2. Remote Code Execution (RCE)

* Subida insegura de archivos
* Ejecución de comandos del sistema desde el servidor

**Objetivo:**

* Demostrar el riesgo de ejecución remota de código

---

### 3. Server-Side Template Injection (SSTI)

* Uso inseguro de motores de plantillas
* Entrada de usuario renderizada sin sanitización

**Objetivo:**

* Acceso a variables internas
* Ejecución de código del lado servidor

---

### 4. Vulnerabilidades de negocio (Business Logic Vulnerabilities)

* Manipulación de precios
* Bypass del proceso de compra
* Uso indebido de cupones o descuentos

**Objetivo:**

* Mostrar fallos de lógica que no dependen de errores técnicos

---

## 🗂️ Estructura del proyecto

```
/raiz-del-proyecto
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── config/
│
├── frontend/
│   ├── css/
│   ├── js/
│   └── views/
│
├── database/
│   ├── schema.sql
│   └── data.sql
│
├── vulnerabilities/
│   ├── sqli.md
│   ├── rce.md
│   ├── ssti.md
│   └── business_logic.md
│
├── docs/
│   ├── analisis_riesgos.md
│   ├── mitigaciones.md
│   └── proteccion_datos.md
│
├── README.md
└── .env
```

---

## 🧪 Metodología de trabajo

1. **Diseño del ecommerce**

   * Maquetación y flujo de usuario

2. **Implementación funcional**

   * Funcionalidades básicas operativas

3. **Introducción de vulnerabilidades**

   * Implementación intencionada y documentada

4. **Explotación controlada**

   * Pruebas y demostraciones

5. **Análisis de impacto**

   * Riesgos sobre datos personales

6. **Propuesta de mitigaciones**

   * Buenas prácticas y soluciones

---

## 🔐 Protección de datos

El proyecto incluye un análisis sobre:

* Datos personales tratados (usuarios, pedidos, pagos simulados)
* Riesgos asociados a cada vulnerabilidad
* Relación con RGPD / LOPDGDD
* Medidas técnicas y organizativas recomendadas

---

## 🛠️ Tecnologías sugeridas

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** PHP / Node.js / Python (según preferencia)
* **Base de datos:** MySQL / MariaDB
* **Servidor:** Apache / Nginx

---

## 📚 Documentación

Toda la documentación de vulnerabilidades y mitigaciones se encuentra en la carpeta `/docs` y `/vulnerabilities`.

---

## 👨‍🎓 Autor

Proyecto realizado como **Proyecto Final de DAW2** con fines educativos.

---

## ⚠️ Disclaimer

Este proyecto contiene vulnerabilidades de forma deliberada. **No debe utilizarse en producción ni exponerse a Internet.**
