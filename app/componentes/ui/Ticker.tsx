import { Clock } from "lucide-react";

export function Ticker() {
    return (
        <div className="bg-[#12151C] text-amber overflow-hidden whitespace-nowrap border-b border-line-dark">
            <div className="inline-flex gap-11 py-2 animate-marquee">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <span key={i} className="text-[11.5px] font-semibold inline-flex items-center gap-2 text-[#E8C888]">
                        <Clock className="w-3.5 h-3.5" />
                        <b className="text-white">Marmita executiva</b> — Cantina Bella Vista — fecha em 18 min
                    </span>
                ))}
            </div>
        </div>
    );
}
