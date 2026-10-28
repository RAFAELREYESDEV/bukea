# 📑 Memoria Técnica del Proyecto: Bookealo (v1.0)
**Autor:** Hamad El Troudi (`hamadtm07`)  
**Rol Asignado:** Rol 3 — Backend & Integrations Engineer  
**Rama de Trabajo:** `feat/rol3-backend-core`  
**Repositorio Remoto:** [github.com/RAFAELREYESDEV/bukea.git](https://github.com/RAFAELREYESDEV/bukea.git)  
**Fecha:** 28 de Octubre de 2026  
**Entorno Local:** Windows 11 / Node.js v22.22.0 / Laragon / SQLite Nativo  

---

## 1. 🎯 Contexto del Proyecto & Misión

**Bookealo** es un ecosistema digital de alta gama diseñado para transformar la gestión tradicional de reservas en una experiencia de estatus, precisión táctica y digitalización espacial integral (Fotos 360°, Menús AR, chips NFC por mesa y suite POS/KDS all-in-one).

### Modelo de Negocio por Tiers (Suscripción)
* **Tier 1 ($40/mes):** Ficha comercial optimizada, motor de reservas directas, CRM inicial de comensales y Bot LLM para responder reseñas de Google Maps.
* **Tier 2 ($60/mes):** Todo lo de Tier 1 + Fotografías 360°, generador de pases para Apple/Google Wallet (RSVP) y kit de 12 chips NFC para mesas.
* **Tier 3 ($100/mes):** Todo lo anterior + Tour virtual 360° interactivo, menú en Realidad Aumentada (3DGS/AR), suite operativa interna (POS + KDS Kamra), orquestador de pagos y scoring predictivo de LTV.

---

## 2. 🛡️ Protocolo Git Flow & Cumplimiento de Reglas

Siguiendo el manual obligatorio del equipo ([`TEAM_WORKFLOW.md`](file:///c:/Users/Hamad%20El%20Troudi/Desktop/Bookea/docs/TEAM_WORKFLOW.md)):
1. **Regla de Oro #1:** **Cero push directo a `main`**. La rama `main` alimenta automáticamente la web en producción de Cloudflare Pages (`https://bukea.inkbytecorpore.workers.dev`).
2. **Aislamiento por Rol:** Todo el trabajo de backend se desarrolló y encapsuló de forma modular dentro del directorio [`backend/`](file:///c:/Users/Hamad%20El%20Troudi/Desktop/Bookea/backend), evitando interferir con el código de Frontend Client (Rol 2), Frontend User (Rol 4) o Spatial (Rol 1).
3. **Sincronización:** Rama `feat/rol3-backend-core` actualizada con los últimos cambios de `origin/main`.

---

## 3. ⚙️ Diagnóstico & Configuración del Entorno Local

1. **Clonado del Repositorio:**
   * Se clonó el proyecto desde GitHub directamente a la ruta de trabajo única:
     `c:\Users\Hamad El Troudi\Desktop\Bookea`.
2. **Runtimes Detectados:**
   * **Node.js:** Versión `v22.22.0` (Laragon)
   * **NPM:** Versión `10.9.4`
   * **Python:** Versión `3.13.0`
3. **Servidores Locales en Segundo Plano:**
   * **Puerto 3001:** Servidor HTTP local para previsualizar la landing page pública y assets del proyecto.
   * **Puerto 4000:** Servidor API backend con recarga en vivo activa (`node --watch src/server.js`) accesible en [http://localhost:4000](http://localhost:4000).

---

## 4. 🧱 Arquitectura y Desarrollo del Backend (`backend/`)

Se eligió **Node.js (ES Modules)** aprovechando la funcionalidad nativa de **`node:sqlite`** (`DatabaseSync`) incluida en Node 22, lo que garantiza una base de datos relacional ultrarrápida sin dependencias de compilación externa en Windows (evitando fallos de `node-gyp` o Visual C++ Build Tools).

### Estructura del Directorio Backend
```text
backend/
├── package.json               # Configuración ES Modules, scripts dev y dependencias
├── README.md                  # Documentación técnica completa de la API
├── .env.example               # Plantilla de variables de entorno
├── src/
│   ├── config/
│   │   └── env.js             # Gestor de configuración y variables de entorno
│   ├── db/
│   │   ├── database.js        # Gestor de conexión SQLite nativo y migraciones
│   │   ├── schema.sql         # Esquema DDL relacional con índices
│   │   └── seed.js            # Poblador de datos de prueba para Tiers 1, 2 y 3
│   ├── middlewares/
│   │   └── errorHandler.js    # Manejo centralizado de excepciones y rutas 404
│   ├── modules/
│   │   ├── restaurants/       # Fichas de locales, zonas y consulta de mesas
│   │   ├── reservations/      # Motor de reservas, slots y prevención de overbooking
│   │   ├── crm/               # Historial de clientes, visitas y scoring VIP
│   │   ├── reviews/           # Bot LLM para reseñas de Google Maps
│   │   └── nfc/               # Endpoint para resolución de tags NFC en mesa
│   ├── app.js                 # Configuración de Express, CORS y Dashboard visual
│   └── server.js              # Entrypoint de ejecución en puerto 4000
```

---

## 5. 🗄️ Esquema de Base de Datos Relacional (`schema.sql`)

El motor relacional cuenta con claves foráneas e índices optimizados:

| Tabla | Propósito y Campos Clave |
| :--- | :--- |
| **`restaurants`** | Ficha comercial del local, categoría, Tier (1, 2 o 3), horarios (`opening_time`, `closing_time`), intervalo de turnos y datos Google Maps. |
| **`areas`** | Zonas físicas del restaurante (Salón Principal, Terraza 360°, Cava VIP) con flag `is_vip`. |
| **`tables`** | Capacidad mínima/máxima por mesa, vinculación con identificador de chip físico (`nfc_uid`) y código QR. |
| **`customers`** | CRM de comensales: visitas acumuladas, gasto total (LTV), notas personalizadas y nivel de estatus (`STANDARD`, `SILVER`, `GOLD`, `BLACK_EMPEROR`). |
| **`reservations`** | Reservas con código único (`BK-XXXX`), fecha, hora, duración (90 min), estatus (`confirmed`, `seated`, etc.) y mesa asignada. |
| **`google_reviews`** | Almacenamiento de comentarios de comensales, calificación (1-5 estrellas), sentimiento analizado y respuesta generada por IA. |

---

## 6. 🚀 Módulos Técnicos Desarrollados (Semana 1)

### A. Motor de Reservas & Disponibilidad ([`reservation.service.js`](file:///c:/Users/Hamad%20El%20Troudi/Desktop/Bookea/backend/src/modules/reservations/reservation.service.js))
* **Algoritmo de Slots:** Genera las ventanas de tiempo operativas del local según apertura y cierre.
* **Prevención de Overbooking:** Comprueba en tiempo real la compatibilidad de aforo de las mesas y detecta solapamientos de 90 minutos con reservas existentes. Si no hay mesas disponibles, marca el horario como `SOLD_OUT` y rechaza la colisión con código HTTP `409 Conflict`.
* **Asignación Óptima:** Selecciona la mesa que mejor optimiza los asientos disponibles priorizando la zona VIP solicitada.
* **Identificador de Rastreo:** Genera códigos alfanuméricos únicos (ej. `BK-B5C7`).

### B. CRM de Clientes & Scoring VIP ([`crm.service.js`](file:///c:/Users/Hamad%20El%20Troudi/Desktop/Bookea/backend/src/modules/crm/crm.service.js))
* Conexión transparente con cada reserva: si el cliente ya existe (por correo o teléfono), actualiza automáticamente sus visitas acumuladas; si es nuevo, crea su ficha de cliente.
* Métricas de LTV y gestión granular de estatus de fidelización.

### C. Bot de Reseñas de Google Maps con LLM ([`reviews.service.js`](file:///c:/Users/Hamad%20El%20Troudi/Desktop/Bookea/backend/src/modules/reviews/reviews.service.js))
* Ingestión de reseñas mediante endpoint de webhook (`POST /api/reviews/webhook`).
* Generación de respuestas sofisticadas con tono de hospitalidad y lujo ("trato real").
* Soporta llamada directa a **Gemini 1.5 Flash** si se define `GEMINI_API_KEY` en `.env`, y cuenta con un **motor heurístico local de alta fidelidad** para operar sin dependencias externas ni costos de API:
  * **4 o 5 estrellas:** Agradecimiento refinado destacando la excelencia culinaria.
  * **3 estrellas:** Respuesta empática, sin excusas defensivas, invitando a contacto directo con gerencia.
  * **1 o 2 estrellas:** Trato prioritario, protocolo de disculpa ejecutiva y canal VIP de resolución.

### D. Infraestructura NFC en Mesa ([`nfc.routes.js`](file:///c:/Users/Hamad%20El%20Troudi/Desktop/Bookea/backend/src/modules/nfc/nfc.routes.js))
* Endpoint `GET /api/nfc/resolve/:nfcUid`: Simula la interacción física del comensal o mesonero al tocar la mesa con su móvil. Devuelve el restaurante, número de mesa, zona y sesión de reserva activa en ese momento.

### E. Portal de Monitoreo Interactivo ([`app.js`](file:///c:/Users/Hamad%20El%20Troudi/Desktop/Bookea/backend/src/app.js))
* Panel web visual en modo oscuro montado en la raíz `http://localhost:4000` con Tailwind CSS para consultar en vivo:
  * Conteo dinámico de restaurantes, mesas con NFC, reservas activas, comensales CRM y reseñas.
  * Acceso directo con un solo clic a la prueba de cada endpoint.

---

## 7. 🧪 Pruebas de Validación Ejecutadas

Las siguientes llamadas a la API fueron probadas y validadas con éxito:

```bash
# 1. Healthcheck del servicio
curl http://localhost:4000/api/health
# Respuesta: { "status": "operational", "service": "Bookealo Core Engine" }

# 2. Disponibilidad de slots (Casa Campo Bistró - 4 personas)
curl "http://localhost:4000/api/reservations/availability/rest_casacampo?date=2026-10-28&partySize=4"
# Respuesta: Matriz de 11 slots calculados con mesas libres

# 3. Creación de Reserva Real
curl -X POST http://localhost:4000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "rest_casacampo",
    "reservationDate": "2026-10-28",
    "reservationTime": "15:00",
    "partySize": 4,
    "specialRequests": "Mesa en terraza con vista al Ávila",
    "customer": {
      "name": "Hamad El Troudi",
      "email": "hamad@bookealo.com",
      "phone": "+58 412 123 4567",
      "notes": "Lead Architect & Rol 3"
    }
  }'
# Respuesta: Código BK-B5C7 generado, mesa asignada e integrado al CRM

# 4. Generación de respuesta LLM para reseña de 3 estrellas
curl -X POST http://localhost:4000/api/reviews/rev_gm_02/generate-ai-reply
# Respuesta: Texto empático generado con tono de hospitalidad Bookealo

# 5. Resolución de tap de Chip NFC en Mesa 01
curl http://localhost:4000/api/nfc/resolve/NFC-BK-CC-001
# Respuesta: Mesa 01 (Salón Principal) identificada con capacidades Dine-In
```

---

## 8. 🌐 Resolución de Autenticación & Publicación en GitHub

1. **Diagnóstico de Identidad:** Git en Windows tenía memorizadas cuentas anteriores (`hamadtm7` y `Ak-283`).
2. **Corrección de Origen:** Se configuró el repositorio para asociar formalmente la identidad del colaborador:
   ```bash
   git remote set-url origin https://hamadtm07@github.com/RAFAELREYESDEV/bukea.git
   git config user.name "hamadtm07"
   ```
3. **Commit Firmado:**
   ```text
   Commit: f07df3b
   Mensaje: feat(backend-core): arquitectura relacional, motor de reservas, crm, llm bot y nfc
   Autor: hamadtm07 <hamadeltroudi11@gmail.com>
   Archivos añadidos: 25 archivos (+2743 líneas)
   ```
4. **Push Exitoso a GitHub:**
   ```bash
   git push -u origin feat/rol3-backend-core
   ```
   * **Resultado:** `b948d14..f07df3b feat/rol3-backend-core -> feat/rol3-backend-core`
   * **Estado actual:** Rama remota **100% sincronizada** con GitHub.

---

## 9. 📌 Próximos Pasos Recomendados

1. **Crear Pull Request en GitHub:**
   * Abrir [github.com/RAFAELREYESDEV/bukea/pulls](https://github.com/RAFAELREYESDEV/bukea/pulls).
   * Origen: `feat/rol3-backend-core` ➡️ Base: `main`.
   * Solicitar la revisión técnica del equipo para aprobar la integración de los cimientos del backend.
2. **Siguientes Hitos de Rol 3 (Semana 2):**
   * Integración con pasarelas de pago (Spidi, Pago Móvil, Binance, Zelle).
   * Conexión con WhatsApp Business API para envío de confirmaciones automáticas de reserva.
   * Lógica avanzada de comandas y orden en mesa desde chip NFC.

---
*Documento generado automáticamente como memoria técnica oficial del proyecto Bookealo.*
