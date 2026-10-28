import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BUKEA — Reservas exclusivas',
    short_name: 'BUKEA',
    description: 'Ecosistema de reservas exclusivas, tours 360° y gastronomía AR en Margarita',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [{ src: '/icon.png', sizes: '192x192', type: 'image/png' }],
  };
}
