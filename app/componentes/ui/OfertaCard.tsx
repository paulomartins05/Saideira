import { Utensils, Clock, Check } from "lucide-react";
interface OfertaCardProps {
    loja: string;
    titulo: string;
    precoAntigo: string;
    precoNovo: string;
    tempoRestante: string;
    isPremium?: boolean;
}
export function OfertaCard({ loja, titulo, precoAntigo, precoNovo, tempoRestante, isPremium }: OfertaCardProps) {
    return (
        <article className={`bg-card border rounded-xl overflow-hidden transition-all ${isPremium ? 'border-amber ring-1 ring-amber/20' : 'border-line'
            }`}>
            <div className="aspect-[4/3] bg-[#EFE9DC] relative flex items-center justify-center overflow-hidden">
                <Utensils className="w-8 h-8 text-[#B7AD98]" />

                <span className={`absolute top-2 left-2 inline-flex items-center gap-1 text-[10.5px] font-extrabold px-2 py-1 rounded-md shadow-[0_0_0_1px] ${isPremium
                    ? 'bg-coral text-white shadow-coral/40'
                    : 'bg-night text-amber shadow-amber/35'
                    }`}>
                    <Clock className="w-3 h-3" /> {tempoRestante}
                </span>
                <span className="absolute top-2 right-2 bg-night/75 text-white text-[9.5px] font-bold px-2 py-1 rounded flex items-center gap-1">
                    <Utensils className="w-3 h-3" /> Restaurante
                </span>
                {isPremium && (
                    <span className="absolute bottom-2 left-2 flex items-center gap-1 bg-night text-amber text-[9.5px] font-extrabold px-2 py-1 rounded-full border border-amber/50">
                        <Check className="w-2.5 h-2.5" /> Destaque
                    </span>
                )}
            </div>
            <div className="p-3.5">
                <p className="text-[10.5px] text-muted font-semibold mb-1">{loja}</p>
                <h3 className="font-display text-[14.5px] font-bold mb-2 leading-tight">{titulo}</h3>
                <div className="flex items-center justify-between">
                    <span className="text-[10.5px] text-[#A39D8E] line-through">{precoAntigo}</span>
                    <span className="font-display text-lg font-extrabold">{precoNovo}</span>
                </div>
            </div>
        </article>
    );
}