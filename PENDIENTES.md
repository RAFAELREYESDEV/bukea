# 📌 Lista de Pendientes & Mejoras Estratégicas — Bookealo

Documento de seguimiento para funcionalidades aprobadas que se integrarán en los sprints de desarrollo.

---

## 🎁 1. Cupones & Cashback para Usuarios (Motor de Fidelización)
* **Objetivo:** Generar recurrencia y hábito de uso en el comensal ("Volver a reservar").
* **Mecánica:**
  * **Cashback acumulable:** Por cada reserva o consumo registrado mediante NFC, el usuario recibe un porcentaje de retorno (ej. $3\%$ a $5\%$) acreditable a su saldo en la plataforma.
  * **Saldo visible en Apple & Google Wallet:** El comensal ve su saldo de cashback directamente en su tarjeta digital.
  * **Cupones dinámicos de aliados:** Cupones de descuento exclusivos (ej: "2x1 en cócteles los jueves", "Postre gratis en tu primera reserva") canjeables mediante código QR/NFC en el restaurante.

---

## 🛡️ 2. Filtro Preventivo de Reseñas Negativas (Protección de Reputación)
* **Ubicación:** Tier 1 ($40/mes).
* **Objetivo:** Interceptar las malas experiencias antes de que terminen en una calificación pública de 1 estrella en Google Maps.
* **Mecánica:**
  * Al salir del restaurante o pagar la cuenta, se dispara una micro-encuesta rápida (vía WhatsApp o notificación PWA): *"¿Cómo estuvo tu experiencia hoy?" (1 a 5 estrellas)*.
  * **Si califica 4 o 5 estrellas:** Se redirige con un botón directo a Google Maps para que la deje pública.
  * **Si califica 1 a 3 estrellas:** NO va a Google Maps. Se abre un canal de retroalimentación privado directo al WhatsApp del dueño/gerente para resolver la queja de inmediato.

---

## 💳 3. División de Cuenta (Split Bill) & Propinas con NFC
* **Ubicación:** Tier 2 ($60/mes) y Tier 3 ($100/mes).
* **Objetivo:** Eliminar la fricción al momento de pagar en mesas grupales.
* **Mecánica:**
  * Al tocar el chip NFC de la mesa con el teléfono, se despliega la comanda viva.
  * **Opciones de pago:**
    * Pagar la cuenta completa.
    * Dividir en partes iguales entre $N$ personas.
    * Pagar por ítem consumido (cada quien selecciona lo que comió).
  * **Propina en 1 toque:** Botones rápidos de $10\%$, $15\%$ o $20\%$ antes de procesar el pago.

---

## ⏳ 4. Lista de Espera Inteligente (Live Waitlist)
* **Ubicación:** Tier 1 y 2.
* **Objetivo:** Capturar la demanda cuando el local esté 100% reservado.
* **Mecánica:**
  * Si no hay mesas disponibles a las 8:00 PM, el usuario puede unirse a la **Lista de Espera Digital**.
  * Si otra reserva cancela o se libera una mesa antes de tiempo, el sistema avisa automáticamente por WhatsApp: *"¡Se liberó una mesa para 4! Tienes 10 minutos para confirmar"*.

---

## 🖨️ 5. Compatibilidad de Comandas con Impresoras Térmicas (ESC/POS)
* **Ubicación:** Tier 3 ($100/mes - POS Kamra).
* **Objetivo:** Integración con el hardware físico de bajo costo que ya tienen los restaurantes en Venezuela.
* **Mecánica:**
  * Soporte nativo para impresoras térmicas de 58mm y 80mm vía USB, Bluetooth y red local (protocolo ESC/POS).
  * Envío automático de comandas separadas a cocina (KDS/impresora de cocina) y barra (impresora de bebidas).

---

## 🍷 6. Venta de "Experiencias VIP" Prepagadas
* **Ubicación:** Tier 3 ($100/mes).
* **Objetivo:** Monetizar eventos especiales de alto valor para comensales de estatus.
* **Mecánica:**
  * Módulo para que el restaurante venda catas de vino guiadas, menús degustación cerrados de varios tiempos, cenas temáticas o acceso exclusivo a zonas VIP.

---

## 🛡️ 7. Sistema Anti-Spam y Protección Anti-Plantón (SIN PEDIR DINERO)
* **Directiva:** En Venezuela NO se pedirá dinero ni tarjetas por adelantado para reservar. La protección debe ser mediante **fricción inteligente y reputación**:
  1. **Confirmación Obligatoria por WhatsApp (2 Horas Antes):** Mensaje con botones interactivos `[Confirmar Mesa]` y `[Liberar Mesa]`. Si no responde 45 min antes, la mesa se libera.
  2. **Límite de 1 Reserva Activa por Número de Teléfono:** Un mismo número no puede reservar en varios restaurantes en la misma fecha y hora.
  3. **Tolerancia Estricta de 15 Minutos:** Si a los 15 min de la hora pautada no ha hecho check-in en la mesa, el sistema libera el turno.
  4. **Score de Confiabilidad del Comensal (Trust Karma):** Usuarios con asistencia perfecta desbloquean más cashback y mejores mesas; usuarios con 2 no-shows quedan suspendidos temporalmente de reservar en horas pico.
