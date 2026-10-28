'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Star, 
  Compass, 
  Glasses, 
  Rotate3d, 
  Calendar, 
  ArrowRight, 
  ChevronRight,
  Filter,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { Business, BUSINESSES_MOCK, StoredReservation } from './data/businesses';
import BottomNav, { NavTab } from './components/BottomNav';
import WalletView from './components/WalletView';
import ReservasView from './components/ReservasView';

// Carga diferida de Google Maps
const GoogleMapa = dynamic(() => import('./components/GoogleMapa'), {
  ssr: false,
  loading: () => (
    <div className="h-72 rounded-3xl bg-neutral-900/60 border border-white/10 flex items-center justify-center text-slate-500 text-xs animate-pulse">
      Cargando mapa interactivo de Margarita…
    </div>
  ),
});

const CATEGORIES = ['Todos', 'Restaurante', 'Club', 'Posada', 'Terraza'];

export default function Home() {
  const [bizs, setBizs] = useState<Business[]>(BUSINESSES_MOCK);
  const [cat, setCat] = useState('Todos');
  const [only360, setOnly360] = useState(false);
  const [onlyAR, setOnlyAR] = useState(false);
  const [q, setQ] = useState('');
  const [navTab, setNavTab] = useState<NavTab>('explorar');
  const [reservations, setReservations] = useState<StoredReservation[]>([]);
  const [selectedMapBiz, setSelectedMapBiz] = useState<Business | null>(null);
  const router = useRouter();

  // Carga de reservas persistentes
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bukea_reservations');
      if (saved) {
        setReservations(JSON.parse(saved));
      }
    } catch {
      // Ignorar errores de localStorage
    }
  }, []);

  // Intentar cargar datos de la API Fastify de Rol 3 (con fallback automático a datos semilla)
  useEffect(() => {
    fetch('/api/web/businesses')
      .then((r) => r.json())
      .then((d) => {
        const fetched = d.businesses || d.items || d;
        if (Array.isArray(fetched) && fetched.length > 0) {
          // Combinar campos ricos con lo retornado por la API
          const merged = fetched.map((item: any) => {
            const foundMock = BUSINESSES_MOCK.find(m => m.id === item.id || m.slug === item.slug);
            return foundMock ? { ...foundMock, ...item } : item;
          });
          setBizs(merged);
        }
      })
      .catch(() => {
        // Fallback natural a BUSINESSES_MOCK
      });
  }, []);

  // Filtrado reactivo de negocios
  const filteredBizs = useMemo(() => {
    return bizs.filter((b) => {
      const matchCat = cat === 'Todos' || b.category === cat;
      const match360 = !only360 || Boolean(b.tour_360);
      const matchAR = !onlyAR || Boolean(b.hasAR);
      const matchQuery =
        !q ||
        b.name.toLowerCase().includes(q.toLowerCase()) ||
        b.cuisine.toLowerCase().includes(q.toLowerCase()) ||
        (b.zone || '').toLowerCase().includes(q.toLowerCase()) ||
        (b.address || '').toLowerCase().includes(q.toLowerCase());

      return matchCat && match360 && matchAR && matchQuery;
    });
  }, [bizs, cat, only360, onlyAR, q]);

  return (
    <div className="min-h-screen bg-[#07080b] text-slate-100 selection:bg-amber-400 selection:text-black">
      {/* Topbar Luxury */}
      <header className="luxury-header">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center text-black font-extrabold text-base shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              B
            </div>
            <div>
              <div className="font-display font-extrabold text-lg tracking-tight text-white flex items-center gap-1">
                Bookealo<span className="text-amber-400 text-xl leading-none">.</span>
              </div>
              <div className="text-[10px] text-amber-200/80 tracking-widest uppercase font-mono">
                Margarita VIP Edition
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setNavTab('wallet')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-amber-400/30 text-amber-300 text-xs font-semibold hover:bg-white/10 transition-colors"
            >
              <Sparkles size={13} className="text-amber-400" />
              <span className="hidden sm:inline">Pase VIP</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          </div>
        </div>
      </header>

      {/* Sub-vistas controladas por el Bottom Nav */}
      {navTab === 'wallet' && (
        <main className="pt-4">
          <WalletView
            reservations={reservations}
            onGoToReserve={() => setNavTab('explorar')}
          />
        </main>
      )}

      {navTab === 'reservas' && (
        <main className="pt-4">
          <ReservasView
            reservations={reservations}
            onExploreClick={() => setNavTab('explorar')}
          />
        </main>
      )}

      {(navTab === 'explorar' || navTab === 'mapa') && (
        <main className="max-w-4xl mx-auto px-4 pb-28 pt-4">
          {/* Banner de Bienvenida y Propuesta de Valor */}
          <div className="relative rounded-3xl p-6 sm:p-8 mb-6 overflow-hidden border border-amber-400/20 bg-gradient-to-r from-amber-950/40 via-black to-neutral-900 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-bold mb-3">
                <Flame size={13} className="text-amber-400" />
                <span>El Trato Real · Reservas de Estatus</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display text-white leading-tight">
                Las mejores mesas de Margarita, <span className="gradient-gold-text">en un toque.</span>
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                Inmersión 360°, menús en Realidad Aumentada y acceso preferencial en Beach Clubs, alta gastronomía y posadas boutique.
              </p>
            </div>
          </div>

          {/* Barra de Búsqueda Premium */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por restaurante, cocina (mariscos, carnes) o zona (Pampatar, Playa El Agua)..."
              className="luxury-input pl-11 pr-4 py-3.5 text-sm rounded-2xl"
            />
            {q && (
              <button
                onClick={() => setQ('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Selector de Categorías & Filtros Rápidos */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-5 -mx-4 px-4">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                data-active={cat === c}
                onClick={() => setCat(c)}
                className="category-chip"
              >
                {c === 'Todos' && '✨ Todos'}
                {c === 'Restaurante' && '🍽️ Restaurantes'}
                {c === 'Club' && '🏖️ Beach Clubs'}
                {c === 'Posada' && '🏨 Posadas'}
                {c === 'Terraza' && '🍸 Terrazas'}
              </button>
            ))}

            <button
              onClick={() => setOnly360(!only360)}
              data-active={only360}
              className="category-chip"
            >
              <Glasses size={14} />
              <span>Tour 360°</span>
            </button>

            <button
              onClick={() => setOnlyAR(!onlyAR)}
              data-active={onlyAR}
              className="category-chip"
            >
              <Rotate3d size={14} />
              <span>Platos AR</span>
            </button>
          </div>

          {/* Sub-selector Vista: Feed vs Mapa */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {filteredBizs.length} {filteredBizs.length === 1 ? 'Lugar Exclusivo' : 'Lugares Exclusivos'}
            </div>

            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setNavTab('explorar')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  navTab === 'explorar'
                    ? 'bg-amber-400 text-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tarjetas
              </button>
              <button
                onClick={() => setNavTab('mapa')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  navTab === 'mapa'
                    ? 'bg-amber-400 text-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mapa 360°
              </button>
            </div>
          </div>

          {/* VISTA MAPA */}
          {navTab === 'mapa' && (
            <div className="space-y-4 mb-6 animate-in fade-in">
              <div className="rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
                <GoogleMapa
                  bizs={filteredBizs}
                  onPick={(id) => {
                    const found = filteredBizs.find((b) => b.id === id);
                    if (found) setSelectedMapBiz(found);
                  }}
                />
              </div>

              {selectedMapBiz && (
                <div className="luxury-card p-4 flex gap-4 items-center animate-in slide-in-from-bottom-3 border-amber-400/40">
                  <img
                    src={selectedMapBiz.heroImage}
                    alt={selectedMapBiz.name}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                      <Star size={13} fill="currentColor" />
                      <span>{selectedMapBiz.rating}</span>
                      <span className="text-slate-400 font-normal">({selectedMapBiz.reviewCount})</span>
                    </div>
                    <div className="font-bold text-white text-base truncate mt-0.5">{selectedMapBiz.name}</div>
                    <div className="text-xs text-slate-400 truncate">{selectedMapBiz.cuisine} · {selectedMapBiz.zone}</div>
                  </div>
                  <button
                    onClick={() => router.push(`/lugar/${selectedMapBiz.id}`)}
                    className="btn-gold text-xs py-2 px-3 shrink-0"
                  >
                    <span>Ver</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* VISTA TARJETAS (FEED LUXURY) */}
          {navTab === 'explorar' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredBizs.map((biz) => (
                <div
                  key={biz.id}
                  className="luxury-card overflow-hidden group flex flex-col justify-between"
                >
                  {/* Foto de Portada con Badges Flotantes */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={biz.heroImage}
                      alt={biz.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                    {/* Badge Superior Izquierdo: Categoría & Zona */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="badge-dark text-[11px]">
                        {biz.category}
                      </span>
                      {biz.featuredBadge && (
                        <span className="badge-gold text-[10px]">
                          {biz.featuredBadge}
                        </span>
                      )}
                    </div>

                    {/* Badge Superior Derecho: Rating */}
                    <div className="absolute top-3 right-3 badge-dark text-amber-300 font-bold text-xs flex items-center gap-1 shadow-md">
                      <Star size={12} fill="currentColor" className="text-amber-400" />
                      <span>{biz.rating.toFixed(1)}</span>
                      <span className="text-slate-400 text-[10px] font-normal">({biz.reviewCount})</span>
                    </div>

                    {/* Inmersión Tags (Inferior Izquierda sobre imagen) */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      {biz.tour_360 && (
                        <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold flex items-center gap-1">
                          <Glasses size={11} className="text-amber-400" />
                          <span>360°</span>
                        </span>
                      )}
                      {biz.hasAR && (
                        <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold flex items-center gap-1">
                          <Rotate3d size={11} className="text-cyan-400" />
                          <span>AR Platos</span>
                        </span>
                      )}
                    </div>

                    {/* Rango de precio */}
                    <div className="absolute bottom-3 right-3 text-white text-xs font-bold font-mono tracking-wider drop-shadow">
                      {biz.priceRange}
                    </div>
                  </div>

                  {/* Cuerpo de la Tarjeta */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                          {biz.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2.5">
                        <MapPin size={13} className="text-amber-400 shrink-0" />
                        <span className="font-medium text-slate-300">{biz.zone}</span>
                        <span>·</span>
                        <span>{biz.cuisine}</span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        {biz.shortDesc}
                      </p>

                      {/* Beneficio VIP / Perk */}
                      {biz.perks && biz.perks[0] && (
                        <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 mb-4 flex items-center gap-2 text-xs text-amber-200">
                          <span className="text-sm">👑</span>
                          <span className="text-[11px] font-medium leading-tight">
                            {biz.perks[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Botón de Acción Principal */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                      <div className="text-[11px] text-slate-400">
                        {biz.schedule.split('·')[0]}
                      </div>

                      <Link
                        href={`/lugar/${biz.id}`}
                        className="btn-gold text-xs py-2 px-4 inline-flex items-center gap-1.5 font-bold"
                      >
                        <span>Reservar Mesa</span>
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredBizs.length === 0 && (
            <div className="luxury-card p-12 text-center my-8">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-base font-bold text-white mb-1">No encontramos resultados</h3>
              <p className="text-xs text-slate-400 mb-4">
                Prueba ajustando los filtros o buscando con otro término.
              </p>
              <button
                onClick={() => {
                  setCat('Todos');
                  setOnly360(false);
                  setOnlyAR(false);
                  setQ('');
                }}
                className="btn-glass text-xs"
              >
                Restablecer Filtros
              </button>
            </div>
          )}
        </main>
      )}

      {/* Dock de Navegación Inferior Fijo */}
      <BottomNav
        activeTab={navTab}
        onChangeTab={(t) => setNavTab(t)}
        reservationCount={reservations.length}
      />
    </div>
  );
}
