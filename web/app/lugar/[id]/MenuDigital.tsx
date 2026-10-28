'use client';

import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

type Dish = { 
  name: string; 
  desc: string; 
  price: string; 
  cat: string; 
  photo: string; 
  ing: string[];
  isStar?: boolean;
};

const MENU: Dish[] = [
  // Entradas
  { 
    name: 'Carpaccio de Atún Aleta Amarilla', 
    cat: 'Entradas', 
    price: '$15', 
    photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    desc: 'Láminas finas con alcaparras crocantes y aceite trufado.',
    ing: ['Atún fresco de Araya', 'Alcaparras', 'Aceite de oliva extra virgen', 'Parmesano reggiano', 'Limón criollo'],
    isStar: true
  },
  { 
    name: 'Ceviche Mixto Playa El Agua', 
    cat: 'Entradas', 
    price: '$16', 
    photo: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=800&q=80',
    desc: 'Pesca del día con leche de tigre al ají margariteño.',
    ing: ['Corvina fresca', 'Pulpo tierno', 'Leche de tigre', 'Cebolla morada', 'Ají dulce', 'Maíz chulpe'],
    isStar: true
  },
  { 
    name: 'Tequeños Gourmet de Calamar', 
    cat: 'Entradas', 
    price: '$11', 
    photo: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80',
    desc: 'Masa fina artesanal rellena de calamar con aioli de ajo asado.',
    ing: ['Calamar fresco', 'Panko japonés', 'Aioli de la casa', 'Cilantro fresco'] 
  },

  // Del Mar
  { 
    name: 'Langostinos al Fuego de Leña', 
    cat: 'Del mar', 
    price: '$28', 
    photo: 'https://images.unsplash.com/photo-1553240799-36bbf332a5c3?auto=format&fit=crop&w=800&q=80',
    desc: 'Langostinos jumbo marinados en hierbas frescas y mantequilla noisette.',
    ing: ['Langostinos jumbo', 'Ajos confitados', 'Perejil rizado', 'Pan de masa madre tostado'],
    isStar: true
  },
  { 
    name: 'Mero en Costra de Almendras', 
    cat: 'Del mar', 
    price: '$24', 
    photo: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    desc: 'Filete de mero blanco sobre puré rústico de batata y reducción de cítricos.',
    ing: ['Mero insular', 'Almendras tostadas', 'Batata asada', 'Emulsión de maracuyá'] 
  },
  { 
    name: 'Risotto de Mariscos & Azafrán', 
    cat: 'Del mar', 
    price: '$22', 
    photo: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80',
    desc: 'Arroz arborio cremoso con calamares, camarones y mejillones.',
    ing: ['Arroz arborio', 'Camarones', 'Mejillones de Pampatar', 'Calamar', 'Fondo de bisque'] 
  },

  // Parrilla
  { 
    name: 'Ribeye Angus 400g Madurado', 
    cat: 'Parrilla', 
    price: '$34', 
    photo: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
    desc: 'Corte premium 28 días de maduración con chimichurri rústico.',
    ing: ['Ribeye Angus certified', 'Chimichurri de la casa', 'Papas trufadas al romero'],
    isStar: true
  },
  { 
    name: 'Churrasco al Grill de Quebracho', 
    cat: 'Parrilla', 
    price: '$26', 
    photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    desc: 'Corte magro a la brasa con yuca frita crocante y mojo criollo.',
    ing: ['Churrasco prime', 'Salsa criolla de pimientos', 'Yuca frita artesanal'] 
  },

  // Postres
  { 
    name: 'Volcán de Cacao Venezolano', 
    cat: 'Postres', 
    price: '$9', 
    photo: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    desc: 'Cacao de Chuao al 70% con corazón fundido y helado de vainilla Bourbon.',
    ing: ['Chocolate venezolano Chuao', 'Helado de vainilla artesanal', 'Coulis de frutos rojos'] 
  },
  { 
    name: 'Tres Leches de Coco Margariteño', 
    cat: 'Postres', 
    price: '$8', 
    photo: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    desc: 'Bizcocho embebido en leche de coco fresco, ron Santa Teresa y canela.',
    ing: ['Bizcochuelo casero', 'Leche condensada', 'Leche de coco', 'Merengue tostado'] 
  },
];

const CATS = ['Entradas', 'Del mar', 'Parrilla', 'Postres'];

export default function MenuDigital() {
  const [cat, setCat] = useState('Entradas');
  const [open, setOpen] = useState<Dish | null>(null);

  const shown = MENU.filter(d => d.cat === cat);

  return (
    <div>
      {/* Categorías selector */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {CATS.map(c => (
          <button
            key={c}
            data-active={cat === c}
            onClick={() => setCat(c)}
            className="chip-minimal text-xs"
          >
            {c}
          </button>
        ))}
      </div>

      {/* Lista de platos en tarjeta minimalista blanca */}
      <div className="liquid-glass-card bg-white divide-y divide-black/5 overflow-hidden">
        {shown.map((d, i) => (
          <div
            key={i}
            onClick={() => setOpen(d)}
            className="p-4 flex gap-4 items-center hover:bg-neutral-50 transition-colors cursor-pointer group"
          >
            <img
              src={d.photo}
              alt={d.name}
              className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-black/10 group-hover:scale-105 transition-transform"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-sm text-black group-hover:text-neutral-700 truncate">
                  {d.name}
                </div>
                <div className="font-mono font-bold text-sm text-black">
                  {d.price}
                </div>
              </div>
              <div className="text-xs text-neutral-600 line-clamp-1 mt-0.5">
                {d.desc}
              </div>
              <div className="text-[11px] text-neutral-400 truncate mt-1">
                {d.ing.slice(0, 3).join(' · ')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detalle de Plato en Bottom Sheet */}
      {open && (
        <div
          onClick={() => setOpen(null)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white border border-black/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-5 text-black"
          >
            <div className="w-12 h-1 rounded-full bg-neutral-200 mx-auto mb-4 sm:hidden" />

            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 border border-black/10">
              <img
                src={open.photo}
                alt={open.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setOpen(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 text-black flex items-center justify-center border border-black/10 shadow-sm"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-lg font-bold text-black">{open.name}</h3>
              <span className="text-lg font-mono font-bold text-black">{open.price}</span>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed mb-4">{open.desc}</p>

            <div className="text-[11px] font-bold text-black uppercase tracking-wider mb-2">
              Ingredientes & Preparación
            </div>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {open.ing.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 border border-black/5 text-neutral-700 text-xs"
                >
                  {item}
                </span>
              ))}
            </div>

            <button
              onClick={() => setOpen(null)}
              className="btn-solid w-full text-xs py-3 justify-center"
            >
              Cerrar Detalle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
