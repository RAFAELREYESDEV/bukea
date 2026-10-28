# ⚙️ Bookealo Core Engine — Backend & Integrations (Rol 3)

Backend central y arquitectura relacional de Bookealo para la gestión de reservas de estatus, slots de disponibilidad, CRM con scoring de comensales, bot LLM de Google Maps e infraestructura de mesas NFC.

---

## 🚀 Inicio Rápido

### 1. Iniciar en Modo Desarrollo (con Live Reload)
```bash
cd backend
npm run dev
```

### 2. Sembrar la Base de Datos con Datos de Prueba
```bash
npm run seed
```

El servidor quedará disponible en:
👉 **http://localhost:4000** (Dashboard interactivo y explorador de API)

---

## 📡 Endpoints del Motor (Semana 1)

### 1. 🍽️ Restaurantes
* `GET /api/restaurants`: Listado de restaurantes filtrable por `tier` y `category`.
* `GET /api/restaurants/:idOrSlug`: Detalle de restaurante con zonas y estadísticas de aforo.
* `GET /api/restaurants/:id/tables`: Lista de mesas por zona y capacidad.

### 2. 📅 Motor de Reservas & Disponibilidad
* `GET /api/reservations/availability/:restaurantId?date=YYYY-MM-DD&partySize=4`:
  * Calcula slots de tiempo disponibles según horarios de apertura/cierre.
  * Verifica colisiones con reservas activas (intervalos de 90 min).
  * Retorna mesas óptimas y previene overbooking.
* `POST /api/reservations`:
  * Crea una reserva confirmada, asigna la mesa ideal y registra al comensal en el CRM.
  * Genera código de tracking `BK-XXXX`.
* `GET /api/reservations/:code`: Consulta detalle de la reserva por código.
* `PATCH /api/reservations/:code/status`: Actualiza estado (`confirmed`, `seated`, `completed`, `cancelled`).

### 3. 👤 CRM & Inteligencia de Clientes
* `GET /api/crm`: Listado de clientes ordenados por LTV / gasto total y número de visitas.
* `GET /api/crm/:id`: Ficha de cliente con historial completo de reservas y preferencias.
* `PATCH /api/crm/:id/vip`: Asignación de nivel VIP (`STANDARD`, `SILVER`, `GOLD`, `BLACK_EMPEROR`).

### 4. 🤖 Bot de Reseñas de Google Maps (LLM)
* `GET /api/reviews`: Reseñas registradas y estado de respuesta.
* `POST /api/reviews/webhook`: Ingestión de reseñas desde Google Maps / n8n.
* `POST /api/reviews/:id/generate-ai-reply`: Genera respuesta sofisticada de alta hospitalidad usando IA (Gemini API o heurística Bookealo).
* `POST /api/reviews/:id/publish`: Aprueba y publica la respuesta en Google Maps.

### 5. ⚡ Módulo NFC en Mesa
* `GET /api/nfc/resolve/:nfcUid`: Simula el escaneo o tap de un chip NFC físico en mesa, devolviendo el restaurante, número de mesa y sesión activa de comensales.

---

## 🛡️ Protocolo Git
* **Rama:** `feat/rol3-backend-core`
* **Nunca hacer push a:** `main`
* **Sincronización:** `git pull origin main` antes de iniciar cada ciclo de desarrollo.
