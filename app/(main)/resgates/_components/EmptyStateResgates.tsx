import Link from "next/link";
import { SearchX, PackageOpen } from "lucide-react";

export default function EmptyStateResgates() {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-amber/20 text-amber-dark rounded-full flex items-center justify-center mb-6">
                <PackageOpen className="w-12 h-12" strokeWidth={1.5} />
            </div>

            <h3 className="text-2xl font-display font-extrabold text-night mb-3 tracking-tight">
                Puxa, não temos esse produto!
            </h3>

            <p className="text-muted text-[15px] max-w-md mx-auto mb-8 leading-relaxed">
                Parece que não encontramos nenhum resgate com os filtros que você selecionou. Que tal limpar a busca e ver o que mais tem de gostoso por aqui?
            </p>

            <Link
                href="/resgates"
                className="inline-flex items-center justify-center gap-2 bg-amber hover:bg-amber-dark text-night font-bold py-3.5 px-8 rounded-xl transition-all hover:scale-105 active:scale-95"
            >
                <SearchX className="w-5 h-5" />
                Ver todos os resgates
            </Link>
        </div>
    );
}
