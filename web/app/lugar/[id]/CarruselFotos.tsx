'use client';

import { useState, useRef } from 'react';

type Foto = { src: string; cap: string };

export default function CarruselFotos({ fotos }: { fotos: Foto[] }) {
  const [idx, setIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    setIdx(Math.round(el.scrollLeft / el.clientWidth));
  };

  if (!fotos?.length) return null;

  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex overflow-x-auto snap-x snap-mandatory rounded-2xl border border-black/10 shadow-sm scrollbar-none"
      >
        {fotos.map((f, i) => (
          <div key={i} className="w-full shrink-0 snap-start relative aspect-[16/10]">
            <img
              src={f.src}
              alt={f.cap}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-xs font-medium text-white drop-shadow-sm">
              {f.cap}
            </div>
          </div>
        ))}
      </div>

      {/* Indicadores minimalistas */}
      <div className="flex justify-center gap-1.5 mt-3">
        {fotos.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === idx
                ? 'w-6 bg-black'
                : 'w-1.5 bg-neutral-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
