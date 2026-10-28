'use client';

import { useEffect, useRef } from 'react';
import { loadGmaps } from './gmapsLoader';

type Biz = { id: string; name: string; lat: number | null; lng: number | null };

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0f1118' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f1118' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#07080b' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e2433' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#151924' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#cbd5e1' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#161924' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1a1f2c' }] },
];

export default function GoogleMapa({ bizs, onPick }: { bizs: Biz[]; onPick?: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    let active = true;

    loadGmaps().then(() => {
      if (!active || !ref.current || typeof window === 'undefined' || !(window as any).google?.maps) return;

      const map = new (window as any).google.maps.Map(ref.current, {
        center: { lat: 11.02, lng: -63.83 },
        zoom: 12,
        disableDefaultUI: false,
        mapTypeControl: false,
        streetViewControl: false,
        styles: DARK_MAP_STYLE,
      });

      mapRef.current = map;

      const bounds = new (window as any).google.maps.LatLngBounds();
      let hasValidCoords = false;

      bizs.forEach((b) => {
        if (b.lat == null || b.lng == null) return;
        hasValidCoords = true;

        const marker = new (window as any).google.maps.Marker({
          position: { lat: b.lat, lng: b.lng },
          map,
          title: b.name,
          icon: {
            path: (window as any).google.maps.SymbolPath.CIRCLE,
            fillColor: '#D4AF37',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
            scale: 8,
          },
        });

        marker.addListener('click', () => onPick?.(b.id));
        bounds.extend({ lat: b.lat, lng: b.lng });
      });

      if (hasValidCoords) {
        map.fitBounds(bounds, 50);
      }
    }).catch(() => {});

    return () => {
      active = false;
    };
  }, [bizs, onPick]);

  return (
    <div
      ref={ref}
      className="w-full h-80 rounded-3xl overflow-hidden bg-neutral-900 border border-white/10"
    />
  );
}
