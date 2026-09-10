import { cn } from "../../lib/utils";
import Link from "next/link";

const categorias = ["Todos", "Restaurantes", "Padarias", "Mercados", "Docerias", "Outros"];

interface FiltroProps {
  categoriaAtiva: string;
}

export default function FiltroCategorias({ categoriaAtiva }: FiltroProps) {
  return (
    <div className="flex flex-col gap-2 mb-8">
      <span className="font-inter font-semibold text-background-secondary text-sm">
        Categorias
      </span>
      <div className="flex flex-wrap gap-3">
        {categorias.map((categoria) => (
          <Link
            key={categoria}
            href={`/resgates?categoria=${categoria}`} 
            className={cn(
              "px-5 py-2 rounded-full font-inter text-sm font-medium transition-colors border",
              categoria === categoriaAtiva
                ? "bg-[#D9774A] text-white border-[#D9774A]" 
                : "bg-transparent text-background-secondary border-background-secondary/30 hover:border-background-secondary"
            )}
          >
            {categoria}
          </Link>
        ))}
      </div>
    </div>
  );
}