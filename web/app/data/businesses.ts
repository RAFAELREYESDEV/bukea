export interface Dish {
  name: string;
  desc: string;
  price: string;
  cat: string;
  photo: string;
  ing: string[];
  has3D?: boolean;
}

export interface Promo {
  title: string;
  desc: string;
  code?: string;
  badge?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  avatar?: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  category: 'Restaurante' | 'Posada' | 'Club' | 'Terraza';
  cuisine: string;
  tier: 1 | 2 | 3;
  rating: number;
  reviewCount: number;
  priceRange: '$$' | '$$$' | '$$$$';
  address: string;
  zone: string;
  lat: number;
  lng: number;
  whatsapp: string;
  phone: string;
  description: string;
  shortDesc: string;
  heroImage: string;
  carousel: { src: string; cap: string }[];
  tour_360?: string | null;
  hasAR: boolean;
  featuredBadge?: string;
  promos: Promo[];
  dishes: Dish[];
  reviews: Review[];
  schedule: string;
  perks: string[];
}

export const BUSINESSES_MOCK: Business[] = [
  {
    id: 'downtown-beach-club',
    name: 'Downtown Beach Club',
    slug: 'downtown-beach-club',
    category: 'Club',
    cuisine: 'Cocina del Mar & Mixología',
    tier: 3,
    rating: 4.9,
    reviewCount: 184,
    priceRange: '$$$',
    address: 'Av. Aldonza Manrique, Playa El Agua, Isla de Margarita',
    zone: 'Playa El Agua',
    lat: 11.1461,
    lng: -63.8684,
    whatsapp: '584129999999',
    phone: '+58 412-999-9999',
    shortDesc: 'Club de playa exclusivo con camas balinesas, alta cocina marina y atardeceres frente al mar.',
    description: 'El epicentro del estatus frente al Atlántico en Margarita. Camas balinesas VIP, DJ en vivo, coctelería de autor y la mejor pesca del día servida a la orilla del mar con servicio de concierge personalizado.',
    heroImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    carousel: [
      { src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80', cap: 'Frente de playa y camas balinesas VIP' },
      { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', cap: 'Salón lounge y coctelería de autor' },
      { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', cap: 'Gastronomía marina fresca y contemporánea' },
      { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', cap: 'Sunset sessions los fines de semana' }
    ],
    tour_360: 'https://app.lapentor.com/sphere/demo-beach-club',
    hasAR: true,
    featuredBadge: '👑 Experiencia Estrella',
    schedule: 'Mié - Dom · 11:00 AM - 11:00 PM',
    perks: ['Copa de bienvenida prosecco', 'Acceso preferencial sin fila', 'Mesa asignada frente al mar'],
    promos: [
      { title: 'Sunset VIP Pass', desc: 'Cóctel de cortesía por comensal al reservar antes de las 5:00 PM', code: 'SUNSET-VIP', badge: 'Exclusivo Bookealo' },
      { title: 'Trato Real Fin de Semana', desc: '10% de beneficio en botella de Champagne Moët & Chandon', code: 'TRATO-REAL' }
    ],
    dishes: [
      {
        name: 'Langosta Caribeña al Fuego de Leña',
        cat: 'Del mar',
        price: '$38',
        photo: 'https://images.unsplash.com/photo-1553240799-36bbf332a5c3?auto=format&fit=crop&w=800&q=80',
        desc: 'Langosta de Los Roques a la mantequilla noisette de ajo negro y sal marina de Araya.',
        ing: ['Langosta fresca', 'Mantequilla avellanada', 'Ajo negro', 'Cilantro de monte', 'Puré rústico de batata'],
        has3D: true
      },
      {
        name: 'Ceviche Mixto Playa El Agua',
        cat: 'Entradas',
        price: '$16',
        photo: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=800&q=80',
        desc: 'Pesca fresca del día, pulpo tierno, ají dulce margariteño y leche de tigre al maracuyá.',
        ing: ['Mero margariteño', 'Pulpo baby', 'Ají dulce', 'Cebolla morada', 'Maíz chulpe crocante'],
        has3D: true
      },
      {
        name: 'Carpaccio de Atún Aleta Amarilla',
        cat: 'Entradas',
        price: '$15',
        photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        desc: 'Láminas ultrafinas de atún fresco, alcaparras fritas, aceite de oliva trufado y crocante de parmesano.',
        ing: ['Atún aleta amarilla', 'Aceite de oliva extra virgen', 'Trufa blanca', 'Alcaparras bebés', 'Parmesano reggiano'],
        has3D: false
      },
      {
        name: 'Tomahawk Steak Angus 800g',
        cat: 'Parrilla',
        price: '$52',
        photo: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
        desc: 'Corte premium Angus Certified madurado 28 días, sellado a la brasa con chimichurri rústico.',
        ing: ['Corte Angus prime', 'Chimichurri de hierbas frescas', 'Papas rústicas al romero', 'Sal Maldon'],
        has3D: true
      }
    ],
    reviews: [
      { id: 'r1', author: 'Carlos Mendoza', rating: 5, date: 'Hace 2 días', text: 'La reserva con Bookealo fue inmediata. Llegamos, mostramos el código y nuestra mesa frente al mar estaba lista con el servicio VIP.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
      { id: 'r2', author: 'Mariana Silva', rating: 5, date: 'Hace 4 días', text: 'El tour 360° nos convenció y la comida superó las expectativas. Ver el plato en Realidad Aumentada antes de pedirlo es otro nivel.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' }
    ]
  },
  {
    id: 'casa-esther-gourmet',
    name: 'La Casa de Esther',
    slug: 'casa-esther-gourmet',
    category: 'Restaurante',
    cuisine: 'Alta Cocina Margariteña de Autor',
    tier: 3,
    rating: 5.0,
    reviewCount: 312,
    priceRange: '$$$$',
    address: 'Calle Principal de Pedro González, Valle de Pedro González, Isla de Margarita',
    zone: 'Pedro González',
    lat: 11.1098,
    lng: -63.9214,
    whatsapp: '584147778888',
    phone: '+58 414-777-8888',
    shortDesc: 'La máxima expresión gastronómica de la isla. Un viaje culinario íntimo orquestado por la Chef Esther.',
    description: 'Reconocido como el templo de la gastronomía de Nueva Esparta. Menús degustación estacionales que reinterpretan la pesca local y frutos autóctonos con maestría culinaria contemporánea en una casona colonial mágica.',
    heroImage: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
    carousel: [
      { src: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80', cap: 'Casona colonial y patio gastronómico íntimo' },
      { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80', cap: 'Menú degustación de 7 tiempos' },
      { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80', cap: 'Detalle de mesa de gala con reserva anticipada' }
    ],
    tour_360: 'https://app.lapentor.com/sphere/demo-casa-esther',
    hasAR: true,
    featuredBadge: '🏆 Top Gastronómico Margarita',
    schedule: 'Jue - Dom · 1:00 PM - 8:00 PM (Solo con reserva)',
    perks: ['Maridaje guiado por sommelier', 'Mesa de casona reservada', 'Saludo personalizado de la chef'],
    promos: [
      { title: 'Menú Degustación Signature', desc: 'Reserva para 2 o más y accede al maridaje de rones prémium', code: 'ESTHER-VIP', badge: 'Cupo Limitado' }
    ],
    dishes: [
      {
        name: 'Degustación de Ají Margariteño en Tres Texturas',
        cat: 'Entradas',
        price: '$20',
        photo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        desc: 'Homenaje al ají dulce insular: espuma tibia, reducción balsámica y confitado sobre tartar de mero.',
        ing: ['Ají dulce de La Asunción', 'Mero blanco', 'Flores comestibles', 'Aceite de oliva de arbequina'],
        has3D: true
      },
      {
        name: 'Pastel de Chucho Desestructurado',
        cat: 'Del mar',
        price: '$26',
        photo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
        desc: 'Emblemático plato margariteño reimaginado con plátano caramelizado y espuma de queso de cabra artesanal.',
        ing: ['Chucho ahumado artesanal', 'Plátano maduro en almíbar de papelón', 'Queso telita criollo', 'Especias dulces'],
        has3D: true
      }
    ],
    reviews: [
      { id: 're1', author: 'Alejandro Rossi', rating: 5, date: 'Ayer', text: 'La reserva exclusiva por Bookealo funcionó como un reloj suizo. La mejor experiencia gastronómica de toda Venezuela.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' }
    ]
  },
  {
    id: 'posada-casa-de-agua',
    name: 'Posada Casa de Agua & Lounge',
    slug: 'posada-casa-de-agua',
    category: 'Posada',
    cuisine: 'Coctelería & Tapas de Autor',
    tier: 2,
    rating: 4.8,
    reviewCount: 96,
    priceRange: '$$$',
    address: 'Bahía de Pampatar, Calle Joaquín Maneiro, Pampatar',
    zone: 'Pampatar',
    lat: 10.9984,
    lng: -63.7995,
    whatsapp: '584123334455',
    phone: '+58 412-333-4455',
    shortDesc: 'Posada boutique con terraza lounge frente a la bahía de Pampatar y vistas panorámicas del castillo.',
    description: 'Un refugio de lujo sereno en el corazón histórico de Pampatar. Terraza infinita con vistas a la bahía, mixología vanguardista inspirada en botánicos tropicales y habitaciones de diseño para una estadía inigualable.',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    carousel: [
      { src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', cap: 'Vistas panorámicas sobre la bahía de Pampatar' },
      { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', cap: 'Suites boutique y terrazas privadas' }
    ],
    tour_360: 'https://app.lapentor.com/sphere/demo-pampatar',
    hasAR: false,
    featuredBadge: '🌊 Vistas a la Bahía',
    schedule: 'Mar - Dom · 4:00 PM - 12:00 AM',
    perks: ['Mesa en primera línea de baranda', 'Check-in exprés con chip NFC', 'Cóctel Sunset de cortesía'],
    promos: [
      { title: 'Sunset Cocktails 2x1', desc: 'De 5:00 PM a 7:00 PM en toda la carta de coctelería de autor', code: 'PAMPATAR-SUNSET' }
    ],
    dishes: [
      {
        name: 'Trilogía de Ceviches Criollos',
        cat: 'Entradas',
        price: '$18',
        photo: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=800&q=80',
        desc: 'Mero en leche de tigre clásica, atún al ají dulce y pulpo al chimichurri caribeño.',
        ing: ['Mero', 'Atún rojo', 'Pulpo', 'Leche de tigre'],
        has3D: false
      }
    ],
    reviews: [
      { id: 'rc1', author: 'Valeria Guzmán', rating: 5, date: 'Hace 3 días', text: 'El atardecer en la terraza es mágico. Reservé por Bookealo y me asignaron la mejor mesa de la esquina.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' }
    ]
  },
  {
    id: 'amaranto-arte-copas',
    name: 'Amaranto Arte, Comida & Copas',
    slug: 'amaranto-arte-copas',
    category: 'Terraza',
    cuisine: 'Cocina Fusión & Galería Bohemio Chic',
    tier: 2,
    rating: 4.8,
    reviewCount: 142,
    priceRange: '$$',
    address: 'Calle Nueva, Casco Histórico de Pampatar',
    zone: 'Pampatar',
    lat: 10.9992,
    lng: -63.8012,
    whatsapp: '584241234567',
    phone: '+58 424-123-4567',
    shortDesc: 'Un oasis de arte contemporáneo, jazz en vivo, tapas mediterráneas y selecta carta de vinos.',
    description: 'El punto de encuentro bohemio más sofisticado de Margarita. Combina una galería de arte con una cocina fresca y vibrante, ideal para cenas románticas y veladas inolvidables bajo las estrellas.',
    heroImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
    carousel: [
      { src: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80', cap: 'Patio interior con arte y luces tenues' },
      { src: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1200&q=80', cap: 'Barra de vinos y mixología botánica' }
    ],
    tour_360: null,
    hasAR: false,
    featuredBadge: '🍸 Noches de Jazz & Vinos',
    schedule: 'Mié - Lun · 6:00 PM - 1:00 AM',
    perks: ['Copa de vino de la casa al reservar cena', 'Ubicación preferencial en el patio'],
    promos: [
      { title: 'Noche de Maridaje', desc: 'Tabla de quesos artesanales con 15% de beneficio en reservas de 4+', code: 'AMARANTO-WINE' }
    ],
    dishes: [
      {
        name: 'Risotto Negro con Calamares Crujientes',
        cat: 'Del mar',
        price: '$21',
        photo: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80',
        desc: 'Arroz arborio cocido en tinta de sepia, calamar crocante al limón y alioli suave.',
        ing: ['Arroz arborio', 'Tinta de calamar', 'Calamar baby', 'Parmesano', 'Alioli'],
        has3D: false
      }
    ],
    reviews: [
      { id: 'ra1', author: 'Diego Beltrán', rating: 5, date: 'Hace 1 semana', text: 'Ambiente inmejorable en Pampatar. La música en vivo y la comida son 10/10.', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80' }
    ]
  }
];

export interface StoredReservation {
  code: string;
  businessId: string;
  businessName: string;
  businessImage: string;
  businessAddress: string;
  date: string;
  time: string;
  guests: number;
  guestName: string;
  guestPhone: string;
  status: 'confirmada' | 'completada' | 'cancelada';
  createdAt: string;
  perks: string[];
}


export function normalizeBusiness(raw: any): Business {
  if (!raw) return BUSINESSES_MOCK[0];

  const foundMock = BUSINESSES_MOCK.find(
    (m) =>
      m.id === raw.id ||
      m.slug === raw.slug ||
      m.name.toLowerCase() === (raw.name || '').toLowerCase()
  );

  // Capitalizar y mapear categoría
  let cat = raw.category || (foundMock?.category ?? 'Restaurante');
  const catLower = String(cat).toLowerCase();
  if (catLower.includes('club')) cat = 'Club';
  else if (catLower.includes('posada') || catLower.includes('hotel')) cat = 'Posada';
  else if (catLower.includes('terraza') || catLower.includes('roof')) cat = 'Terraza';
  else cat = 'Restaurante';

  const cuisine = raw.cuisine || foundMock?.cuisine || 'Cocina de Autor';
  const name = raw.name || foundMock?.name || 'Restaurante Aliado';

  // Asignar imagen acorde al tipo de gastronomía si no tiene heroImage
  let heroImage = raw.heroImage || foundMock?.heroImage;
  if (!heroImage) {
    const cLower = cuisine.toLowerCase();
    if (cLower.includes('nikkei') || cLower.includes('japones') || cLower.includes('sushi')) {
      heroImage = 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80';
    } else if (cLower.includes('itali')) {
      heroImage = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80';
    } else if (cLower.includes('mexic')) {
      heroImage = 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80';
    } else if (cLower.includes('árabe') || cLower.includes('arabe') || cLower.includes('liban')) {
      heroImage = 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80';
    } else if (cLower.includes('parrilla') || cLower.includes('carne') || cLower.includes('mar y tierra')) {
      heroImage = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80';
    } else if (cLower.includes('lounge') || cLower.includes('roof') || cLower.includes('coctel')) {
      heroImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80';
    } else {
      heroImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80';
    }
  }

  const rating =
    typeof raw.rating === 'number' && !isNaN(raw.rating)
      ? raw.rating
      : foundMock?.rating ?? 4.8;

  const reviewCount =
    typeof raw.reviewCount === 'number' && !isNaN(raw.reviewCount)
      ? raw.reviewCount
      : foundMock?.reviewCount ?? 84;

  const carousel =
    Array.isArray(raw.carousel) && raw.carousel.length > 0
      ? raw.carousel
      : foundMock?.carousel ?? [
          { src: heroImage, cap: `${name} · Experiencia Gastronómica` },
        ];

  let scheduleStr = 'Mar - Dom · 12:00 PM - 10:00 PM';
  if (typeof raw.schedule === 'string') {
    scheduleStr = raw.schedule;
  } else if (foundMock?.schedule) {
    scheduleStr = foundMock.schedule;
  }

  return {
    id: String(raw.id || foundMock?.id || Math.random().toString(36).slice(2)),
    name,
    slug: raw.slug || foundMock?.slug || (raw.id ? String(raw.id) : 'restaurante'),
    category: cat as any,
    cuisine,
    tier: raw.tier || foundMock?.tier || 2,
    rating,
    reviewCount,
    priceRange: raw.priceRange || foundMock?.priceRange || '$$$',
    address: raw.address || foundMock?.address || 'Isla de Margarita, Nueva Esparta',
    zone: raw.zone || foundMock?.zone || raw.address || 'Margarita',
    lat: typeof raw.lat === 'number' ? raw.lat : foundMock?.lat ?? 10.99,
    lng: typeof raw.lng === 'number' ? raw.lng : foundMock?.lng ?? -63.81,
    whatsapp: raw.whatsapp || foundMock?.whatsapp || '584129999999',
    phone: raw.phone || foundMock?.phone || '+58 412 999 9999',
    description:
      raw.description ||
      foundMock?.description ||
      `${name} ofrece una propuesta gastronómica excepcional en Margarita con servicio preferencial.`,
    shortDesc:
      raw.shortDesc ||
      foundMock?.shortDesc ||
      `${cuisine} en ${raw.address || 'Margarita'}.`,
    heroImage,
    carousel,
    tour_360: raw.tour_360 ?? foundMock?.tour_360 ?? null,
    hasAR: raw.hasAR ?? foundMock?.hasAR ?? false,
    featuredBadge: raw.featuredBadge || foundMock?.featuredBadge,
    promos: raw.promos || foundMock?.promos || [],
    dishes: raw.dishes || foundMock?.dishes || [],
    reviews: raw.reviews || foundMock?.reviews || [],
    schedule: scheduleStr,
    perks:
      raw.perks ||
      foundMock?.perks || [
        'Atención preferencial Bookealo',
        'Mesa confirmada al instante',
      ],
  };
}
