import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  titulo: string;
  valor: string | number;
  subtitulo: string;
  icone: LucideIcon;
}

export function StatsCard({ titulo, valor, subtitulo, icone: Icon }: StatsCardProps) {
  return (
    <div className="bg-white border border-line rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{titulo}</h3>
        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
          <Icon size={20} />
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className="font-display text-3xl font-extrabold text-night">{valor}</span>
        <span className="text-sm text-gray-400 mt-1 font-medium">{subtitulo}</span>
      </div>
    </div>
  )
}
