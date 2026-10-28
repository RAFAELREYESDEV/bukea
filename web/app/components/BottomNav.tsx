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
    { id: 'wallet' as NavTab, label: 'Wallet', icon: Wallet },
  ];

  return (
    <nav className="bottom-dock-glass" aria-label="Navegación principal">
      <div className="grid grid-cols-4 items-center gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-full transition-all duration-200 ${
                isActive ? 'text-black font-semibold' : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-black/5 rounded-full" />
              )}

              <div className="relative flex items-center justify-center mb-0.5">
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.3 : 1.8}
                  className={`transition-colors ${isActive ? 'text-black' : 'text-neutral-400'}`}
                />

                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="relative text-[11px] tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
