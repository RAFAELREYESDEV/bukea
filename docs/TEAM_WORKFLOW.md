# 🛡️ Guía de Trabajo Colaborativo & Git Flow — Bookealo

> [!IMPORTANT]
> **REGLA DE ORO #1:** Nadie hace `git push` directo a `main`.
> La rama `main` representa **producción** y es la que alimenta automáticamente la web en vivo de Cloudflare Pages. Cualquier error subido a `main` rompe el sitio público.

---

## 🌳 1. Estrategia de Ramas (Git Flow)

Cada miembro del equipo trabajará exclusivamente en su rama asignada.

| Rol | Miembro / Área | Rama Asignada | Qué archivos le corresponden |
| :--- | :--- | :--- | :--- |
| **Rol 1** | **Business Dev & Spatial** | `feat/rol1-spatial` | Assets 360°, tours virtuales, modelos 3D/AR, optimización GMBP y StreetView. |
| **Rol 2** | **Frontend Client (Admin & POS)** | `feat/rol2-frontend-admin` | Portal de autogestión de restaurantes, cartas dinámicas, KDS y suite POS/Kamra. |
| **Rol 3** | **Backend & Integrations** | `feat/rol3-backend-core` | Base de datos relacional, APIs, motor de reservas, bot de reseñas LLM, Spidi/pagos y NFC. |
| **Rol 4** | **Frontend User & QA** | `feat/rol4-user-ui` | Web/App para comensales, mapa interactivo, catálogo flipbook, pases Wallet (Apple/Google). |

---

## 🔄 2. Flujo de Trabajo Diario (Paso a Paso)

### Paso A: Al iniciar el día o una tarea
Siempre asegúrate de tener los últimos cambios aprobados de `main`:
```bash
git checkout main
git pull origin main
git checkout feat/rolX-tu-rama
git merge main
```

### Paso B: Durante el desarrollo
Haz commits pequeños y descriptivos siguiendo la convención:
* `feat: ...` para nuevas funcionalidades.
* `fix: ...` para corrección de errores.
* `docs: ...` para documentación.
* `style: ...` para cambios visuales o de formato.

Ejemplo:
```bash
git add .
git commit -m "feat(reservas): implementar logica base de slots de tiempo"
```

### Paso C: Subir tus avances a GitHub
Sube ÚNICAMENTE a tu rama remota:
```bash
git push origin feat/rolX-tu-rama
```

### Paso D: Integración a Producción (Pull Request)
1. Entra a [github.com/RAFAELREYESDEV/bukea/pulls](https://github.com/RAFAELREYESDEV/bukea/pulls).
2. Haz clic en **New Pull Request**.
3. Selecciona tu rama como origen (`compare: feat/rolX-...`) hacia `base: main`.
4. El líder técnico o al menos un compañero revisa el código y aprueba el **Merge**.
5. Al hacer merge a `main`, **Cloudflare Pages se actualiza automáticamente**.

---

## 🚫 3. Prohibiciones Estrictas
1. ❌ **Cero `git push origin main`:** Si intentas subir directo a `main`, estás violando el protocolo de seguridad.
2. ❌ **Prohibido `git push -f` (Force Push):** Nunca sobreescribas el historial remoto.
3. ❌ **No modificar código de otro rol:** Si necesitas un cambio en el backend y eres frontend, comunícalo al Rol 3 para que exponga el endpoint o cree la migración.
4. ❌ **No subir secretos o credenciales:** Tokens API, llaves privadas y archivos `.env` deben permanecer siempre en el archivo `.gitignore`.

---

## 🤖 4. Regla para los Agentes Antigravity de cada compañero
Cada compañero debe copiar la siguiente directiva en su sesión de Antigravity:

> *"Estás trabajando en el proyecto Bookealo en el repositorio de GitHub `RAFAELREYESDEV/bukea`. Tu rol asignado es [ROL_NUMERO: ROL_NOMBRE]. Tienes terminantemente prohibido hacer push directo a la rama 'main'. Todo tu trabajo debe realizarse y commitearse en la rama 'feat/[ROL_RAMA]'. Mantén tu código modular y aislado de las responsabilidades de los otros roles."*
