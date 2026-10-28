'use client';

import React from 'react';
import { Compass, MapPin, CalendarCheck, Wallet } from 'lucide-react';

export type NavTab = 'explorar' | 'mapa' | 'reservas' | 'wallet';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  reservationCount?: number;
}

export default function BottomNav({ activeTab, onChangeTab, reservationCount = 0 }: BottomNavProps) {
  const tabs = [
    { id: 'explorar' as NavTab, label: 'Explorar', icon: Compass },
    { id: 'mapa' as NavTab, label: 'Mapa', icon: MapPin },
    { id: 'reservas' as NavTab, label: 'Reservas', icon: CalendarCheck, badge: reservationCount > 0 ? reservationCount : null },
    { id: 'wallet' as NavTab, label: 'Wallet VIP', icon: Wallet, isVip: true },
  ];

  return (
    <nav className="bottom-dock" aria-label="Navegación principal">
      <div className="grid grid-cols-4 items-center gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Background pill indicador activo */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-yellow-300/10 rounded-2xl border border-amber-400/40 shadow-[0_0_15px_rgba(212,175,55,0.25)]" />
              )}

              <div className="relative flex items-center justify-center mb-1">
                <Icon
                  size={20}
                  className={`transition-transform duration-300 ${
                    isActive ? 'scale-110 text-amber-300' : ''
                  }`}
                />

                {/* Badge de contador de reservas */}
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-amber-400 text-black text-[10px] font-black flex items-center justify-center shadow-[0_0_8px_rgba(212,175,55,0.6)]">
                    {tab.badge}
                  </span>
                )}

                {/* Dot VIP */}
                {tab.isVip && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_#D4AF37]" />
                )}
              </div>

              <span
                className={`relative text-[11px] font-medium tracking-tight ${
                  isActive ? 'font-bold text-amber-200' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
