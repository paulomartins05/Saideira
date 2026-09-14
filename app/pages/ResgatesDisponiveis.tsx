import Link from "next/link";
import { OfertaCard } from "../componentes/ui/OfertaCard";
import { calcularTempoPostagem } from "../../lib/utils";
import { prisma } from "@/lib/prisma"

export default async function ResgatesDisponiveis() {
  const ofertas = await prisma.oferta.findMany({
    take: 8,
    orderBy: {
      dataValidade: "asc"
    },
    where: {
      dataValidade: { gt: new Date() },
      quantidade: { gt: 0 },
      ativo: true,
    }
  });

  return (
    <section className="pb-10">
      <div className="max-w-[1160px] mx-auto px-7">
        
        <h2 className="font-display text-[21px] font-extrabold m-0 tracking-[-0.01em] flex items-center gap-2">
          Fechando <span className="text-amber-dark">agora</span>
        </h2>
        <p className="text-[13px] text-muted mb-4 mt-1">
          Ordenado por quem vence primeiro — não por quem paga mais
        </p>

        {ofertas.length === 0 ? (
          <div className="text-center py-10 bg-card border border-line rounded-xl mt-4">
            <p className="text-muted font-semibold text-sm">Nenhum resgate disponível no momento. Volte mais tarde!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {ofertas.map((oferta) => {
              // Calculando o tempo restante em minutos/horas para mostrar de forma amigável
              const diffMs = new Date(oferta.dataValidade).getTime() - new Date().getTime();
              const diffMins = Math.max(1, Math.floor(diffMs / 60000));
              const tempoFormatado = diffMins > 60 
                ? `${Math.floor(diffMins / 60)}h ${diffMins % 60}m` 
                : `${diffMins} min`;

              return (
                <Link href={`/resgates/${oferta.id}`} key={oferta.id}>
                  <OfertaCard
                    loja={oferta.localizacao || "Loja Parceira"}
                    titulo={oferta.titulo}
                    precoAntigo={`R$ ${(oferta.precoResgate * 2).toFixed(2).replace('.', ',')}`} // Simulação de preço antigo caso não exista
                    precoNovo={`R$ ${oferta.precoResgate.toFixed(2).replace('.', ',')}`}
                    tempoRestante={tempoFormatado}
                    isPremium={diffMins < 30} // Destaque para ofertas que fecham em menos de 30 min
                  />
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}