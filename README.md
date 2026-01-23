
![Título](https://i.imgur.com/J377FxI.png)

![Status](https://img.shields.io/badge/Status-Educational-orange) ![Vulnerabilities](https://img.shields.io/badge/Vulnerabilities-Intentionally%20Broken-red)

> **Hecho por:** Mario Muela, Daniel Gatón y Eric García

Ecommerce educativo diseñado específicamente con **vulnerabilidades intencionadas** para demostrar riesgos de ciberseguridad (SQLi, XSS, RCE) y analizar su impacto en la protección de datos. **¡No usar en producción!**

---

## Quick Start

¡Pon la tienda en marcha en segundos!

```bash
cd sitio-malo.com
npm install
npm run dev
```
La aplicación estará disponible en `http://sitio-malo.com`

---

## 🧨 Vulnerabilidades Incluidas

Explora, explota y aprende.

| Vulnerabilidad | Descripción | Objetivo del Atacante |
| :--- | :--- | :--- |
| **SQL Injection (SQLi)** | Formularios y búsquedas sin sanitizar. | Acceso no autorizado, robo de datos. |
| **RCE** | Subida de archivos insegura. | Ejecución remota de comandos en el servidor. |
| **SSTI** | Inyección en motores de plantillas. | Lectura de archivos internos, ejecución de código. |
| **Business Logic** | Manipulación de precios y cupones. | Comprar gratis o modificar el flujo de negocio. |

---

## 🗂️ Estructura Clave

- **`sitio-malo.com/`**: Código fuente de la aplicación (Frontend + Backend simulado).
- **`docs/`**: Documentación teórica, análisis de riesgos y mitigaciones.
- **`vulnerabilities/`**: Guías paso a paso para explotar cada fallo.

---

> ⚠️ **Disclaimer:** Este software contiene fallos de seguridad graves deliberados. Úsalo únicamente en entornos controlados y aislados con fines educativos.
