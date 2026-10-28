import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import { getDatabase } from './db/database.js';
import restaurantRoutes from './modules/restaurants/restaurant.routes.js';
import reservationRoutes from './modules/reservations/reservation.routes.js';
import crmRoutes from './modules/crm/crm.routes.js';
import reviewsRoutes from './modules/reviews/reviews.routes.js';
import nfcRoutes from './modules/nfc/nfc.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

export function createApp() {
  const app = express();

  // Middlewares globales
  app.use(cors({ origin: ENV.CORS_ORIGIN }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Inicializar base de datos
  const db = getDatabase();

  // Healthcheck
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'operational',
      environment: ENV.NODE_ENV,
      timestamp: new Date().toISOString(),
      service: 'Bookealo Core Engine (Rol 3 Backend)',
      database: 'SQLite (Node.js Native)'
    });
  });

  // Portal Interactivo del Backend & Métricas en Vivo
  app.get('/', (req, res) => {
    const counts = {
      restaurants: db.prepare('SELECT COUNT(*) as c FROM restaurants').get()?.c || 0,
      tables: db.prepare('SELECT COUNT(*) as c FROM tables').get()?.c || 0,
      reservations: db.prepare('SELECT COUNT(*) as c FROM reservations').get()?.c || 0,
      customers: db.prepare('SELECT COUNT(*) as c FROM customers').get()?.c || 0,
      reviews: db.prepare('SELECT COUNT(*) as c FROM google_reviews').get()?.c || 0
    };

    res.send(`
<!DOCTYPE html>
<html lang="es" class="dark">
<head>
  <meta charset="UTF-8">
  <title>Bookealo Core API — Rol 3 Backend</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0A0B0E; color: #E2E8F0; }
    .gold-gradient { background: linear-gradient(135deg, #FFF 0%, #D4AF37 50%, #9A7B1C 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  </style>
</head>
<body class="p-6 md:p-12 max-w-6xl mx-auto">
  <header class="border-b border-gray-800 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <div class="flex items-center gap-2 mb-1">
        <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-xs font-semibold uppercase tracking-widest text-emerald-400">Servicio Activo en Puerto ${ENV.PORT}</span>
      </div>
      <h1 class="text-3xl font-extrabold gold-gradient font-display">Bookealo Core Engine API</h1>
      <p class="text-gray-400 text-sm mt-1">Rama: <span class="text-amber-400 font-mono">feat/rol3-backend-core</span> | Ecosistema Digital de Reservas de Estatus</p>
    </div>
    <div class="flex gap-2">
      <a href="/api/health" target="_blank" class="px-3 py-1.5 text-xs font-semibold rounded bg-gray-800 hover:bg-gray-700 text-gray-200 transition">/api/health</a>
      <a href="http://localhost:3001" target="_blank" class="px-3 py-1.5 text-xs font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition">Landing Web (3001)</a>
    </div>
  </header>

  <!-- Métricas Rápidas -->
  <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
    <div class="bg-gray-900/80 border border-gray-800 rounded-xl p-4">
      <div class="text-xs uppercase text-gray-400 font-semibold">Restaurantes</div>
      <div class="text-2xl font-bold text-white mt-1">${counts.restaurants}</div>
      <div class="text-[10px] text-amber-400 mt-1">Tiers 1, 2 y 3</div>
    </div>
    <div class="bg-gray-900/80 border border-gray-800 rounded-xl p-4">
      <div class="text-xs uppercase text-gray-400 font-semibold">Mesas & NFC</div>
      <div class="text-2xl font-bold text-white mt-1">${counts.tables}</div>
      <div class="text-[10px] text-emerald-400 mt-1">Con chips asignados</div>
    </div>
    <div class="bg-gray-900/80 border border-gray-800 rounded-xl p-4">
      <div class="text-xs uppercase text-gray-400 font-semibold">Reservas Core</div>
      <div class="text-2xl font-bold text-white mt-1">${counts.reservations}</div>
      <div class="text-[10px] text-blue-400 mt-1">Motor de Slots Activo</div>
    </div>
    <div class="bg-gray-900/80 border border-gray-800 rounded-xl p-4">
      <div class="text-xs uppercase text-gray-400 font-semibold">CRM Clientes</div>
      <div class="text-2xl font-bold text-white mt-1">${counts.customers}</div>
      <div class="text-[10px] text-purple-400 mt-1">Con scoring VIP</div>
    </div>
    <div class="bg-gray-900/80 border border-gray-800 rounded-xl p-4">
      <div class="text-xs uppercase text-gray-400 font-semibold">Reseñas LLM</div>
      <div class="text-2xl font-bold text-white mt-1">${counts.reviews}</div>
      <div class="text-[10px] text-amber-400 mt-1">Bot Google Maps</div>
    </div>
  </div>

  <!-- Catálogo de Endpoints Clave -->
  <h2 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
    <span>⚡ Endpoints del Motor Central (Semana 1)</span>
  </h2>

  <div class="space-y-3 font-mono text-xs">
    <!-- Disponibilidad -->
    <div class="bg-gray-900 border border-gray-800 rounded-lg p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <div class="flex items-center gap-3">
        <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">GET</span>
        <span class="text-gray-300">/api/reservations/availability/rest_casacampo?date=${new Date().toISOString().split('T')[0]}&partySize=4</span>
      </div>
      <a href="/api/reservations/availability/rest_casacampo?date=${new Date().toISOString().split('T')[0]}&partySize=4" target="_blank" class="text-amber-400 hover:underline">Probar slot engine &rarr;</a>
    </div>

    <!-- Restaurantes -->
    <div class="bg-gray-900 border border-gray-800 rounded-lg p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <div class="flex items-center gap-3">
        <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">GET</span>
        <span class="text-gray-300">/api/restaurants</span>
      </div>
      <a href="/api/restaurants" target="_blank" class="text-amber-400 hover:underline">Ver restaurantes &rarr;</a>
    </div>

    <!-- CRM -->
    <div class="bg-gray-900 border border-gray-800 rounded-lg p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <div class="flex items-center gap-3">
        <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">GET</span>
        <span class="text-gray-300">/api/crm</span>
      </div>
      <a href="/api/crm" target="_blank" class="text-amber-400 hover:underline">Ver CRM & Scoring VIP &rarr;</a>
    </div>

    <!-- Reseñas LLM -->
    <div class="bg-gray-900 border border-gray-800 rounded-lg p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <div class="flex items-center gap-3">
        <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">GET</span>
        <span class="text-gray-300">/api/reviews</span>
      </div>
      <a href="/api/reviews" target="_blank" class="text-amber-400 hover:underline">Ver reseñas & Respuestas IA &rarr;</a>
    </div>

    <!-- NFC Resolve -->
    <div class="bg-gray-900 border border-gray-800 rounded-lg p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <div class="flex items-center gap-3">
        <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">GET</span>
        <span class="text-gray-300">/api/nfc/resolve/NFC-BK-CC-001</span>
      </div>
      <a href="/api/nfc/resolve/NFC-BK-CC-001" target="_blank" class="text-amber-400 hover:underline">Simular tap NFC en Mesa 01 &rarr;</a>
    </div>
  </div>

  <footer class="mt-12 text-center text-xs text-gray-600 border-t border-gray-900 pt-6">
    Bookealo Platform &copy; 2026 &bull; Equipo de Desarrollo &bull; Protocolo Git Flow feat/rol3-backend-core
  </footer>
</body>
</html>
    `);
  });

  // Montar rutas de API
  app.use('/api/restaurants', restaurantRoutes);
  app.use('/api/reservations', reservationRoutes);
  app.use('/api/crm', crmRoutes);
  app.use('/api/reviews', reviewsRoutes);
  app.use('/api/nfc', nfcRoutes);

  // Manejador 404 y Errores
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
