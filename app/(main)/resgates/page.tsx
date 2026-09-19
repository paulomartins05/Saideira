import { Suspense } from "react";
import Link from "next/link";
import FiltroCategorias from "@/app/componentes/FiltroCategorias";
import { ChevronRight, Loader2 } from "lucide-react";
import ListaOfertas from "./_components/ListaOfertas";

export default async function PaginaTodosResgates({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; pagina?: string; busca?: string }>
}) {
  const params = await searchParams;
  const categoriaAtiva = params.categoria || "Todos";
  const paginaAtual = Number(params.pagina) || 1;
  const textoDaBusca = params.busca || "";

  return (
    <div className="bg-paper min-h-screen flex flex-col font-inter">

      <main className="pb-10 grow">
        <div className="max-w-[1160px] mx-auto px-7 pt-7">

          <div className="flex items-center gap-1.5 text-[12.5px] text-muted mb-3.5 flex-wrap font-medium">
            <Link href="/" className="hover:text-night transition-colors">Início</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-night font-bold">Ofertas</span>
          </div>

          <FiltroCategorias categoriaAtiva={categoriaAtiva} buscaAtual={textoDaBusca} />

          <Suspense
            key={`${categoriaAtiva}-${paginaAtual}-${textoDaBusca}`}
            fallback={
              <div className="py-24 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-amber animate-spin" />
                <p className="text-[13px] font-bold text-muted">Buscando as melhores ofertas...</p>
              </div>
            }
          >
            <ListaOfertas
              categoriaAtiva={categoriaAtiva}
              paginaAtual={paginaAtual}
              textoDaBusca={textoDaBusca}
            />
          </Suspense>

        </div>
      </main>
    </div>
  );
}
