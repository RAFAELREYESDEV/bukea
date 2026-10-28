import './globals.css';
import { GeistSans } from 'geist/font/sans';
import Script from 'next/script';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Bookealo — Reservas de Estatus & Inmersión Espacial 360°',
  description: 'Ecosistema de reservas exclusivas, menús en Realidad Aumentada y pases VIP para los mejores restaurantes, clubes y posadas de Margarita.',
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#07080b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={GeistSans.className}>
      <body className="antialiased bg-[#07080b] text-slate-100 min-h-screen">
        {children}
        <Script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
