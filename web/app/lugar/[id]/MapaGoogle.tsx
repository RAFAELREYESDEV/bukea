'use client';
export default function MapaGoogle({ name, lat, lng }: { name: string; lat?: number|null; lng?: number|null }) {
  const q = lat && lng ? `${lat},${lng}` : name;
  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,.65)', height: 220 }}>
      <iframe
        title="Ubicación"
        src={`https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`}
        style={{ width: '100%', height: '100%', border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
