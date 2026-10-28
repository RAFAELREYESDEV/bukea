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
  Box, 
  ArrowRight, 
  ChevronRight,
  ChevronDown,
  Navigation,
  Check,
  X,
  UtensilsCrossed,
  SunMedium,
  Building2,
  Wine
} from 'lucide-react';
import { Business, BUSINESSES_MOCK, StoredReservation, normalizeBusiness } from './data/businesses';
import BottomNav, { NavTab } from './components/BottomNav';
import WalletView from './components/WalletView';
import ReservasView from './components/ReservasView';

// Carga diferida de Google Maps
const GoogleMapa = dynamic(() => import('./components/GoogleMapa'), {
  ssr: false,
  loading: () => (
    <div className="h-72 rounded-3xl bg-neutral-100 border border-black/10 flex items-center justify-center text-neutral-400 text-xs font-text">
      Cargando mapa de Margarita…
    </div>
  ),
});

const CATEGORIES = [
  { id: 'Todos', label: 'Todos', icon: Compass },
  { id: 'Restaurante', label: 'Restaurantes', icon: UtensilsCrossed },
  { id: 'Club', label: 'Beach Clubs', icon: SunMedium },
  { id: 'Posada', label: 'Posadas', icon: Building2 },
  { id: 'Terraza', label: 'Terrazas', icon: Wine },
];

const DESTINATIONS = [
  { id: 'Margarita', label: 'Margarita', desc: 'Pampatar, Playa El Agua, Porlamar', available: true },
  { id: 'Caracas', label: 'Caracas', desc: 'Las Mercedes, Altamira, El Hatillo', available: true },
  { id: 'Lechería', label: 'Lechería', desc: 'El Morro, Plaza Mayor', available: false },
  { id: 'Los Roques', label: 'Los Roques', desc: 'Gran Roque, Playas VIP', available: false },
];

export default function Home() {
  const [bizs, setBizs] = useState<Business[]>(BUSINESSES_MOCK);
  const [cat, setCat] = useState('Todos');
  const [only360, setOnly360] = useState(false);
  const [onlyAR, setOnlyAR] = useState(false);
  const [q, setQ] = useState('');
  const [navTab, setNavTab] = useState<NavTab>('explorar');
  const [reservations, setReservations] = useState<StoredReservation[]>([]);
  const [selectedMapBiz, setSelectedMapBiz] = useState<Business | null>(null);
  const [currentLocation, setCurrentLocation] = useState('Margarita');
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const router = useRouter();

  // Carga de ubicación guardada
  useEffect(() => {
    try {
      const savedLoc = localStorage.getItem('bukea_user_location');
      if (savedLoc) {
        setCurrentLocation(savedLoc);
      }
    } catch {
      // Ignorar
    }
  }, []);

  const handleSelectLocation = (loc: string) => {
    setCurrentLocation(loc);
    try {
      localStorage.setItem('bukea_user_location', loc);
    } catch {
      // Ignorar
    }
    setTimeout(() => {
      setLocationModalOpen(false);
      setLocationNotice(null);
    }, 200);
  };

  const detectLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationNotice('Geolocalización no soportada en este navegador.');
      return;
    }
    setIsDetectingLocation(true);
    setLocationNotice('Detectando tu ubicación por GPS…');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingLocation(false);
        const { latitude, longitude } = pos.coords;
        // Isla de Margarita (~10.8° a 11.2° N, -64.4° a -63.7° W)
        if (latitude >= 10.7 && latitude <= 11.3 && longitude >= -64.6 && longitude <= -63.6) {
          handleSelectLocation('Margarita');
          setLocationNotice('¡Ubicación detectada: Isla de Margarita!');
        } else if (latitude >= 10.2 && latitude <= 10.6 && longitude >= -67.2 && longitude <= -66.6) {
          handleSelectLocation('Caracas');
          setLocationNotice('¡Ubicación detectada: Caracas!');
        } else {
          // Destino por defecto
          handleSelectLocation('Margarita');
          setLocationNotice('Detectamos tu región. Mostrando exclusividades en Margarita.');
        }
      },
      () => {
        setIsDetectingLocation(false);
        setLocationNotice('No se pudo acceder al GPS. Selecciona tu ciudad manualmente.');
      },
      { timeout: 8000 }
    );
  };

  // Carga de reservas persistentes
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bukea_reservations');
      if (saved) {
        setReservations(JSON.parse(saved));
      }
    } catch {
      // Ignorar errores
    }
  }, []);

  // Cargar datos de la API Fastify de Rol 3
  useEffect(() => {
    fetch('/api/web/businesses')
      .then((r) => r.json())
      .then((d) => {
        const fetched = d.businesses || d.items || d;
        if (Array.isArray(fetched) && fetched.length > 0) {
          const normalized = fetched.map((item: any) => normalizeBusiness(item));
          setBizs(normalized);
        }
      })
      .catch(() => {
        // Fallback natural a datos semilla
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
    <div className="min-h-screen bg-white text-[#0A0A0A] font-text">
      {/* Header Liquid Glass */}
      <header className="liquid-glass-header">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-logo text-4xl text-black leading-none pt-1">
              Bukea
            </span>
            <button
              onClick={() => setLocationModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-neutral-100 transition-colors border-l border-black/15 pl-3 cursor-pointer group"
              title="Cambiar destino o ubicación"
            >
              <MapPin size={11} className="text-neutral-500 group-hover:text-black transition-colors" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-600 group-hover:text-black font-semibold font-text">
                {currentLocation}
              </span>
              <ChevronDown size={11} className="text-neutral-400 group-hover:text-black transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setNavTab('wallet')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-black/10 text-neutral-800 text-xs font-semibold hover:bg-neutral-200 transition-colors"
            >
              <Sparkles size={12} className="text-neutral-700" />
              <span className="hidden sm:inline">Pase Digital</span>
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
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
          {/* Banner Editorial Minimalista Liquid Glass (Sin Gradients) */}
          <div className="liquid-glass-card p-6 sm:p-8 mb-6 bg-white">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-black/10 text-neutral-800 text-[11px] font-semibold tracking-wider uppercase mb-3">
                <Sparkles size={12} className="text-neutral-600" />
                <span>Ecosistema de Reservas & Inmersión</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black leading-tight font-text">
                Reservas exclusivas, <span className="font-accent italic font-normal text-4xl sm:text-5xl">en un toque.</span>
              </h1>
              <p className="text-neutral-600 text-xs sm:text-sm mt-2 leading-relaxed font-text">
                Tours virtuales 360°, platos en Realidad Aumentada y acceso preferencial en los mejores restaurantes, clubes de playa y posadas.
              </p>
            </div>
          </div>

          {/* Barra de Búsqueda Minimalista */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={17} />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por restaurante, comida (italiana, nikkei, marina) o zona..."
              className="input-minimal pl-11 pr-4 py-3.5 text-sm rounded-2xl"
            />
            {q && (
              <button
                onClick={() => setQ('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-black"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Selector de Categorías (Sin Emojis, con Iconos Minimalistas) */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-5 -mx-4 px-4">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  data-active={cat === c.id}
                  onClick={() => setCat(c.id)}
                  className="chip-minimal"
                >
                  <Icon size={14} />
                  <span>{c.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => setOnly360(!only360)}
              data-active={only360}
              className="chip-minimal"
            >
              <Glasses size={14} />
              <span>Tour 360°</span>
            </button>

            <button
              onClick={() => setOnlyAR(!onlyAR)}
              data-active={onlyAR}
              className="chip-minimal"
            >
              <Box size={14} />
              <span>Platos AR</span>
            </button>
          </div>

          {/* Sub-selector Vista: Feed vs Mapa */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              {filteredBizs.length} {filteredBizs.length === 1 ? 'Lugar' : 'Lugares'}
            </div>

            <div className="flex bg-neutral-100 p-1 rounded-full border border-black/5 text-xs">
              <button
                onClick={() => setNavTab('explorar')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  navTab === 'explorar'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                Tarjetas
              </button>
              <button
                onClick={() => setNavTab('mapa')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  navTab === 'mapa'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                Mapa
              </button>
            </div>
          </div>

          {/* VISTA MAPA */}
          {navTab === 'mapa' && (
            <div className="space-y-4 mb-6">
              <div className="rounded-3xl overflow-hidden border border-black/10 shadow-sm">
                <GoogleMapa
                  bizs={filteredBizs}
                  onPick={(id) => {
                    const found = filteredBizs.find((b) => b.id === id);
                    if (found) setSelectedMapBiz(found);
                  }}
                />
              </div>

              {selectedMapBiz && (
                <div className="liquid-glass-card p-4 flex gap-4 items-center bg-white border-black/15">
                  <img
                    src={selectedMapBiz.heroImage}
                    alt={selectedMapBiz.name}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-black/10"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-xs text-black font-semibold">
                      <Star size={12} fill="currentColor" />
                      <span>{(selectedMapBiz.rating ?? 4.8).toFixed(1)}</span>
                      <span className="text-neutral-400 font-normal">({selectedMapBiz.reviewCount ?? 84})</span>
                    </div>
                    <div className="font-bold text-black text-base truncate mt-0.5">{selectedMapBiz.name}</div>
                    <div className="text-xs text-neutral-500 truncate">{selectedMapBiz.cuisine} · {selectedMapBiz.zone}</div>
                  </div>
                  <button
                    onClick={() => router.push(`/lugar/${selectedMapBiz.id}`)}
                    className="btn-solid text-xs py-2 px-3 shrink-0"
                  >
                    <span>Ver</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* VISTA TARJETAS (FEED EDITORIAL LIQUID GLASS EN BLANCO) */}
          {navTab === 'explorar' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredBizs.map((biz) => (
                <div
                  key={biz.id}
                  className="liquid-glass-card overflow-hidden group flex flex-col justify-between bg-white"
                >
                  {/* Foto con Badges Minimalistas */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={biz.heroImage}
                      alt={biz.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Badge Superior Izquierdo: Categoría & Zona */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="badge-minimal">
                        {biz.category}
                      </span>
                    </div>

                    {/* Badge Superior Derecho: Rating Minimal */}
                    <div className="absolute top-3 right-3 badge-minimal text-black font-semibold text-xs flex items-center gap-1 shadow-sm">
                      <Star size={11} fill="currentColor" className="text-black" />
                      <span>{(biz.rating ?? 4.8).toFixed(1)}</span>
                      <span className="text-neutral-500 text-[10px] font-normal">({biz.reviewCount ?? 84})</span>
                    </div>

                    {/* Tags Minimalistas Sobre Imagen */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                      {biz.tour_360 && (
                        <span className="badge-minimal text-[10px]">
                          <Glasses size={11} />
                          <span>360°</span>
                        </span>
                      )}
                      {biz.hasAR && (
                        <span className="badge-minimal text-[10px]">
                          <Box size={11} />
                          <span>AR</span>
                        </span>
                      )}
                    </div>

                    {/* Rango de precio */}
                    <div className="absolute bottom-3 right-3 badge-minimal text-[10px] font-mono">
                      {biz.priceRange}
                    </div>
                  </div>

                  {/* Cuerpo de la Tarjeta */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-lg font-bold text-black tracking-tight group-hover:text-neutral-700 transition-colors">
                          {biz.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-2.5">
                        <MapPin size={13} className="text-neutral-400 shrink-0" />
                        <span className="font-semibold text-neutral-800">{biz.zone}</span>
                        <span>·</span>
                        <span>{biz.cuisine}</span>
                      </div>

                      <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
                        {biz.shortDesc}
                      </p>

                      {/* Beneficio de Estatus */}
                      {biz.perks && biz.perks[0] && (
                        <div className="p-2.5 rounded-xl bg-neutral-50 border border-black/5 mb-4 flex items-center gap-2 text-xs text-neutral-800">
                          <span className="text-neutral-400 font-bold">•</span>
                          <span className="text-[11px] font-medium leading-tight">
                            {biz.perks[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Botón de Acción Principal */}
                    <div className="pt-3 border-t border-black/10 flex items-center justify-between gap-3">
                      <div className="text-[11px] text-neutral-400">
                        {biz.schedule.split('·')[0]}
                      </div>

                      <Link
                        href={`/lugar/${biz.id}`}
                        className="btn-solid text-xs py-2 px-4 inline-flex items-center gap-1 font-semibold"
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
            <div className="liquid-glass-card p-12 text-center my-8 bg-white">
              <h3 className="text-base font-bold text-black mb-1">No encontramos resultados</h3>
              <p className="text-xs text-neutral-500 mb-4">
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

      {/* Modal Selector de Destino / Ubicación */}
      {locationModalOpen && (
        <div
          onClick={() => setLocationModalOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white border border-black/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-4"
          >
            <div className="w-12 h-1 rounded-full bg-neutral-200 mx-auto mb-4 sm:hidden" />

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-base text-black">Selecciona tu Destino</h3>
                <p className="text-xs text-neutral-500">Explora locales y experiencias en tu zona</p>
              </div>
              <button
                onClick={() => setLocationModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:text-black transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Botón de Geodetección */}
            <button
              onClick={detectLocation}
              disabled={isDetectingLocation}
              className="w-full mb-4 p-3.5 rounded-2xl bg-neutral-50 border border-black/10 hover:bg-neutral-100 flex items-center justify-between text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                  <Navigation size={16} className={isDetectingLocation ? 'animate-spin' : ''} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-black group-hover:underline">
                    {isDetectingLocation ? 'Detectando señal GPS…' : 'Usar mi ubicación actual'}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Sincroniza automáticamente los locales más cercanos
                  </div>
                </div>
              </div>
            </button>

            {locationNotice && (
              <div className="mb-4 p-2.5 rounded-xl bg-neutral-100 border border-black/5 text-[11px] text-neutral-700 text-center animate-in fade-in">
                {locationNotice}
              </div>
            )}

            {/* Lista de Destinos Disponibles */}
            <div className="space-y-2 mb-4">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 px-1">
                Destinos BUKEA
              </div>
              {DESTINATIONS.map((dest) => {
                const isSelected = currentLocation.toLowerCase() === dest.label.toLowerCase();
                return (
                  <button
                    key={dest.id}
                    onClick={() => handleSelectLocation(dest.label)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                        : 'bg-white hover:bg-neutral-50 text-black border-black/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs ${
                          isSelected ? 'bg-white/10 text-white' : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        <MapPin size={14} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold flex items-center gap-2">
                          <span>{dest.label}</span>
                          {!dest.available && (
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : 'bg-neutral-100 text-neutral-500'
                              }`}
                            >
                              Próximamente
                            </span>
                          )}
                        </div>
                        <div
                          className={`text-[11px] ${
                            isSelected ? 'text-neutral-300' : 'text-neutral-500'
                          }`}
                        >
                          {dest.desc}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center">
                        <Check size={13} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] text-neutral-400 text-center">
              Tu selección se mantendrá guardada para tus próximas reservas.
            </div>
          </div>
        </div>
      )}

      {/* Dock de Navegación Inferior Fijo en Liquid Glass */}
      <BottomNav
        activeTab={navTab}
        onChangeTab={(t) => setNavTab(t)}
        reservationCount={reservations.length}
      />
    </div>
  );
}
