import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Utensils, Wheat, ShoppingBasket, Cake } from "lucide-react";

export default async function ExploreLanches() {
  const ofertas = await prisma.oferta.findMany({
    where: {
      quantidade: { gt: 0 },
      ativo: true,
      dataValidade: { gt: new Date() }
    },
    select: {
      id: true,
      vendedor: {
        select: {
          tipoNegocio: true
        }
      }
    }
  });

  const totalGeral = ofertas.length;

  const contagem = {
    RESTAURANTE: 0,
    PADARIA: 0,
    MERCADO: 0,
    DOCERIA: 0,
  };

  ofertas.forEach(oferta => {
    const tipo = oferta.vendedor?.tipoNegocio;
    if (tipo && contagem[tipo as keyof typeof contagem] !== undefined) {
      contagem[tipo as keyof typeof contagem]++;
    }
  });

  const categorias = [
    { id: "RESTAURANTE", nome: "Restaurantes", count: contagem.RESTAURANTE, icone: <Utensils className="w-[14px] h-[14px]" /> },
    { id: "PADARIA", nome: "Padarias", count: contagem.PADARIA, icone: <Wheat className="w-[14px] h-[14px]" /> },
    { id: "MERCADO", nome: "Mercados", count: contagem.MERCADO, icone: <ShoppingBasket className="w-[14px] h-[14px]" /> },
    { id: "DOCERIA", nome: "Docerias", count: contagem.DOCERIA, icone: <Cake className="w-[14px] h-[14px]" /> },
  ];

  return (
    <section className="pt-6 pb-2">
      <div className="max-w-[1160px] mx-auto px-7">
        <div className="flex gap-0.5 border-b-[1.5px] border-line overflow-x-auto mb-6 scrollbar-hide">

          <Link href="/resgates" className="flex items-center gap-1.5 py-2.5 px-4 text-[13px] font-bold text-night border-b-[2.5px] border-amber -mb-[1.5px] whitespace-nowrap">
            Todos
            <span className="bg-amber text-night text-[10px] font-bold px-[7px] py-[1px] rounded-[10px]">
              {totalGeral}
            </span>
          </Link>

          {categorias.map((categoria) => (
            <Link
              key={categoria.id}
              href={`/resgates?tipoNegocio=${categoria.id}`}
              className="flex items-center gap-1.5 py-2.5 px-4 text-[13px] font-bold text-muted border-b-[2.5px] border-transparent hover:text-night -mb-[1.5px] whitespace-nowrap transition-colors"
            >
              {categoria.icone}
              {categoria.nome}
              <span className="bg-line text-night text-[10px] font-bold px-[7px] py-[1px] rounded-[10px]">
                {categoria.count}
              </span>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}