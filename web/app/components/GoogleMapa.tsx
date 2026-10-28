'use client';

import { useEffect, useRef } from 'react';
import { loadGmaps } from './gmapsLoader';

type Biz = { id: string; name: string; lat: number | null; lng: number | null };

const LIGHT_MINIMAL_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f7' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#525252' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e5e5e5' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#737373' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e0e7ee' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
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
        styles: LIGHT_MINIMAL_MAP_STYLE,
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
            fillColor: '#0A0A0A',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2.5,
            scale: 7,
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
      className="w-full h-80 rounded-3xl overflow-hidden bg-neutral-100 border border-black/10"
    />
  );
}
