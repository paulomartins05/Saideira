"use client";

import { OfertaCard } from "./ui/OfertaCard";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { CATEGORIAS_POR_NEGOCIO } from "../constants/categorias";

export type ProdutoPropsComLocal = {
  id: string,
  nome: string,
  categoria?: string,
  descricao: string,
  preco: number,
  tempoPostagem: string,
  imagemUrl: string,
  latitude?: number | null,
  longitude?: number | null,
  isPremium?: boolean,
  faixaUrgencia?: number,
  tempoRestanteFormatado: string,
  loja: string,
};

export default function ListaResgatesClient({ produtos }: { produtos: ProdutoPropsComLocal[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleBuscar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const termo = formData.get("busca") as string;
    const subCategoria = formData.get("subCategoria") as string;

    const params = new URLSearchParams(searchParams);

    if (termo) {
      params.set("busca", termo);
    } else {
      params.delete("busca");
    }

    if (subCategoria && subCategoria !== "") {
      params.set("subCategoria", subCategoria);
    } else {
      params.delete("subCategoria");
    }

    params.set("pagina", "1");

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 flex-wrap mb-5">
        <div>
          <h1 className="font-display text-[25px] font-extrabold m-0 mb-1.5 tracking-[-0.01em]">Ofertas perto de você</h1>
          <p className="text-[13.5px] text-muted m-0 max-w-[520px]">
            {produtos.length} {produtos.length === 1 ? 'oferta ativa' : 'ofertas ativas'} agora
          </p>
        </div>

        <form onSubmit={handleBuscar} className="flex gap-2 w-full md:w-auto md:min-w-[450px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              name="busca"
              defaultValue={searchParams.get("busca")?.toString()}
              placeholder="Buscar por pizza, bolo, mercado..."
              className="w-full bg-paper border border-line rounded-xl py-2.5 pl-10 pr-4 text-[14px] text-night placeholder:text-muted focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-colors shadow-sm"
            />
          </div>

          <select
            name="subCategoria"
            defaultValue={searchParams.get("subCategoria")?.toString() || ""}
            className="bg-paper border border-line rounded-xl py-2.5 px-3 text-[14px] text-night focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-colors shadow-sm cursor-pointer max-w-[160px] truncate"
            onChange={(e) => {
              const form = e.target.form;
              if (form) form.requestSubmit();
            }}
          >
            <option value="">Todas Categorias</option>

            {Object.entries(CATEGORIAS_POR_NEGOCIO).map(([tipoNegocio, categorias]) => (
              <optgroup
                key={tipoNegocio}
                label={tipoNegocio.charAt(0) + tipoNegocio.slice(1).toLowerCase()}
              >
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <button type="submit" className="hidden">Buscar</button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
        {produtos.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-card border border-line rounded-xl">
            <Search className="w-10 h-10 text-line-dark mb-3" />
            <p className="text-night font-bold text-base mb-1">Nenhum resgate encontrado</p>
            <p className="text-muted text-sm max-w-[300px]">Não achamos nenhuma oferta com esses filtros. Tente mudar a categoria ou a sua busca.</p>
          </div>
        ) : (
          produtos.map((produto) => (
            <Link href={`/resgates/${produto.id}`} key={produto.id}>
              <OfertaCard
                loja={produto.loja}
                titulo={produto.nome}
                descricao={produto.descricao}
                precoAntigo={`R$ ${(produto.preco * 2).toFixed(2).replace('.', ',')}`}
                precoNovo={`R$ ${produto.preco.toFixed(2).replace('.', ',')}`}
                tempoRestante={produto.tempoRestanteFormatado}
                isPremium={produto.isPremium}
                imagemUrl={produto.imagemUrl}
              />
            </Link>
          ))
        )}
      </div>
    </>
  );
}
