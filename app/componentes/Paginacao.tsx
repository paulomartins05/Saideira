"use client"

import Link from "next/link";
import { useSearchParams } from "next/navigation";


interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
}

export default function Paginacao({ paginaAtual, totalPaginas }: PaginacaoProps) {

  const searchParams = useSearchParams();
  const categoria = searchParams.get("categoria") || "Todos"

  if (totalPaginas <= 1) {
    return null;
  }

  const paginas = Array.from({ length: totalPaginas }, (_, index) => index + 1);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("pagina", pageNumber.toString());
    return `/resgates?${params.toString()}`;
  };

  return (
    <div className="w-full flex flex-col items-center justify-center mt-12 mb-8 gap-4">
      <span className="font-inter text-sm text-background-secondary font-medium">
        Página {paginaAtual} de {totalPaginas}
      </span>

      <div className="flex items-center gap-2">

        {paginaAtual === 1 ? (
          <span className="px-4 py-2 rounded-full border border-background-secondary/30 font-inter text-sm text-background-secondary opacity-50 cursor-not-allowed">
            Anterior
          </span>
        ) : (
          <Link
            href={createPageURL(paginaAtual - 1)}
            className="px-4 py-2 rounded-full border border-background-secondary/30 font-inter text-sm text-background-secondary hover:bg-background-secondary/5 transition-colors"
          >
            Anterior
          </Link>
        )}

        <div className="flex items-center gap-1">
          {paginas.map((num) => (
            <Link
              key={num}
              href={createPageURL(num)}
              className={`w-8 h-8 flex items-center justify-center rounded-full font-inter text-sm transition-colors ${
                paginaAtual === num
                  ? "bg-amber text-night font-bold"
                  : "text-background-secondary hover:bg-background-secondary/10"
              }`}
            >
              {num}
            </Link>
          ))}
        </div>

        {paginaAtual === totalPaginas ? (
          <span className="px-4 py-2 rounded-full bg-amber text-night font-inter text-sm font-bold opacity-50 cursor-not-allowed">
            Próxima
          </span>
        ) : (
          <Link
            href={createPageURL(paginaAtual + 1)}
            className="px-4 py-2 rounded-full bg-amber text-night font-inter text-sm font-bold hover:bg-amber-dark transition-colors"
          >
            Próxima
          </Link>
        )}

      </div>
    </div>
  );
}