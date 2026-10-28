# 🚀 Bookealo — Ecosistema Digital de Reservas & Experiencias Gastronómicas

Plataforma integral de gestión de reservas, digitalización espacial y suite operativa para el sector gastronómico y turístico.

---

## 👥 Equipo & Asignación de Roles (Plan Express 4 Semanas)

* **Rol 1 — Business Development & Spatial Intelligence:** Dirección, StreetView, Google Maps, fotos 360°, modelado 3D/AR y optimización GMBP.
* **Rol 2 — Frontend & UI-UX (Client Side Developer):** Panel de establecimientos / administrador, portal de autogestión, cartas dinámicas, suite POS/KDS y gestión RSVP / Wallet.
* **Rol 3 — Backend & Integrations Engineer:** Arquitectura DB relacional, motor de reservas base, bot de reseñas con LLM, pasarelas de pago (Spidi / Pago Móvil / Binance / Zelle), WhatsApp API y lógica NFC.
* **Rol 4 — UI-UX (User Side Developer) & QA:** Experiencia de usuario comensal (móvil y web), mapa interactivo, catálogo flipbook, pases a Wallets (Apple & Google) y control de calidad integral.

---

## 💎 Niveles de Suscripción (Tiers)
* **Tier 1 ($40/mes):** Ficha optimizada en app y Google Maps, motor de reservas base, bot de reseñas y CRM básico.
* **Tier 2 ($60/mes):** Todo T1 + Fotos 360° en Maps, tarjetas digitales en Apple/Google Wallet, RSVP y kit inicial de 12 chips NFC para mesas.
* **Tier 3 ($100/mes):** Todo T2 + Tour virtual 360° interactivo, menú 3D/AR para platos estrella, POS/KDS all-in-one con modo offline, orquestador de pagos y scoring predictivo de comensales.

---

## 🛠️ Reglas de Trabajo Colaborativo en Git & GitHub

1. **Rama principal (`main`):** Es la rama de producción y despliegue automático en Cloudflare Pages. Todo lo que esté en `main` debe ser código funcional y probado.
2. **Estrategia de ramas por Rol / Feature:**
   * `feat/rol1-spatial`: Recursos 360, assets y landing.
   * `feat/rol2-frontend-admin`: Panel de restaurantes y suite POS.
   * `feat/rol3-backend-core`: API, base de datos y motores.
   * `feat/rol4-user-ui`: Interfaz de comensales y web app pública.
3. **Flujo de sincronización diaria:**
   * Antes de empezar a programar: `git pull origin main`
   * Al terminar una funcionalidad: abrir Pull Request hacia `main`.

---

## 📁 Estructura Inicial del Proyecto

```text
BUKEA/
├── docs/                      # Especificaciones del proyecto
│   ├── notion_spec.md         # Documento Maestro (Notion)
│   └── competencia_spec.md    # Análisis de Competencia & Go-to-Market
├── sync_notion.py             # Script de sincronización con Notion
├── README.md                  # Información del proyecto y reglas de equipo
└── .gitignore                 # Exclusiones de control de versiones
```
