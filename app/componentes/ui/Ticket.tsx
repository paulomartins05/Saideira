import { Utensils } from "lucide-react";
import Image from "next/image";

export interface TicketProps {
    titulo: string;
    loja: string;
    codigoPin: string;
    status: string;
    imageUrl?: string;
}

export function Ticket({ titulo, loja, codigoPin, status, imageUrl }: TicketProps) {
    const isPendente = status === "PENDENTE";

    return (
        <div className={`flex items-stretch border rounded-2xl mb-4 relative overflow-hidden transition-all duration-300 ${isPendente ? "bg-card border-line shadow-sm hover:shadow-md" : "bg-paper border-line-dark opacity-75"}`}>

            <div className="flex-1 flex items-center gap-4 p-5 min-w-0">
                <div className="w-14 h-14 rounded-xl bg-paper border border-line flex items-center justify-center shrink-0 overflow-hidden relative">
                    {imageUrl ? (
                        <img src={imageUrl} alt={titulo} className="object-cover w-full h-full" />
                    ) : (
                        <Utensils className="w-6 h-6 text-muted" />
                    )}
                </div>
                <div className="flex flex-col justify-center">
                    <h4 className="m-0 font-display font-bold text-base text-night truncate leading-tight mb-1">{titulo}</h4>
                    <p className="m-0 text-xs text-muted flex items-center gap-1.5">
                        <span className="truncate max-w-[120px] md:max-w-[200px]">{loja}</span>
                        <span>·</span>
                        <span className={isPendente ? "text-amber-dark font-bold tracking-wide" : "text-success font-bold tracking-wide"}>{status}</span>
                    </p>
                </div>
            </div>

            <div className="relative border-l-[3px] border-dashed border-line/40">
                <div className="absolute top-0 -left-[12px] w-6 h-6 bg-paper rounded-full -translate-y-1/2 shadow-inner"></div>
                <div className="absolute bottom-0 -left-[12px] w-6 h-6 bg-paper rounded-full translate-y-1/2 shadow-inner"></div>
            </div>

            <div className={`flex flex-col items-center justify-center py-4 px-6 min-w-[120px] md:min-w-[140px] shrink-0 ${isPendente ? "bg-night text-amber" : "bg-line text-muted"}`}>
                <span className="text-[9px] md:text-[10px] tracking-widest mb-1.5 opacity-80 font-semibold uppercase">
                    {isPendente ? "Código PIN" : "Resgatado"}
                </span>

                {isPendente && (
                    <div className="flex gap-[2px] items-end justify-center w-full h-6 mb-2.5 opacity-90">
                        <div className="w-1 h-full bg-current"></div>
                        <div className="w-[2px] h-full bg-current"></div>
                        <div className="w-1.5 h-full bg-current"></div>
                        <div className="w-[2px] h-4 bg-current"></div>
                        <div className="w-1 h-full bg-current"></div>
                        <div className="w-[2px] h-5 bg-current"></div>
                        <div className="w-2 h-full bg-current"></div>
                        <div className="w-[2px] h-full bg-current"></div>
                        <div className="w-1.5 h-4 bg-current"></div>
                        <div className="w-1 h-full bg-current"></div>
                    </div>
                )}

                <span className={`font-display text-2xl md:text-3xl font-extrabold tracking-widest leading-none ${isPendente ? "" : "line-through opacity-50"}`}>
                    {codigoPin}
                </span>
            </div>

        </div>
    );
}
