import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FormularioLogin from "./_components/FormularioLogin";
import { OfertaCard } from "@/app/componentes/ui/OfertaCard";

export default async function LoginPage() {
  const ofertaDestaque = await prisma.oferta.findFirst({
    where: {
      ativo: true,
      quantidade: { gt: 0 },
      dataValidade: { gt: new Date() }
    },
    include: {
      vendedor: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-paper font-inter">
      <div className="hidden md:flex flex-1 bg-night flex-col items-center justify-center p-10 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-amber/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-[340px]">
          {ofertaDestaque ? (
            <OfertaCard
              loja={ofertaDestaque.vendedor.name || "Restaurante Parceiro"}
              titulo={ofertaDestaque.titulo}
              descricao={ofertaDestaque.descricao || undefined}
              precoAntigo={`R$ ${(Number(ofertaDestaque.precoResgate) * 2).toFixed(2).replace('.', ',')}`}
              precoNovo={`R$ ${Number(ofertaDestaque.precoResgate).toFixed(2).replace('.', ',')}`}
              tempoRestante="Resgate Rápido"
              isPremium={true}
              imagemUrl={ofertaDestaque.imagemUrl[0] || ""}
            />
          ) : (
            <div className="text-white/60 text-center text-sm">Aguardando novas ofertas especiais...</div>
          )}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-[400px]">
          <Link href="/" className="inline-flex items-center gap-2 font-display font-extrabold text-[22px] text-night mb-10">
            <span className="w-8 h-8 rounded-lg bg-amber text-night flex items-center justify-center font-display font-extrabold text-base">S</span>
            Saideira
          </Link>

          <h1 className="font-display font-extrabold text-[28px] text-night mb-2">Bem-vindo de volta</h1>
          <p className="text-[13.5px] text-muted mb-8">Entre para continuar salvando comida e dinheiro.</p>

          <Suspense fallback={<div className="animate-pulse h-32 bg-line rounded-lg"></div>}>
            <FormularioLogin />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
