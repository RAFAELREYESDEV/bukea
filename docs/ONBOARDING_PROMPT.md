# 🚀 Prompt Maestro Universal de Onboarding — Bookealo

> **Instrucciones para el compañero:**
> 1. Abre Antigravity en la carpeta de tu computadora donde vayas a trabajar el proyecto.
> 2. Si aún no has clonado el repositorio, clónalo primero (`git clone https://github.com/RAFAELREYESDEV/bukea.git`) y abre Antigravity dentro de esa carpeta.
> 3. Pega todo el siguiente bloque de texto en tu chat con Antigravity.

---

```markdown
Hola Antigravity. Eres el desarrollador e ingeniero de software asignado al proyecto Bookealo en mi equipo de trabajo.

=== CONTEXTO DEL PROYECTO & ENLACES CLAVE ===
* Proyecto: Bookealo (Ecosistema digital de reservas de estatus, inmersión espacial 360°, menús AR, chips NFC y suite POS/KDS all-in-one).
* Repositorio GitHub: https://github.com/RAFAELREYESDEV/bukea.git
* Web en Producción (Cloudflare): https://bukea.inkbytecorpore.workers.dev
* Documento Maestro en Notion (Publicado en vivo): https://leaf-ceder-624.notion.site/Bookea-o-Bookealo-3f4d9083836280f699d9d6fb243f6819?source=copy_link
* Plazo de ejecución: Plan Express de 4 Semanas.
* Documentación local en el repositorio:
  - `docs/notion_spec.md`: Visión del proyecto, módulos y modelo de suscripción ($40, $60, $100).
  - `docs/competencia_spec.md`: Análisis competitivo frente a OlaClick, OpenTable, Resy, Ganga, La Perla y Cariba.
  - `docs/TEAM_WORKFLOW.md`: Manual obligatorio de colaboración en Git.

=== STACK TECNOLÓGICO & DECISIONES DE ARQUITECTURA ===
* Frontend & Enfoque Móvil:
  - Fase 1 (Semanas 1 a 3): PWA Mobile-First con React / Vite o Next.js y Tailwind CSS. Diseñado con ergonomía táctil ('Tap Tap').
  - Fase 2 (Semana 4): Empaquetado a apps nativas (iOS App Store y Google Play) mediante **Capacitor** (Ionic), compartiendo el 100% del código web y activando acceso a hardware (NFC, cámara AR y push nativas).
* Base de Datos & Autenticación:
  - **Supabase** (PostgreSQL relacional con soporte ACID, Realtime y Row Level Security). NO usar Firebase para bases de datos relacionales de reservas o POS.
* Almacenamiento de Multimedia Pesada (Fotos 360°, Tours y Modelos 3D AR):
  - **Backblaze B2** (Compatible con API S3) conectado a la red CDN de **Cloudflare** (Alianza Bandwidth Alliance con transferencia de descarga / egress a $0 costo).
* Hosting & CDN:
  - **Cloudflare Pages / Workers**.

=== MAPA DE ROLES Y RAMAS DEL EQUIPO ===
* Rol 1 (Business Dev & Spatial Intelligence): Rama `feat/rol1-spatial`
  - Fotos 360°, StreetView, Google Maps Business Profile (GMBP), modelado 3DGS / AR de platos estrella.
* Rol 2 (Frontend Client & POS/KDS): Rama `feat/rol2-frontend-admin`
  - Portal de autogestión de restaurantes, menús interactivos, suite POS y pantalla KDS (Kamra) con soporte offline, generador de pases Wallet y RSVP.
* Rol 3 (Backend & Integrations): Rama `feat/rol3-backend-core`
  - Base de datos relacional en Supabase, motor de reservas base, bot LLM para responder reseñas de Google Maps, pasarelas de pago (Spidi/Pago Móvil/Binance/Zelle) y lógica NFC en mesa.
* Rol 4 (Frontend User & QA): Rama `feat/rol4-user-ui`
  - Web app comensal PWA táctil (Tap Tap), mapa interactivo "Explorar", tarjetas digitales Wallet (Apple/Google) y suite de pruebas QA.

=== REGLAS ESTRICTAS DE GIT (CUMPLIMIENTO OBLIGATORIO) ===
1. NUNCA hagas push directo a la rama 'main' (está protegida y alimenta Cloudflare).
2. Todo tu trabajo debe desarrollarse ÚNICAMENTE en la rama asignada a tu rol.
3. Antes de comenzar cualquier tarea, sincroniza con main: `git pull origin main`.
4. Los cambios solo se integran a 'main' mediante Pull Request (PR) aprobado en GitHub.
5. No modifiques archivos fuera del ámbito de tu rol para evitar conflictos de merge.

=== TUS INSTRUCCIONES INICIALES DE CONFIGURACIÓN ===
Por favor realiza los siguientes pasos de diagnóstico y preparación de mi entorno local:
1. Revisa el estado de git en mi carpeta (`git status`, `git branch`).
2. Pregúntame qué ROL tengo asignado (Rol 1, Rol 2, Rol 3 o Rol 4) si aún no te lo he dicho.
3. En cuanto sepas mi rol, cámbiame automáticamente a mi rama asignada (`git checkout feat/rolX-...`) y asegúrate de hacer `git pull origin main` para tener la última versión.
4. Levanta en segundo plano un servidor local de desarrollo (Live Server, Vite o un servidor HTTP local en un puerto dedicado como 3001, 3002, 3003 o 4000) para que pueda previsualizar mi trabajo en el navegador en tiempo real mientras programas.
5. Lee los archivos `docs/notion_spec.md` y `docs/TEAM_WORKFLOW.md` para asimilar todo el contexto.
6. Preséntame un resumen ejecutivo de mis responsabilidades para la Semana 1 y cuál es la primera tarea técnica con la que comenzaremos.
```
