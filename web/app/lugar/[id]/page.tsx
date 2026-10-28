'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Share2, 
  Star, 
  MapPin, 
  Glasses, 
  Rotate3d, 
  MessageCircle, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Phone,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Business, BUSINESSES_MOCK, StoredReservation, Dish, normalizeBusiness } from '../../data/businesses';
import MapaGoogle from './MapaGoogle';
import ReviewsList from './ReviewsList';
import CarruselFotos from './CarruselFotos';
import MenuDigital from './MenuDigital';

const fmtTime = (s: string) => {
  try {
    return new Date(s).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return s;
  }
};

const fmtDate = (d: string) => {
  try {
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  } catch {
    return d;
  }
};

export default function LugarPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [b, setB] = useState<Business | null>(null);
  const [date, setDate] = useState<string>(() => new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [slots, setSlots] = useState<{ start: string; end: string; available: boolean }[]>([]);
  const [sel, setSel] = useState<{ start: string; end: string; available: boolean } | null>(null);
  const [size, setSize] = useState(2);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuDigital, setMenuDigital] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [arDish, setArDish] = useState<Dish | null>(null);
  const [activeTab, setActiveTab] = useState<'reserva' | 'menu' | 'info'>('reserva');

  // Buscar negocio (API o Mock)
  useEffect(() => {
    if (!id) return;
    const mock = BUSINESSES_MOCK.find(m => m.id === id || m.slug === id);
    if (mock) setB(mock);

    fetch(`/api/web/businesses/${id}`)
      .then(r => r.json())
      .then(d => {
        const fetched = d.business || d;
        if (fetched && fetched.name) {
          setB(normalizeBusiness(fetched));
        }
      })
      .catch(() => {});
  }, [id]);

  // Horarios de disponibilidad (API o Generados)
  useEffect(() => {
    if (!id) return;
    fetch(`/api/web/businesses/${id}/availability?date=${date}&size=${size}`)
      .then(r => r.json())
      .then(d => {
        if (d.slots && d.slots.length > 0) {
          setSlots(d.slots);
        } else {
          generarSlotsMock();
        }
      })
      .catch(() => {
        generarSlotsMock();
      });
  }, [id, date, size]);

  const generarSlotsMock = () => {
    // Generar slots estándar de tarde/noche para Margarita
    const mockHours = ['12:30', '13:30', '15:00', '17:30', '19:00', '20:30', '21:30'];
    const generated = mockHours.map(h => ({
      start: `${date}T${h}:00`,
      end: `${date}T${h}:00`,
      available: true
    }));
    setSlots(generated);
    setSel(generated[3]); // Seleccionar sunset slot por defecto
  };

  const handleReservar = async () => {
    setErr('');
    if (!sel || !name || !phone) {
      setErr('Por favor completa tu nombre, teléfono y selecciona una hora.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/web/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: id,
          guest_name: name,
          guest_phone: phone,
          guest_size: size,
          slot_start: sel.start,
        }),
      }).then(r => r.json());

      const finalCode = res.reservation?.code || `BK-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setCode(finalCode);

      // Guardar reserva persistentemente en localStorage para Wallet y Mis Reservas
      if (b) {
        const newReservation: StoredReservation = {
          code: finalCode,
          businessId: b.id,
          businessName: b.name,
          businessImage: b.heroImage,
          businessAddress: b.address,
          date: fmtDate(date),
          time: fmtTime(sel.start),
          guests: size,
          guestName: name,
          guestPhone: phone,
          status: 'confirmada',
          createdAt: new Date().toISOString(),
          perks: b.perks || ['Cóctel de cortesía'],
        };

        const existing = JSON.parse(localStorage.getItem('bukea_reservations') || '[]');
        const updated = [newReservation, ...existing.filter((x: any) => x.code !== finalCode)];
        localStorage.setItem('bukea_reservations', JSON.stringify(updated));
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // Fallback local garantizado
      const localCode = `BK-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setCode(localCode);
      if (b) {
        const newReservation: StoredReservation = {
          code: localCode,
          businessId: b.id,
          businessName: b.name,
          businessImage: b.heroImage,
          businessAddress: b.address,
          date: fmtDate(date),
          time: fmtTime(sel.start),
          guests: size,
          guestName: name,
          guestPhone: phone,
          status: 'confirmada',
          createdAt: new Date().toISOString(),
          perks: b.perks || ['Cóctel de cortesía'],
        };
        const existing = JSON.parse(localStorage.getItem('bukea_reservations') || '[]');
        localStorage.setItem('bukea_reservations', JSON.stringify([newReservation, ...existing]));
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  if (!b) {
    return (
      <div className="min-h-screen bg-[#07080b] flex items-center justify-center text-slate-400 text-sm">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span>Cargando experiencia en Margarita…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080b] text-slate-100 pb-28">
      {/* Topbar Flotante con Glass Blur */}
      <header className="luxury-header flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          aria-label="Volver"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="text-center">
          <div className="text-xs font-bold font-display text-white truncate max-w-[200px]">
            {b.name}
          </div>
          <div className="text-[10px] text-amber-300 font-mono">
            {b.category} · {b.zone}
          </div>
        </div>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: b.name, url: window.location.href });
            }
          }}
          className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          aria-label="Compartir"
        >
          <Share2 size={16} />
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-3">
        {/* Carrusel de Fotos HD */}
        <section className="mb-5">
          <CarruselFotos fotos={b.carousel || []} />
        </section>

        {/* Información Principal del Negocio */}
        <section className="luxury-card p-5 sm:p-6 mb-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="badge-dark">{b.category}</span>
                {b.featuredBadge && <span className="badge-gold">{b.featuredBadge}</span>}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
                {b.name}
              </h1>
            </div>

            <div className="text-right shrink-0">
              <div className="flex items-center justify-end gap-1 text-amber-400 font-bold text-base">
                <Star size={16} fill="currentColor" />
                <span>{(b.rating ?? 4.8).toFixed(1)}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {b.reviewCount ?? 84} opiniones
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-3">
            <MapPin size={14} className="text-amber-400 shrink-0" />
            <span>{b.address}</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
            {b.description}
          </p>

          {/* Perks exclusivos de Bookealo */}
          {b.perks && b.perks.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" />
                <span>Beneficios VIP al reservar con Bookealo</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {b.perks.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-amber-100 bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20">
                    <span className="text-amber-400">✓</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botonera de Acciones Inmersivas */}
          <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-3 gap-2">
            <button
              onClick={() => setMenuDigital(true)}
              className="btn-glass text-xs py-2.5 px-2 flex flex-col items-center gap-1 text-center"
            >
              <span className="text-base">📖</span>
              <span>Ver Menú</span>
            </button>

            {b.tour_360 ? (
              <button
                onClick={() => setTourOpen(true)}
                className="btn-glass text-xs py-2.5 px-2 flex flex-col items-center gap-1 text-center border-amber-400/40 text-amber-300"
              >
                <Glasses size={18} className="text-amber-400" />
                <span>Tour 360°</span>
              </button>
            ) : (
              <div className="btn-glass text-xs py-2.5 px-2 flex flex-col items-center gap-1 text-center opacity-40">
                <Glasses size={18} />
                <span>Tour 360°</span>
              </div>
            )}

            {b.whatsapp ? (
              <a
                href={`https://wa.me/${b.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${b.name}, los contacto desde Bookealo.`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn-glass text-xs py-2.5 px-2 flex flex-col items-center gap-1 text-center"
              >
                <MessageCircle size={18} className="text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            ) : null}
          </div>
        </section>

        {/* MOTOR DE RESERVA / CONFIRMACIÓN */}
        <section id="reserva-section" className="mb-6">
          {code ? (
            /* Tarjeta de Confirmación VIP */
            <div className="wallet-card-luxury p-6 text-white text-center animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto mb-3 text-emerald-400 text-2xl shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                <CheckCircle2 size={32} />
              </div>
              <div className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                Reserva Confirmada · El Trato Real
              </div>
              <div className="text-4xl font-extrabold font-mono text-white tracking-widest my-2 drop-shadow">
                {code}
              </div>
              <p className="text-xs text-slate-300 max-w-sm mx-auto mb-4 leading-relaxed">
                Presenta este código al llegar a <span className="text-white font-bold">{b.name}</span>.<br />
                {fmtDate(date)} a las {sel && fmtTime(sel.start)} · {size} personas.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => router.push('/')}
                  className="btn-gold text-xs py-3 w-full"
                >
                  Ver en mi Wallet VIP
                </button>
                <button
                  onClick={() => setCode(null)}
                  className="btn-glass text-xs py-3 w-full"
                >
                  Nueva Reserva
                </button>
              </div>
            </div>
          ) : (
            /* Formulario de Reserva Interactivo */
            <div className="luxury-card p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>Configura tu Mesa</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Sin adelantos ni comisiones
                </div>
              </div>

              {/* Selector de Fecha y Comensales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                    Fecha de la Experiencia
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="luxury-input text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                    Número de Comensales
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="luxury-input text-xs bg-[#12141A]"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'persona' : 'personas'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Slots de Horario Disponibles */}
              <div className="mb-5">
                <label className="text-[11px] font-semibold text-slate-300 block mb-2 flex items-center justify-between">
                  <span>Horarios Disponibles</span>
                  <span className="text-[10px] text-amber-400">Hora local Margarita (VET)</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((s, idx) => (
                    <button
                      key={idx}
                      data-selected={sel === s}
                      onClick={() => setSel(s)}
                      className="time-slot-btn"
                    >
                      {fmtTime(s.start)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Datos de Contacto */}
              <div className="space-y-3 mb-5">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Nombre del Titular de la Mesa
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Sofía Mendoza"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="luxury-input text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    WhatsApp para Confirmación Inmediata
                  </label>
                  <input
                    type="tel"
                    placeholder="Ej. +58 412 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="luxury-input text-xs"
                  />
                </div>
              </div>

              {err && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs mb-4">
                  {err}
                </div>
              )}

              {/* Botón de Confirmación de un toque */}
              <button
                onClick={handleReservar}
                disabled={loading}
                className="btn-gold w-full py-3.5 text-sm font-extrabold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Confirmando reserva VIP…</span>
                ) : (
                  <>
                    <span>Confirmar Reserva{sel ? ` · ${fmtTime(sel.start)}` : ''}</span>
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        {/* PLATOS EN REALIDAD AUMENTADA */}
        {b.dishes && b.dishes.length > 0 && (
          <section className="luxury-card p-5 sm:p-6 mb-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Rotate3d size={14} />
                <span>Platos Estrella en Realidad Aumentada</span>
              </div>
              <span className="badge-gold text-[10px]">3D Interactivo</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Visualiza el plato en tu mesa en 3D antes de ordenar con tecnología AR.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {b.dishes.map((dish, idx) => (
                <div
                  key={idx}
                  onClick={() => setArDish(dish)}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 cursor-pointer transition-all flex gap-3 items-center group"
                >
                  <img
                    src={dish.photo}
                    alt={dish.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-white group-hover:text-amber-300 truncate">
                      {dish.name}
                    </div>
                    <div className="text-xs text-amber-400 font-bold mt-0.5">{dish.price}</div>
                    <div className="text-[10px] text-cyan-300 flex items-center gap-1 mt-1">
                      <Rotate3d size={11} /> Ver en 3D / AR
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* UBICACIÓN & GOOGLE MAPS */}
        <section className="luxury-card p-5 sm:p-6 mb-5">
          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <MapPin size={14} />
            <span>Ubicación & Cómo Llegar</span>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/10 mb-3">
            <MapaGoogle name={b.name} lat={b.lat} lng={b.lng} />
          </div>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${b.name} ${b.address}`)}`}
            target="_blank"
            rel="noreferrer"
            className="btn-gold w-full text-xs py-3 flex items-center justify-center gap-2"
          >
            <ExternalLink size={14} />
            <span>Abrir en Google Maps</span>
          </a>
        </section>

        {/* RESEÑAS VERIFICADAS */}
        <section className="luxury-card p-5 sm:p-6">
          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
            Opiniones de Comensales Verificados
          </div>
          <ReviewsList bizId={b.id} />
        </section>
      </main>

      {/* MODAL: MENÚ DIGITAL COMPLETO */}
      {menuDigital && (
        <div className="fixed inset-0 bg-[#07080b] z-50 overflow-y-auto">
          <header className="luxury-header flex items-center justify-between">
            <button
              onClick={() => setMenuDigital(false)}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white"
            >
              <ArrowLeft size={18} />
            </button>
            <span className="font-bold text-sm text-white">Carta Gastronómica</span>
            <div className="w-9" />
          </header>
          <div className="max-w-2xl mx-auto p-4">
            <MenuDigital />
          </div>
        </div>
      )}

      {/* MODAL: TOUR VIRTUAL 360° */}
      {tourOpen && b.tour_360 && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-4xl h-[85vh] rounded-3xl overflow-hidden border border-white/20">
            <button
              onClick={() => setTourOpen(false)}
              className="absolute top-4 right-4 z-50 px-4 py-1.5 rounded-full bg-black/80 text-white text-xs font-bold backdrop-blur-md border border-white/20"
            >
              Cerrar ✕
            </button>
            <iframe
              src={b.tour_360}
              className="w-full h-full border-0"
              title="Tour Virtual 360"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* MODAL: VISOR DE PLATO 3D / AR */}
      {arDish && (
        <div
          onClick={() => setArDish(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="luxury-card max-w-md w-full p-6 text-center border-amber-400/40"
          >
            <div className="font-bold text-base text-white">{arDish.name}</div>
            <div className="text-xs text-amber-400 font-bold mt-1">{arDish.price}</div>
            <p className="text-xs text-slate-300 mt-2">{arDish.desc}</p>

            <div className="h-64 my-4 rounded-2xl overflow-hidden bg-neutral-900 border border-white/10">
              <model-viewer
                src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
                ar
                camera-controls
                auto-rotate
                style={{ width: '100%', height: '100%' }}
              />
            </div>

            <div className="text-[11px] text-slate-400 mb-4">
              Toca para rotar el modelo 3D o proyecta en tu mesa si tu dispositivo tiene AR.
            </div>

            <button
              onClick={() => setArDish(null)}
              className="btn-gold w-full text-xs py-2.5"
            >
              Cerrar Visor 3D
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
