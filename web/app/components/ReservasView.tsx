'use client';

import React from 'react';
import { CalendarCheck, MapPin, Users, Clock, MessageCircle, ExternalLink, Compass } from 'lucide-react';
import { StoredReservation } from '../data/businesses';

interface ReservasViewProps {
  reservations: StoredReservation[];
  onExploreClick: () => void;
  onCancelReservation?: (code: string) => void;
}

export default function ReservasView({ reservations, onExploreClick }: ReservasViewProps) {
  return (
    <div className="max-w-xl mx-auto px-4 pb-28 pt-2 font-text">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 border border-black/10 text-neutral-800 text-[11px] font-semibold uppercase tracking-wider mb-2">
          <CalendarCheck size={12} className="text-neutral-700" />
          <span>Gestión de Mesas</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-black">
          Mis <span className="font-accent italic font-normal text-4xl">Reservas</span>
        </h2>
        <p className="text-neutral-500 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
          Tus códigos de reserva activos para presentar al llegar al establecimiento.
        </p>
      </div>

      {reservations.length === 0 ? (
        <div className="liquid-glass-card p-8 text-center bg-white">
          <div className="w-14 h-14 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-4 text-neutral-800">
            <CalendarCheck size={24} />
          </div>
          <h3 className="text-base font-bold text-black mb-1">Aún no tienes reservas activas</h3>
          <p className="text-neutral-500 text-xs max-w-xs mx-auto mb-6 leading-relaxed">
            Explora las mejores opciones gastronómicas, posadas boutique y clubes de playa en Margarita.
          </p>
          <button onClick={onExploreClick} className="btn-solid mx-auto text-xs py-2.5 px-5">
            <Compass size={15} />
            <span>Explorar Lugares</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((res) => (
            <div key={res.code} className="liquid-glass-card p-5 overflow-hidden relative bg-white">
              {/* Badge de Estado */}
              <div className="flex items-center justify-between mb-3">
                <span className="badge-minimal">
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  Confirmada
                </span>
                <span className="text-xs font-mono font-bold text-black bg-neutral-100 px-2.5 py-1 rounded-md border border-black/10">
                  {res.code}
                </span>
              </div>

              {/* Contenido Principal */}
              <div className="flex gap-4 items-center">
                <img
                  src={res.businessImage}
                  alt={res.businessName}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-black/10"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-black truncate">{res.businessName}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-600 mt-1">
                    <MapPin size={13} className="text-neutral-500 shrink-0" />
                    <span className="truncate">{res.businessAddress}</span>
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-neutral-400" />
                      {res.date} · {res.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} className="text-neutral-400" />
                      {res.guests} personas
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="mt-4 pt-3 border-t border-black/10 grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/${res.guestPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, tengo la reserva ${res.code} en Bukea a nombre de ${res.guestName}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-glass text-xs py-2 justify-center"
                >
                  <MessageCircle size={14} className="text-neutral-700" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${res.businessName} Margarita`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-glass text-xs py-2 justify-center"
                >
                  <ExternalLink size={14} className="text-neutral-700" />
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
