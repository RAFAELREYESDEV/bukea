'use client';

import React from 'react';
import { CalendarCheck, MapPin, Users, Clock, QrCode, MessageCircle, ExternalLink, Compass } from 'lucide-react';
import { StoredReservation } from '../data/businesses';

interface ReservasViewProps {
  reservations: StoredReservation[];
  onExploreClick: () => void;
  onCancelReservation?: (code: string) => void;
}

export default function ReservasView({ reservations, onExploreClick, onCancelReservation }: ReservasViewProps) {
  return (
    <div className="max-w-xl mx-auto px-4 pb-28 pt-2">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-semibold mb-2 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
          <CalendarCheck size={13} className="text-amber-400" />
          <span>Gestión de Pases & Mesas</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
          Mis <span className="gradient-gold-text">Reservas</span>
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
          Tus códigos de estatus y confirmaciones en tiempo real para presentar en el restaurante.
        </p>
      </div>

      {reservations.length === 0 ? (
        <div className="luxury-card p-8 text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-3xl mx-auto mb-4">
            🍽️
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Aún no tienes reservas activas</h3>
          <p className="text-slate-400 text-xs max-w-xs mx-auto mb-6 leading-relaxed">
            Descubre las mejores mesas gastronómicas, posadas boutique y clubes de playa en Margarita.
          </p>
          <button onClick={onExploreClick} className="btn-gold mx-auto">
            <Compass size={16} />
            <span>Explorar Experiencias</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((res) => (
            <div key={res.code} className="luxury-card p-5 overflow-hidden relative">
              {/* Badge de Estado */}
              <div className="flex items-center justify-between mb-3">
                <span className="badge-gold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Mesa Confirmada
                </span>
                <span className="text-[11px] font-mono font-bold text-amber-300 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
                  {res.code}
                </span>
              </div>

              {/* Contenido Principal */}
              <div className="flex gap-4 items-center">
                <img
                  src={res.businessImage}
                  alt={res.businessName}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-white truncate">{res.businessName}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                    <MapPin size={13} className="text-amber-400 shrink-0" />
                    <span className="truncate">{res.businessAddress}</span>
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-slate-500" />
                      {res.date} · {res.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} className="text-slate-500" />
                      {res.guests} personas
                    </span>
                  </div>
                </div>
              </div>

              {/* Beneficios VIP asignados */}
              {res.perks && res.perks.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-[11px] text-amber-200/90">
                  <span>👑 {res.perks[0]}</span>
                </div>
              )}

              {/* Botones de Acción */}
              <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/${res.guestPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, tengo la reserva ${res.code} a nombre de ${res.guestName}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-glass text-xs py-2"
                >
                  <MessageCircle size={14} className="text-emerald-400" />
                  <span>Maitre WhatsApp</span>
                </a>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${res.businessName} Margarita`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-glass text-xs py-2"
                >
                  <ExternalLink size={14} className="text-amber-400" />
                  <span>Cómo Llegar</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
