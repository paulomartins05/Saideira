import { cn } from "../../lib/utils";
import Link from "next/link";
import { Utensils, Wheat, ShoppingBasket, CupSoda, ShoppingBag } from "lucide-react";

const categorias = [
  { nome: "Todos", icone: null },
  { nome: "Restaurantes", icone: <Utensils className="w-3.5 h-3.5" /> },
  { nome: "Padarias", icone: <Wheat className="w-3.5 h-3.5" /> },
  { nome: "Mercados", icone: <ShoppingBasket className="w-3.5 h-3.5" /> },
  { nome: "Docerias", icone: <CupSoda className="w-3.5 h-3.5" /> },
  { nome: "Outros", icone: <ShoppingBag className="w-3.5 h-3.5" /> }
];

interface FiltroProps {
  categoriaAtiva: string;
}

export default function FiltroCategorias({ categoriaAtiva }: FiltroProps) {
  return (
    <div className="flex gap-2 flex-wrap mb-5">
      {categorias.map((categoria) => (
        <Link
          key={categoria.nome}
          href={`/resgates?categoria=${categoria.nome}`} 
          className={cn(
            "px-4 py-2 pr-4 pl-3 text-[12.5px] font-semibold flex items-center gap-1.5 border-[1.5px] transition-colors [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)]",
            categoria.nome === categoriaAtiva
              ? "bg-night text-paper border-night" 
              : "bg-card text-night border-line hover:border-night/40"
          )}
        >
          {categoria.icone}
          {categoria.nome}
        </Link>
      ))}
    </div>
  );
}