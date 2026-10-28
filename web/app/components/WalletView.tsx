'use client';

import React, { useState } from 'react';
import { Sparkles, QrCode, ShieldCheck, Award, ChevronRight, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { StoredReservation } from '../data/businesses';

interface WalletViewProps {
  reservations: StoredReservation[];
  onGoToReserve?: () => void;
}

export default function WalletView({ reservations }: WalletViewProps) {
  const [activeTab, setActiveTab] = useState<'pass' | 'points'>('pass');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleWalletAdd = (walletType: 'Apple' | 'Google') => {
    setDownloadSuccess(`Pase descargado y sincronizado con ${walletType} Wallet.`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const activeRes = reservations.find(r => r.status === 'confirmada');

  return (
    <div className="max-w-xl mx-auto px-4 pb-28 pt-2">
      {/* Header Sección */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-semibold mb-2 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
          <Sparkles size={13} className="text-amber-400" />
          <span>El Trato Real · Estatus Digital</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
          Mi Tarjeta <span className="gradient-gold-text">Bukea Black</span>
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
          Pase digital de estatus y fidelización exclusivo para comensales de alta gama en Margarita.
        </p>
      </div>

      {/* Selector de sub-vista */}
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 max-w-xs mx-auto mb-6">
        <button
          onClick={() => setActiveTab('pass')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'pass'
              ? 'bg-amber-400 text-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Pase Digital VIP
        </button>
        <button
          onClick={() => setActiveTab('points')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'points'
              ? 'bg-amber-400 text-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Puntos & Perks
        </button>
      </div>

      {downloadSuccess && (
        <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {activeTab === 'pass' && (
        <div className="space-y-6">
          {/* Tarjeta Holográfica estilo Apple/Google Wallet */}
          <div className="wallet-card-luxury p-6 text-white">
            {/* Cabecera de la tarjeta */}
            <div className="flex items-center justify-between border-b border-amber-400/20 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-yellow-200 text-black flex items-center justify-center font-black text-sm shadow-[0_0_12px_rgba(212,175,55,0.4)]">
                  B
                </div>
                <div>
                  <div className="font-display font-extrabold tracking-tight text-base leading-none">
                    BUKEA <span className="text-amber-400">BLACK</span>
                  </div>
                  <div className="text-[10px] text-amber-200/70 tracking-widest uppercase mt-0.5 font-mono">
                    VIP Guest Pass
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold">
                <Award size={13} />
                <span>Nivel Oro</span>
              </div>
            </div>

            {/* Datos del titular & Estatus */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Titular VIP</div>
                <div className="text-base font-bold text-white tracking-tight mt-0.5">
                  {activeRes ? activeRes.guestName : 'Rafael Reyes'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Membresía ID</div>
                <div className="text-sm font-mono font-bold text-amber-300 mt-0.5">
                  BK-9942-VIP
                </div>
              </div>
            </div>

            {/* Código de Reserva Activa si existe */}
            {activeRes ? (
              <div className="bg-black/50 border border-amber-400/30 rounded-2xl p-4 mb-5 backdrop-blur-md">
                <div className="flex items-center justify-between text-xs text-amber-300 font-semibold mb-1">
                  <span>Próxima Reserva Confirmada</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="text-sm font-bold text-white">{activeRes.businessName}</div>
                <div className="text-xs text-slate-300 mt-0.5">
                  {activeRes.date} · {activeRes.time} · {activeRes.guests} comensales
                </div>
                <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Código para el Maitre:</span>
                  <span className="font-mono font-extrabold text-base text-amber-300 tracking-wider">
                    {activeRes.code}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 mb-5 text-center">
                <div className="text-xs text-slate-300 font-medium">Sin reservas activas en este momento</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Presenta tu pase digital para acumular puntos en mesa con chip NFC.</div>
              </div>
            )}

            {/* Código QR / Barcode de Validación */}
            <div className="bg-white rounded-xl p-4 flex flex-col items-center justify-center text-black">
              {/* SVG QR simulado de alta fidelidad */}
              <div className="flex items-center justify-center gap-3">
                <QrCode size={78} className="text-slate-900" />
                <div className="text-left font-mono">
                  <div className="text-xs font-black text-slate-900 tracking-wider">BK-PASS-2026</div>
                  <div className="text-[10px] text-slate-600 mt-1">Escaneable en POS Kamra & NFC</div>
                  <div className="text-[9px] text-amber-800 font-semibold mt-0.5">Válido en toda la red Margarita</div>
                </div>
              </div>
            </div>

            {/* Pie de la tarjeta */}
            <div className="flex items-center justify-between mt-4 text-[10px] text-slate-400 pt-2 border-t border-white/10">
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-amber-400" /> Encriptación segura Bookealo
              </span>
              <span>Expira: Dic 2027</span>
            </div>
          </div>

          {/* Botones oficiales de Apple & Google Wallet */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleWalletAdd('Apple')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-black border border-white/20 text-white text-xs font-bold hover:bg-neutral-900 transition-all hover:scale-[1.02] shadow-lg"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.33-6.66-10.1-11.75-21.43-15.26-34-3.51-12.57-5.26-24.16-5.26-34.78 0-14.9 3.51-27.17 10.53-36.81 7.02-9.64 16.03-14.54 27.02-14.71 5.3 0 11.04 1.48 17.23 4.45 6.19 2.97 10.3 4.51 12.33 4.63 1.7.12 6.06-1.54 13.08-4.99 7.02-3.45 13.32-4.98 18.91-4.59 13.87 1.09 24.58 6.46 32.14 16.12-12.22 7.42-18.15 17.65-17.78 30.68.36 10.15 4.3 18.66 11.83 25.53 7.53 6.87 16.51 10.74 26.94 11.62-2.18 6.74-4.85 13.83-8.02 21.28zM119.22 33.15c0-7.39 2.66-14.36 7.98-20.92 5.32-6.56 12.03-10.64 20.13-12.23.49 1.33.73 2.72.73 4.18 0 7.39-2.78 14.53-8.34 21.42-5.56 6.89-12.35 10.9-20.37 12.02-.08-1.57-.13-3.06-.13-4.47z" />
              </svg>
              <span>Apple Wallet</span>
            </button>

            <button
              onClick={() => handleWalletAdd('Google')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-neutral-900 border border-white/20 text-white text-xs font-bold hover:bg-neutral-800 transition-all hover:scale-[1.02] shadow-lg"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.43 7.35 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.57 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Google Wallet</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'points' && (
        <div className="space-y-4">
          {/* Tarjeta Balance de Puntos */}
          <div className="luxury-card p-6 bg-gradient-to-br from-amber-950/40 via-black to-black border-amber-400/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-amber-300 font-semibold uppercase tracking-wider">Bookealo Points</div>
                <div className="text-3xl font-extrabold text-white font-display mt-1">
                  1,250 <span className="text-sm font-normal text-amber-400">pts</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">Equivalente a $25 en consumos aliados</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 text-xl font-bold">
                👑
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400">Puntos acumulados este mes</span>
              <span className="font-bold text-emerald-400">+350 pts</span>
            </div>
          </div>

          {/* Perks activos del Trato Real */}
          <div className="luxury-card p-5">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
              Beneficios VIP Activos en Margarita
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-lg">🥂</span>
                <div>
                  <div className="text-xs font-bold text-white">Cóctel de Bienvenida Garantizado</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">En Downtown Beach Club y La Casa de Esther al reservar con estatus Black.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-lg">⚡</span>
                <div>
                  <div className="text-xs font-bold text-white">Asignación Preferente de Mesa</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Prioridad en primera línea de mar y terrazas exclusivas con vistas panorámicas.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-lg">📶</span>
                <div>
                  <div className="text-xs font-bold text-white">Auto-reconocimiento NFC en Mesa</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Toca el chip NFC de tu mesa para cargar tu cuenta al Wallet sin esperas.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
