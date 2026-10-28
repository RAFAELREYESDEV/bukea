'use client';

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import L from 'leaflet';

const icon = L.divIcon({
  className: 'bk-marker',
  html: '<div style="background:#a8891c;width:15px;height:15px;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(28,25,23,.3)"></div>',
  iconSize: [19, 19], iconAnchor: [10, 10],
});

type Biz = { id: string; name: string; lat: number | null; lng: number | null };

function Fit({ bizs }: { bizs: Biz[] }) {
  const map = useMap();
  useEffect(() => {
    const pts = bizs.filter(b => b.lat != null && b.lng != null).map(b => [b.lat!, b.lng!] as [number, number]);
    if (pts.length > 1) map.fitBounds(L.latLngBounds(pts), { padding: [40, 40] });
    else if (pts.length === 1) map.setView(pts[0], 15);
  }, [bizs, map]);
  return null;
}

export default function MapaExplorar({ bizs, onPick }: { bizs: Biz[]; onPick?: (id: string) => void }) {
  const withGeo = bizs.filter(b => b.lat != null && b.lng != null);
  if (!withGeo.length) return null;
  return (
    <MapContainer
      center={[10.986, -63.809]}
      zoom={13}
      style={{ height: 280, borderRadius: 16, border: '1px solid var(--line)' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <Fit bizs={withGeo} />
      {withGeo.map(b => (
        <Marker
          key={b.id}
          position={[b.lat!, b.lng!]}
          icon={icon}
          eventHandlers={{ click: () => onPick?.(b.id) }}
        />
      ))}
    </MapContainer>
  );
}
