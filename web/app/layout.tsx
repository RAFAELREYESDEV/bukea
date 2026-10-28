import './globals.css';
import { GeistSans } from 'geist/font/sans';
import Script from 'next/script';

export const metadata = {
  title: 'Bookealo — Reservas de Estatus & Inmersión Espacial 360°',
  description: 'Ecosistema de reservas exclusivas, menús en Realidad Aumentada y pases VIP para los mejores restaurantes, clubes y posadas de Margarita.',
  manifest: '/manifest.webmanifest',
  themeColor: '#07080b',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={GeistSans.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;700;800&display=swap"
          rel="stylesheet"
        />
        <Script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
          strategy="lazyOnload"
        />
      </head>
      <body className="antialiased bg-[#07080b] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
