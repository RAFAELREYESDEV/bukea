import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bukea — Reserva con estatus',
    short_name: 'Bukea',
    description: 'Reservas exclusivas en restaurantes, posadas y clubes',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d1321',
    theme_color: '#c9a227',
    icons: [{ src: '/icon.png', sizes: '192x192', type: 'image/png' }],
  };
}
