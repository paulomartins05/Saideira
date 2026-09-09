"use client";
import dynamic from 'next/dynamic';

const MapaComLeaflet = dynamic(() => import('./MapaInterno'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse text-sm text-gray-500">Carregando Mapa...</div>
});

export default function MapaGeolocalizacao({ latitude, longitude }: { latitude?: number | null, longitude?: number | null }) {
  if (!latitude || !longitude) return null;
  
  return (
    <div className="w-full h-64 md:h-80 relative rounded-2xl overflow-hidden shadow-sm border border-gray-200 mt-6 z-0">
      <MapaComLeaflet latitude={latitude} longitude={longitude} />
    </div>
  );
}
