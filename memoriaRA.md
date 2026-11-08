# 🧠 Memoria de Proyecto & Bitácora de Cambios — Bookealo (memoriaRA.md)

Este documento es el registro maestro y cronológico de todas las decisiones de arquitectura, hitos técnicos, despliegues y acuerdos de producto implementados en el proyecto.

---

## 📌 Enlaces Centrales del Ecosistema
* **Repositorio GitHub:** [github.com/RAFAELREYESDEV/bukea](https://github.com/RAFAELREYESDEV/bukea)
* **Web en Producción (Cloudflare):** [bukea.inkbytecorpore.workers.dev](https://bukea.inkbytecorpore.workers.dev)
* **Documento Maestro en Notion (Live):** [leaf-ceder-624.notion.site/Bookea-o-Bookealo](https://leaf-ceder-624.notion.site/Bookea-o-Bookealo-3f4d9083836280f699d9d6fb243f6819?source=copy_link)
* **Simulador Local OpenResto:** `http://localhost:5500/openresto_preview.html`

---

## 📅 Registro Cronológico de Hitos & Decisiones

### 🚀 Sesión 1 (28 de Octubre, 2026) — Cimientos, Ecosistema & Benchmark

#### 1. Extracción y Sincronización en Vivo de Notion
* Conexión exitosa a la página pública de Notion.
* Extracción automatizada del documento maestro:
  * [`docs/notion_spec.md`](docs/notion_spec.md): Visión, tiers de producto ($40, $60, $100), asignación de 4 roles y roadmap de 4 semanas.
  * [`docs/competencia_spec.md`](docs/competencia_spec.md): Benchmark de competidores internacionales y locales.
* Creación de [`sync_notion.py`](sync_notion.py) para refrescar la documentación local en cualquier momento.

#### 2. Configuración de Repositorio & Protocolo Git Flow
* Inicialización del repositorio Git local en rama `main`.
* Conexión remota con `https://github.com/RAFAELREYESDEV/bukea.git`.
* **Regla de oro de seguridad:** Prohibido el push directo a `main`. Todo entra mediante Pull Request revisado.
* Creación y sincronización de las 4 ramas aisladas por rol:
  * `feat/rol1-spatial`: Business Development & Spatial Intelligence (360°, Maps, AR 3D).
  * `feat/rol2-frontend-admin`: Frontend Client (Portal de restaurante, cartas, POS/KDS y Wallet).
  * `feat/rol3-backend-core`: Backend & Integraciones (Base de datos, motor de reservas, bot de reseñas, NFC).
  * `feat/rol4-user-ui`: Frontend User & QA (PWA comensal, mapa interactivo, pases Wallet, pruebas).
* Documentación de normas en [`docs/TEAM_WORKFLOW.md`](docs/TEAM_WORKFLOW.md) y [`CONTRIBUTING.md`](CONTRIBUTING.md).

#### 3. Despliegue en Vivo en Cloudflare
* Creación del landing page inicial en [`index.html`](index.html) con diseño *luxury dark*, presentación del elevator pitch, comparativa de Tiers y roadmap de 4 semanas.
* Despliegue exitoso conectado a GitHub en Cloudflare Pages / Workers: [bukea.inkbytecorpore.workers.dev](https://bukea.inkbytecorpore.workers.dev).

#### 4. Definición del Stack Tecnológico Empresarial
* **Frontend:** PWA Mobile-First (React + Tailwind con ergonomía táctil "Tap Tap") $\rightarrow$ En fase avanzada se empaqueta a iOS y Android nativo con **Capacitor** (un solo código para web, App Store y Play Store).
* **Base de Datos & Auth:** **Supabase (PostgreSQL relacional)** para reservas, mesas, comandas y POS (soporte ACID para evitar dobles reservas). Se descartó Firebase para la lógica relacional.
* **Storage de Multimedia Pesada (360° y 3D):** **Backblaze B2** con CDN de Cloudflare (Alianza Bandwidth Alliance = $0 costo de descarga / egress).

#### 5. Kit de Onboarding para Compañeros
* Creación del prompt maestro universal en [`docs/ONBOARDING_PROMPT.md`](docs/ONBOARDING_PROMPT.md).
* Los compañeros solo deben pegar ese texto en su Antigravity: detecta su rol, los ubica en su rama, protege `main` y les levanta un servidor de desarrollo local en vivo.

#### 6. Benchmark de OpenResto & Simulador Local
* Clonación e inspección del proyecto open-source `karanshukla/openresto`.
* Levantamiento de servidor interactivo local en el puerto `5500` ([`openresto_preview.html`](openresto_preview.html)).
* **Joyas técnicas identificadas para adoptar:**
  1. Bloqueo temporal de mesa por 5 minutos (*Hold de 5 min*) para evitar colisiones.
  2. Lógica de Pacing (control de comensales cada 15 min para no colapsar la cocina).
  3. Estructura de Secciones de mesa (Terraza, Salón, VIP) con comensales mínimos/máximos.

#### 7. Generación de Tablas Gráficas Corporativas
* Creación de [`render_tables_to_images.py`](render_tables_to_images.py).
* Generación de imágenes en alta resolución con el cintillo oficial de Bookealo:
  * `docs/tabla_competidores_internacionales.png`: OpenTable, Resy, SevenRooms, Sunday App.
  * `docs/tabla_competidores_nacionales.png`: Ganga, La Perla, Cariba, Queda, La M3sa.
  * `docs/infografia_competencia_completa.png`: Comparativa ejecutiva de posicionamiento de mercado.

#### 8. Backlog de Producto & Sistema Anti-Spam
* Creación de [`PENDIENTES.md`](PENDIENTES.md) con las funcionalidades aprobadas:
  * **Cupones & Cashback:** Saldo acumulable en Apple/Google Wallet.
  * **Filtro Preventivo de Reseñas:** Interceptación privada de malas experiencias antes de Google Maps.
  * **División de Cuenta (Split Bill) & Propinas con NFC:** Pago en mesa individual o en partes.
  * **Lista de Espera en Vivo (Live Waitlist):** Notificación automática si se libera mesa.
  * **Compatibilidad con Impresoras Térmicas ESC/POS:** 58mm y 80mm de cocina y barra.
  * **Experiencias VIP Prepagadas:** Catas y menús degustación cerrados.
  * **Blindaje Anti-Spam SIN pedir dinero por adelantado:** Reconfirmación obligatoria por WhatsApp 2 horas antes (con liberación automática a los 45 min), límite de 1 reserva activa por teléfono, tolerancia estricta de 15 min y Score de Confiabilidad ("Karma del Comensal").

---

## 🎯 Estado Actual & Siguiente Tarea
* **Estado:** Cimientos técnicos, repositorio, despliegue en vivo y especificaciones 100% listos.
* **Siguiente Paso:** En espera del código de la maqueta previa desarrollada por los compañeros para analizarla, limpiarla y ensamblarla en la maqueta final interactiva.
