import { Utensils, Clock, Check } from "lucide-react";
import Image from "next/image";

interface OfertaCardProps {
    loja: string;
    titulo: string;
    descricao?: string;
    precoAntigo: string;
    precoNovo: string;
    tempoRestante: string;
    isPremium?: boolean;
    imagemUrl?: string;
}

export function OfertaCard({ loja, titulo, descricao, precoAntigo, precoNovo, tempoRestante, isPremium, imagemUrl }: OfertaCardProps) {
    return (
        <article className={`relative z-10 bg-night border border-line p-5 rounded-[20px] w-full shadow-2xl transition-all hover:-translate-y-1 hover:shadow-amber/5 h-full flex flex-col ${isPremium ? 'border-amber ring-1 ring-amber/20' : ''}`}>
            
            <div className="flex items-center justify-between mb-3 min-h-[16px]">
                <div className="text-[11px] font-bold tracking-widest uppercase text-amber truncate pr-2">
                    {isPremium ? (
                        <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Oferta em Destaque</span>
                    ) : (
                        loja
                    )}
                </div>
                {isPremium && <div className="text-[10px] text-muted truncate max-w-[40%]">{loja}</div>}
            </div>

            <div className="aspect-video bg-line rounded-lg mb-4 flex items-center justify-center text-muted text-sm overflow-hidden relative">
                {imagemUrl ? (
                    <Image
                        src={imagemUrl}
                        alt={titulo}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <Utensils className="w-8 h-8 text-muted" />
                )}
            </div>

            <h3 className="font-display font-extrabold text-[20px] text-white leading-tight mb-2 line-clamp-2" title={titulo}>
                {titulo}
            </h3>
            
            {descricao && (
                <p className="text-[13px] text-muted mb-4 line-clamp-2">
                    {descricao}
                </p>
            )}

            <div className="flex justify-between items-end mt-auto pt-2">
                <div>
                    <span className="text-[11px] text-muted line-through block mb-0.5">{precoAntigo}</span>
                    <span className="font-display font-bold text-lg text-amber">{precoNovo}</span>
                </div>
                <div className="bg-coral text-white text-[11px] font-bold px-2 py-1 rounded-md flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {tempoRestante}
                </div>
            </div>
        </article>
    );
}
