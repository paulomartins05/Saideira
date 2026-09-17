import Header from "@/app/_components/header";
import Container from "@/app/componentes/container";
import Button from "@/app/componentes/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PRECO_ASSINATURA_DESTAQUE } from "@/lib/planos";
import { Check } from "lucide-react";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";


type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AssinaturaPage(props: Props) {
  const resolvedSearchParams = await props.searchParams;
  const erroCancelamento = resolvedSearchParams?.erro === 'cancelamento';
  const sucessoCancelamento = resolvedSearchParams?.sucesso === 'cancelado';

  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user || session.user.role !== "PARCEIRO") {
    redirect("/");
  }

  const assinatura = await prisma.assinatura.findUnique({
    where: { parceiroId: session.user.id }
  });

  const isActive = assinatura?.status === "ATIVA";

  return (
    <div className="bg-[#Fdfbf7] min-h-screen flex flex-col font-inter text-[#2d2d2d]">
      <Header />

      <main className="py-12 grow">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb e Título */}
            <div className="mb-8">
              <div className="text-[13px] text-gray-500 mb-4 flex items-center gap-1.5 font-medium">
                <Link href="/parceiro/perfil" className="hover:text-gray-800 transition-colors">Painel</Link>
                <span>{'>'}</span>
                <span className="font-bold text-gray-800">Assinatura</span>
              </div>
              <h1 className="text-[32px] md:text-[40px] font-extrabold text-[#111] mb-3 leading-tight tracking-tight font-display">
                Coloque sua loja em destaque
              </h1>
              <p className="text-[15px] text-gray-600 max-w-2xl font-medium leading-relaxed">
                Suas ofertas ganham prioridade entre negócios com o mesmo nível de urgência<br />
                — sem nunca passar na frente de uma oferta prestes a vencer.
              </p>
            </div>

            {sucessoCancelamento && (
              <div className="mb-8 bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 font-medium">
                <CheckCircle className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> Cancelamento realizado com sucesso. Você não será mais cobrado.
              </div>
            )}

            {erroCancelamento && (
              <div className="mb-8 bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 font-medium">
                <XCircle className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> Tivemos uma instabilidade com o Mercado Pago. Tente novamente em alguns minutos.
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start mt-10">

              {/* Lado Esquerdo: Card Escuro do Plano */}
              <div className="w-full md:w-[400px] shrink-0 bg-[#15171a] rounded-[24px] p-8 shadow-xl text-white relative overflow-hidden">
                {/* Glow sutil no fundo do card */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#fbbd23] opacity-10 blur-[50px] rounded-full"></div>

                <div className="relative z-10">
                  <div className="inline-block border border-[#fbbd23]/40 text-[#fbbd23] text-[12px] font-bold px-3 py-1.5 rounded-full mb-8">
                    Plano Destaque
                  </div>

                  <div className="flex items-center gap-4 mb-10">
                    <div className="flex flex-col leading-none text-[#fbbd23]">
                      <span className="text-[28px] font-extrabold tracking-tighter">R$</span>
                      <span className="text-[52px] font-extrabold tracking-tighter -mt-2">19,90</span>
                    </div>
                    <div className="text-[13px] text-gray-400 font-medium leading-snug pt-2">
                      /mês, cancele<br />quando quiser
                    </div>
                  </div>

                  <ul className="flex flex-col gap-4 mb-10 text-[14px] text-gray-300 font-medium">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#fbbd23] shrink-0 stroke-[3]" />
                      <span>Prioridade entre ofertas de urgência parecida</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#fbbd23] shrink-0 stroke-[3]" />
                      <span>Selo de destaque visível pro consumidor</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#fbbd23] shrink-0 stroke-[3]" />
                      <span>Pagamento via Mercado Pago (Pix, cartão ou boleto)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#fbbd23] shrink-0 stroke-[3]" />
                      <span>Cancele quando quiser, sem fidelidade</span>
                    </li>
                  </ul>

                  {!isActive ? (
                    <form action="/api/assinatura" method="POST">
                      <button type="submit" className="w-full bg-[#fbbd23] hover:bg-[#e5a91f] text-[#111] font-bold text-[15px] py-4 rounded-xl transition-all shadow-lg shadow-[#fbbd23]/20">
                        Assinar com Mercado Pago
                      </button>
                    </form>
                  ) : (
                    <div className="w-full bg-green-500/10 border border-green-500/30 text-green-400 font-bold text-[15px] py-4 rounded-xl text-center">
                      Plano Ativo
                    </div>
                  )}
                </div>
              </div>

              {/* Lado Direito: Informações e Status */}
              <div className="flex-1 flex flex-col pt-2">

                {isActive && (
                  <div className="bg-[#eefcf2] border border-[#bbf7d0] text-[#166534] p-5 rounded-xl flex items-center gap-2.5 mb-10 shadow-sm font-medium text-[15px]">
                    <CheckCircle className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> Sua assinatura está ativa — sua loja já tem prioridade.
                  </div>
                )}

                {assinatura?.status === "INADIMPLENTE" && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-xl flex items-center gap-2.5 mb-10 shadow-sm font-medium text-[15px]">
                    <AlertTriangle className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> Seu último pagamento falhou. Por favor, assine novamente para regularizar.
                  </div>
                )}

                <div className="mb-10">
                  <h2 className="text-[18px] font-bold text-[#111] mb-4">Como funciona a prioridade</h2>
                  <p className="text-[15px] text-gray-600 leading-relaxed font-medium">
                    As ofertas são sempre agrupadas por urgência primeiro — quem está prestes a vencer aparece antes de qualquer outra coisa. O destaque só decide a ordem <span className="font-bold text-[#111]">dentro do mesmo grupo de urgência</span>, então sua loja ganha visibilidade real sem nunca contribuir pra mais desperdício.
                  </p>
                </div>

                {isActive && (
                  <div>
                    <form action="/api/assinatura/cancelar" method="POST">
                      <button type="submit" className="px-6 py-3 border border-[#fca5a5] text-[#ef4444] hover:bg-[#fef2f2] font-bold rounded-xl text-[14px] transition-colors">
                        Cancelar assinatura
                      </button>
                    </form>
                  </div>
                )}

              </div>

            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}