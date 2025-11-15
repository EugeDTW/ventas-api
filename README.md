# Gestión de Ventas e Instalaciones – API REST

> **Trabajo Práctico – Arquitectura Web**  
> **Estado:** Implementación inicial (persistencia en memoria)

## 📌 Descripción

API REST para gestionar el flujo de ventas de muebles a medida y el seguimiento de instalaciones.

Incluye:

- CRUD completo de Ventas.

- Servicios de reportes sobre fechas de instalación.

P- ersistencia en memoria con datos semilla.

- Backend en Node.js + Express.

- Frontend (HTML + JS simple).

Ideal para pruebas con Postman / Insomnia / curl.
Sin base de datos por el momento.

---

## 🧱 Arquitectura y tecnologías

Backend: Node.js + Express

Lenguaje: JavaScript (CommonJS)

Middlewares:

body-parser (JSON / urlencoded)

cors

Persistencia: En memoria (vector dentro de index.js)

Frontend: Vanilla JavaScript

Puerto por defecto: 3000

---

## 🚀 ¿Cómo levantar el backend?
1) npm install
2) node index.js


Servidor disponible en:

http://localhost:3000

##🌐 Frontend (opcional)

Con el backend corriendo

Abrir el archivo: /FrontEnd/index.html
Se ejecuta directamente en el navegador (Chrome, Firefox, etc.).

---

## 📚 Modelo de datos: Venta
{
  "id": "1",
  "cliente": "Juana Pérez",
  "vendedor": "Carlos López",
  "instalador": "Pedro Ruiz",
  "fechaMedicion": "2025-10-05",
  "fechaAprobacionCliente": "2025-10-10",
  "fechaPedidoFabrica": "2025-08-12",
  "fechaAvisoInstalador": "2025-10-15",
  "fechaEntregaCliente": "2025-10-05",
  "fechaInstalacion": "2025-11-10",
  "estado": "instalada",
  "notas": "Cocina en L blanca"
}


📌 Fechas en formato YYYY-MM-DD
📌 Estado puede ser "pendiente" o "instalada"

🔗 Endpoints

Base URL:

http://localhost:3000/api

## 🔧 1) CRUD de Ventas
✅ GET /api/ventas

Lista todas las ventas.

200 OK → devuelve un array completo de ventas.

✅ GET /api/ventas/:id

Busca una venta por ID.

200 OK

404 Not Found

{ "mensaje": "venta no encontrada" }

✅ POST /api/ventas

Crea una nueva venta.
El backend genera el id automáticamente.

Request ejemplo:

{
  "cliente": "Ana Gómez",
  "vendedor": "Marcos Díaz",
  "instalador": "Pablo Ruiz",
  "fechaMedicion": "2025-10-10",
  "fechaInstalacion": "2025-11-20",
  "estado": "pendiente",
  "notas": "Placard dormitorio"
}


201 Created

{ "mensaje": "venta creada" }

✅ PUT /api/ventas/:id

Reemplaza completamente una venta existente.

📌 El body se inserta tal cual, por lo que debe incluir el id.

200 OK → Devuelve el body enviado
404 Not Found

✅ DELETE /api/ventas/:id

Elimina una venta.

200 OK

{ "mensaje": "venta borrada" }


404 Not Found

{ "mensaje": "venta no encontrada" }

## 📊 2) Servicios extra (reportes)
🔮 GET /api/ventas/proximas-instalaciones/:dias?

Devuelve ventas con instalación dentro de los próximos N días.
Si no se envía parámetro → dias = 7.

Filtros aplicados internamente:

0 < fechaInstalacion - hoy < dias

estado === "pendiente"

Ejemplos:

GET /api/ventas/proximas-instalaciones
GET /api/ventas/proximas-instalaciones/15


200 OK → array de ventas

⏰ GET /api/ventas/instalaciones-atrasadas

Devuelve ventas donde:

fechaInstalacion < hoy

estado !== "instalada"

200 OK → array de ventas atrasadas

## ⚠️ Manejo de errores (actual)

Formato simple:

{
  "mensaje": "venta no encontrada"
}


Códigos usados:

200 — OK

201 — Created

404 — Not Found

Actualmente no hay validaciones avanzadas ni formato de error estándar.

## 📦 Estructura del proyecto
/api
  index.js
/FrontEnd
  index.html
README.md
package.json

## 🛠️ Mejoras futuras sugeridas

Estandarizar respuestas ({ data, error })

Validaciones con Joi / Zod

División en rutas + controladores

Documentación Swagger/OpenAPI

Migrar persistencia a base de datos (PostgreSQL / MongoDB)
