# Gestión de Ventas e Instalaciones – API REST

> **Trabajo Práctico – Arquitectura Web**  
> **Estado:** Diseño inicial

## 📌 Descripción
API REST para gestionar el flujo de **ventas de muebles a medida** y el **seguimiento de instalación**. El alcance de la primera entrega se centra en:
- CRUD básico de **Ventas** (4 endpoints principales).
- Dos servicios de **reporte/seguimiento** adicionales sobre ventas.
- Persistencia **en memoria** con **datos semilla** al iniciar (sin base de datos real). 

> El frontend es opcional y se abordará al final si el tiempo lo permite. La API se puede probar con curl/Postman/Insomnia.

---

## 🧱 Arquitectura y elecciones técnicas
- **Backend:** Node.js + Express (REST Nivel 2, simple y estándar del ecosistema JS).
- **Lenguaje:** JavaScript (recomendado por la cátedra; facilita pruebas con herramientas del ecosistema Node).
- **Persistencia:** En memoria (arrays/objetos). Se cargan **datos de prueba** automáticamente.
- **Testing:** Jest + Supertest (tests de endpoints), y/o colección para Postman/Insomnia.

**Justificación:** Reducimos complejidad (sin DB ni auth) para enfocarnos en el diseño REST, manejo de HTTP y buenas prácticas.

---

## ¿CÓMO LEVANTAR EL SISTEMA?

🔥 BACKEND (Puerto 3000):
--------------------------

1) npm install
2) node index.js

El servidor estará corriendo en: http://localhost:3000

---

## 📚 Modelo (resumen)
- **Venta** `{ id, cliente, vendedor, instalador, fechas..., estado, notas }`
  - Fechas relevantes: `fechaMedicion`, `fechaAprobacionCliente`, `fechaPedidoFabrica`, `fechaAvisoInstalador`, `fechaEntregaCliente`, `fechaInstalacion`.
  - `estado` puede derivarse a partir de las fechas (p. ej. `produccion`, `asignada-instalador`, `en-entrega`, `instalada`, etc.).

---

## 🔗 Endpoints (alcance de esta entrega)
Base URL: `/api`

### 1) **Ventas (CRUD)**
- `GET /api/ventas` → **Listar** ventas.
- `POST /api/ventas` → **Crear** venta.
- `PUT /api/ventas/:id` → **Actualizar** venta.
- `DELETE /api/ventas/:id` → **Borrar** venta.

**Ejemplo de Venta**
```json
{
  "id": "v-001",
  "cliente": "Juana Pérez",
  "vendedor": "Carlos López",
  "instalador": "Pedro Ruiz",
  "fechaMedicion": "2025-10-05",
  "fechaAprobacionCliente": "2025-10-10",
  "fechaPedidoFabrica": "2025-10-12",
  "fechaAvisoInstalador": "2025-10-15",
  "fechaEntregaCliente": "2025-10-25",
  "fechaInstalacion": "2025-10-28",
  "estado": "instalada",
  "notas": "Cocina en L blanca"
}
```

### 2) **Servicios extra sobre Ventas (reportes)**
- `GET /api/proximas-instalaciones/dias`
  - Devuelve ventas cuya `fechaInstalacion` ocurre dentro de los próximos **N días** (por defecto 7).
- `GET /api/instalaciones-atrasadas`
  - Devuelve ventas cuyo `fechaInstalacion` es anterior a la fecha actual y estado sea distinto de **instalada**.

---

## 🔍 Contratos (requests/responses de ejemplo)

### `GET /api/ventas`
**200 OK**
```json
[
  {"id":"v-001","cliente":"Juana Pérez","vendedor":"Carlos López","estado":"produccion"},
  {"id":"v-002","cliente":"Ana Gómez","vendedor":"Marcos Díaz","estado":"en-entrega"}
]
```

### `POST /api/ventas`
**Request**
```json
{
  "cliente": "Ana Gómez",
  "vendedor": "Marcos Díaz",
  "fechaMedicion": "2025-10-10",
  "notas": "Placard dormitorio"
}
```
**201 Created**
```json
{
  "id": "v-010",
  "cliente": "Ana Gómez",
  "vendedor": "Marcos Díaz",
  "fechaMedicion": "2025-10-10",
  "estado": "medicion-pendiente",
  "notas": "Placard dormitorio"
}
```

### `PUT /api/ventas/:id`
**Request**
```json
{
  "fechaPedidoFabrica": "2025-10-12",
  "estado": "produccion"
}
```
**200 OK**
```json
{
  "id": "v-010",
  "cliente": "Ana Gómez",
  "vendedor": "Marcos Díaz",
  "estado": "produccion",
  "fechaPedidoFabrica": "2025-10-12"
}
```

### `DELETE /api/ventas/:id`
**204 No Content** (sin cuerpo)

---

### `GET /api/ventas/proximas-instalaciones?dias=7`
**200 OK**
```json
{
  "dias": 7,
  "items": [
    {
      "id": "v-003",
      "cliente": "Juana Pérez",
      "fechaInstalacion": "2025-11-02",
      "estado": "asignada-instalador"
    }
  ]
}
```

### `GET /api/ventas/atrasadas?campo=fechaInstalacion`
**200 OK**
```json
{
  "campo": "fechaInstalacion",
  "items": [
    { "id": "v-007", "cliente": "Carlos López", "fechaInstalacion": "2025-10-10", "estado": "en-entrega" }
  ]
}
```

---

## ⚠️ Errores (formato estándar)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "cliente es requerido",
    "details": [{"field":"cliente","issue":"required"}]
  }
}
```
- `400` (validación), `404` (no encontrado), `409` (conflicto), `500` (error inesperado).

---

## ▶️ Cómo ejecutar
1. Requisitos: Node 18+.
2. Instalar dependencias:
```bash
npm install
```
3. Ejecutar en desarrollo:
```bash
npm run dev
```
4. Producción/simple:
```bash
npm start
```

El servidor por defecto levantará en `http://localhost:3000` con datos semilla cargados.

---

## 🧪 Cómo probar (curl / Postman)
```bash
# Listar ventas
curl -s http://localhost:3000/api/ventas | jq

# Crear venta
curl -s -X POST http://localhost:3000/api/ventas \
  -H "Content-Type: application/json" \
  -d '{"cliente":"Ana Gómez","vendedor":"Marcos Díaz","fechaMedicion":"2025-10-10","notas":"Placard dormitorio"}' | jq

# Actualizar venta
curl -s -X PUT http://localhost:3000/api/ventas/v-010 \
  -H "Content-Type: application/json" \
  -d '{"fechaPedidoFabrica":"2025-10-12","estado":"produccion"}' | jq

# Borrar venta
curl -s -X DELETE http://localhost:3000/api/ventas/v-010 -i

# Próximas instalaciones (7 días)
curl -s "http://localhost:3000/api/ventas/proximas-instalaciones?dias=7" | jq

# Ventas atrasadas por fechaInstalacion
curl -s "http://localhost:3000/api/ventas/atrasadas?campo=fechaInstalacion" | jq
```

---

## 🗂️ Estructura del repo (prevista)
```
/ (raíz)
├─ package.json
├─ README.md
├─ src/
│  ├─ app.js
│  ├─ server.js
│  ├─ data/
│  │  ├─ db.js        # arrays en memoria
│  │  └─ seed.js      # datos semilla (ventas)
│  ├─ routes/
│  │  └─ ventas.routes.js
│  ├─ controllers/
│  │  └─ ventas.controller.js
│  ├─ services/
│  │  └─ ventas.service.js  # lógica de CRUD, proximidad/atraso y cálculo de estado
│  └─ middleware/
│     └─ error-handler.js
└─ tests/
   ├─ ventas.crud.test.js
   └─ ventas-reportes.test.js
```

---

## 🧪 Testing
- **Automatizado:** Jest + Supertest (endpoints). Casos mínimos:
  - Crear venta (201), validar requeridos (400), actualizar (200), borrar (204), 404 para id inexistente.
  - Reportes: proximas-instalaciones devuelve items en ventana; atrasadas según `campo`.
- **Manual:** Colección Postman/Insomnia (se incluirá en `/docs/postman_collection.json`).

---

## 📝 Licencia
MIT.

---

## 📍 Roadmap corto
- [ ] Implementar endpoints definidos.
- [ ] Agregar filtros en `GET /api/ventas` (`?cliente=` o `?vendedor=`).
- [ ] Documentación Swagger (opcional).
- [ ] Front minimal (tabla ventas + dos reportes).

