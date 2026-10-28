# MEMORIA TÉCNICA Y DE DISEÑO — BUKEA (ROL 4: FRONTEND USER & QA)

> **Fecha:** 28 de Octubre, 2026  
> **Proyecto:** BUKEA (Ecosistema Digital de Reservas de Estatus, Inmersión Espacial 360°, Menús AR, Chips NFC y Suite POS/KDS)  
> **Rama de Trabajo:** `feat/rol4-user-ui`  
> **Repositorio:** [https://github.com/RAFAELREYESDEV/bukea.git](https://github.com/RAFAELREYESDEV/bukea.git)  
> **Producción Cloudflare:** [https://bukea.inkbytecorpore.workers.dev](https://bukea.inkbytecorpore.workers.dev)  
> **Doc Maestro Notion:** [Bookea o Bookealo](https://leaf-ceder-624.notion.site/Bookea-o-Bookealo-3f4d9083836280f699d9d6fb243f6819)

---

## 1. Declaración de Marca e Identidad Visual

1. **Nombre Oficial Unificado:** **BUKEA** (se descartó formalmente cualquier variación previa como *Bookealo* o *Bookea*).
2. **Paleta Cromática & Tema:** **Tema Blanco Puro** con tipografía y elementos en negro y neutros (`#000000`, `#111111`, `#737373`, `#fbfbfb`). Se eliminó totalmente el esquema oscuro y los gradientes dorados genéricos.
3. **Estilo Superficial:** **Liquid Glass / Glassmorphism** auténtico (fondos translúcidos con `backdrop-blur-md`, bordes sutiles ultra-delgados `border-black/10` o `border-white/20`, sombras suaves de difusión amplia). **Cero gradientes saturados**.
4. **Iconografía:** **Cero emojis**. Toda la interfaz emplea exclusivamente iconografía vectorial minimalista mediante `lucide-react`.
5. **Insignias y Badges:** Estilo editorial minimalista y sobrio (sin efectos de cápsula abombada o estilos predecibles de IA).
6. **Sistema Tipográfico:**
   - **Logotipo:** `Story Script` (cursiva de autor con máxima personalidad).
   - **Textos y UI General:** `Barlow` (sans-serif técnica, limpia, moderna y altamente legible).
   - **Acento y Énfasis Editorial:** `Cormorant Garamond` (serif elegante aplicada a remates y llamadas de atención en títulos).

---

## 2. Requerimientos Cumplidos de la Maqueta (Frontend User)

### A. Página de Inicio y Feed "Explorar" (`web/app/page.tsx`)
- **Hero Editorial:** Encabezado limpio con el lema: *"Reservas exclusivas, en un toque."*
- **Categorías Táctiles:** Filtro horizontal de categorías (*Todos, Gastronomía, Beach Clubs, Vinos & Coctelería, Posadas Boutique, Experiencias*) con chips sobrios con estado activo en negro sólido.
- **Filtros Rápidos:** Botones de alternancia para locales con *Tours 360°* y platos en *Realidad Aumentada (AR)*.
- **Buscador en Vivo:** Búsqueda instantánea por nombre de local, zona geográfica (Pampatar, Playa El Agua, Porlamar, Juan Griego) o tipo de comida.
- **Tarjetas de Negocio:**
  - Etiqueta de estatus minimalista superior.
  - Indicador numérico de valoración discreto con estrella minimalista.
  - Beneficio exclusivo de mesa (e.g. *"Mesa VIP preferencial"*).
  - Horario y botón de acción directa a reserva.
- **Dock de Navegación Inferior Flotante (`BottomNav.tsx`):** Barra flotante tipo vidrio líquido con 4 pestañas:
  1. *Explorar* (Feed principal)
  2. *Mapa* (Vista interactiva satelital y de pines con Google Maps)
  3. *Reservas* (Historial interactivo y gestión)
  4. *Pase Digital* (Wallet de membresía y boletos con código QR dinámico)

### B. Detalle del Restaurante (`web/app/lugar/[id]/page.tsx`)
- **Header de Cocina Dinámico:** Formateado obligatoriamente como **"Comida [TIPO]"** (e.g., *"Comida Árabe"*, *"Comida Mexicana"*, *"Comida Italiana"*, *"Comida Fusión Insular"*), erradicando el término genérico "Restaurante".
- **Platos en Realidad Aumentada (AR) 3D:**
  - Muestra **exactamente 4 platos de forma inicial** en una cuadrícula simétrica.
  - Botón interactivo de despliegue **"Ver más platos AR"** / **"Ver menos platos"** cuando la carta del establecimiento ofrece platos adicionales.
  - Apertura de modal con visor WebXR `<model-viewer>` para orbitar el modelo en 360° o proyectarlo sobre la mesa física mediante realidad aumentada.
- **Motor de Reservas:**
  - Selector de número de comensales (1 a 8+ personas).
  - Selector de fecha en vivo con bloqueo de fechas pasadas.
  - Matriz de slots horarios con estados disponibles en tiempo real.
  - Formulario de contacto (Nombre y WhatsApp).
  - Generación instantánea de código de confirmación alfanumérico (ej: `BK-89X2`).
  - Persistencia automática de la reserva en el almacenamiento local (`localStorage.getItem('bukea_reservations')`), alimentando al instante el contador del Dock y la pantalla de Wallet.
- **Tour Virtual Inmersivo 360°:** Integración del visor StreetView/Matterport en modal de pantalla completa.
- **Menú Digital Completo (`MenuDigital.tsx`):**
  - Desglose por tiempos (*Entradas, Del mar, Parrilla, Postres*).
  - Bottom sheet táctil con fotografía en alta resolución, descripción de autor y lista de ingredientes desglosados.
- **Opiniones de Comensales Verificados (`ReviewsList.tsx`):** Calificaciones y comentarios reales o de muestra con insignia de comensal verificado.

---

## 3. Arquitectura del Código & Resiliencia de Datos

- **Capa de Normalización (`web/app/data/businesses.ts`):**
  - El backend (Rol 3) expone `/api/web/businesses` pero los registros iniciales de base de datos pueden carecer de campos visuales como carruseles, tours o platos 3D.
  - La función `normalizeBusiness()` intercepta las respuestas de la API, infiere fotos temáticas de Unsplash según la cocina (`mexicana`, `italiana`, `mariscos`, `arabe`), asigna coordenadas de Margarita y provee fallbacks seguros para `rating` y `reviewCount` evitando excepciones de tipo `undefined.toFixed()`.
  - La función `formatCuisineHeader()` garantiza el formato de encabezado exigido para el tipo de comida.
  - Lista tipada `DEFAULT_AR_DISHES` que garantiza que siempre haya mínimo 4 platos AR disponibles por local.

---

## 4. Guía de Ejecución Local y Servidor

El entorno de desarrollo en Next.js 15 (React 19) está configurado con symlink hacia `node_modules` de la estación principal:

```bash
# Entrar al subdirectorio web
cd "/Volumes/EDS 2TB SSD/Antigravity/Bukea/web"

# Levantar servidor de desarrollo en puerto 3004 (modo Webpack)
npx next dev -p 3004
```

> **Nota técnica:** No utilizar el flag `--turbopack` en este entorno debido a que Turbopack entra en pánico ante enlaces simbólicos entre distintos sistemas de archivos en macOS.

---

## 5. Reglas de Control de Versiones Git (Estricto)

1. **Prohibición Total:** **NUNCA** hacer push directo a la rama `main` (protegida y vinculada al despliegue en Cloudflare Workers).
2. **Rama Oficial:** Todo el trabajo de este rol reside en `feat/rol4-user-ui`.
3. **Flujo de Integración:** Los cambios deben subirse a `origin feat/rol4-user-ui` y presentarse mediante Pull Request hacia `main`.
