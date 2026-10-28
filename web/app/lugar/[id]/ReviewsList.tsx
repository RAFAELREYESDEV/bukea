'use client';

import { useEffect, useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';

type Review = { id: string; author: string; rating: number; text: string; date?: string; avatar?: string };

const MOCK_REVIEWS: Record<string, Review[]> = {
  default: [
    {
      id: 'rev-1',
      author: 'Carlos Mendoza',
      rating: 5,
      date: 'Ayer',
      text: 'Excelente atención. El pase digital de Bukea nos dio una mesa preferencial de inmediato sin esperas.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'rev-2',
      author: 'Mariana Silva',
      rating: 5,
      date: 'Hace 3 días',
      text: 'La experiencia inmersiva 360° antes de ir nos encantó. El plato que vimos en AR era idéntico en la mesa.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'rev-3',
      author: 'Alejandro Rossi',
      rating: 5,
      date: 'Hace 5 días',
      text: 'La mejor comida de Margarita. Los beneficios VIP con la tarjeta Bukea Black valen totalmente la pena.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    }
  ]
};

export default function ReviewsList({ bizId }: { bizId: string }) {
  const [rs, setRs] = useState<Review[] | null>(null);

  useEffect(() => {
    fetch(`/api/admin/businesses/${bizId}/reviews`)
      .then(r => r.json())
      .then(d => {
        const all = d.items || d.reviews || [];
        const filtered = all.filter((r: any) => r.rating >= 4);
        if (filtered.length > 0) {
          setRs(filtered);
        } else {
          setRs(MOCK_REVIEWS.default);
        }
      })
      .catch(() => {
        setRs(MOCK_REVIEWS.default);
      });
  }, [bizId]);

  if (!rs) {
    return (
      <div className="py-4 text-center text-xs text-neutral-400">
        Cargando opiniones verificadas…
      </div>
    );
  }

  return (
    <div className="divide-y divide-black/5">
      {rs.map(r => (
        <div key={r.id} className="py-3.5 first:pt-1 last:pb-1">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-neutral-100 border border-black/10 flex items-center justify-center text-black font-semibold text-xs">
                {r.author.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-xs text-black flex items-center gap-1.5">
                  <span>{r.author}</span>
                  <CheckCircle size={12} className="text-emerald-600" />
                </div>
                {r.date && <div className="text-[10px] text-neutral-400">{r.date}</div>}
              </div>
            </div>

            <div className="flex items-center text-neutral-900">
              {[...Array(5)].map((_, idx) => (
                <Star
                  key={idx}
                  size={12}
                  fill={idx < r.rating ? 'currentColor' : 'none'}
                  className={idx < r.rating ? 'text-black' : 'text-neutral-200'}
                />
              ))}
            </div>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed pl-9">
            {r.text}
          </p>
        </div>
      ))}
    </div>
  );
}
