import { Utensils } from "lucide-react";

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
        <div className="flex items-stretch bg-card border border-line rounded-2xl mb-4 relative overflow-hidden">

            <div className="flex-1 flex items-center gap-3.5 p-4 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-[#EFE9DC] text-[#B7AD98] flex items-center justify-center shrink-0 overflow-hidden">
                    {imageUrl ? (
                        <img src={imageUrl} alt={titulo} className="w-full h-full object-cover" />
                    ) : (
                        <Utensils className="w-5 h-5" />
                    )}
                </div>
                <div>
                    <h4 className="m-0 font-display font-bold text-sm">{titulo}</h4>
                    <p className="m-0 text-[11px] text-muted">{loja} · <span className={isPendente ? "text-amber-dark font-bold" : "text-green-600 font-bold"}>{status}</span></p>
                </div>
            </div>

            <div className="w-0 border-l-2 border-dashed border-line relative my-3
        before:content-[''] before:absolute before:left-1/2 before:-translate-x-1/2 before:w-[18px] before:h-[18px] before:bg-paper before:rounded-full before:-top-[21px]
        after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:w-[18px] after:h-[18px] after:bg-paper after:rounded-full after:-bottom-[21px]
      "></div>

            <div className={`flex flex-col items-center justify-center py-3.5 px-5 min-w-[96px] ${isPendente ? "bg-night text-amber" : "bg-line text-muted"}`}>
                <span className="text-[8.5px] tracking-widest mb-1 opacity-70">CÓDIGO</span>
                <span className={`font-display text-xl font-extrabold tracking-wide ${isPendente ? "" : "line-through opacity-50"}`}>
                    {codigoPin}
                </span>
            </div>
        </div>
    );
}
