import Header from "@/app/_components/header";
import Container from "@/app/componentes/container";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Check, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import BotaoSubmit from "@/app/componentes/BotaoSubmit";

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
    <div className="bg-paper min-h-screen flex flex-col font-inter text-night">
      <Header />

      <main className="py-12 grow">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <div className="text-[13px] text-muted mb-4 flex items-center gap-1.5 font-medium">
                <Link href="/parceiro/perfil" className="hover:text-night transition-colors">Painel</Link>
                <span>{'>'}</span>
                <span className="font-bold text-night">Assinatura</span>
              </div>
              <h1 className="text-[32px] md:text-[40px] font-extrabold text-night mb-3 leading-tight tracking-tight font-display">
                Coloque sua loja em destaque
              </h1>
              <p className="text-[15px] text-muted max-w-2xl font-medium leading-relaxed">
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
              <div className="mb-8 bg-coral/10 text-coral p-4 rounded-xl border border-coral/30 font-medium">
                <XCircle className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> Tivemos uma instabilidade com o Mercado Pago. Tente novamente em alguns minutos.
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start mt-10">

              <div className="w-full md:w-[400px] shrink-0 bg-night rounded-[24px] p-8 shadow-xl text-paper relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber opacity-10 blur-[50px] rounded-full"></div>

                <div className="relative z-10">
                  <div className="inline-block border border-amber/40 text-amber text-[12px] font-bold px-3 py-1.5 rounded-full mb-8">
                    Plano Destaque
                  </div>

                  <div className="flex items-center gap-4 mb-10">
                    <div className="flex flex-col leading-none text-amber">
                      <span className="text-[28px] font-extrabold tracking-tighter">R$</span>
                      <span className="text-[52px] font-extrabold tracking-tighter -mt-2">19,90</span>
                    </div>
                    <div className="text-[13px] text-muted font-medium leading-snug pt-2">
                      /mês, cancele<br />quando quiser
                    </div>
                  </div>

                  <ul className="flex flex-col gap-4 mb-10 text-[14px] text-paper/80 font-medium">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-amber shrink-0 stroke-[3]" />
                      <span>Prioridade entre ofertas de urgência parecida</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-amber shrink-0 stroke-[3]" />
                      <span>Selo de destaque visível pro consumidor</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-amber shrink-0 stroke-[3]" />
                      <span>Pagamento via Mercado Pago (Pix, cartão ou boleto)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-amber shrink-0 stroke-[3]" />
                      <span>Cancele quando quiser, sem fidelidade</span>
                    </li>
                  </ul>

                  {!isActive ? (
                    <form action="/api/assinatura" method="POST">
                      <BotaoSubmit
                        texto="Assinar com Mercado Pago"
                        textoCarregando="Redirecionando..."
                        className="w-full bg-amber hover:bg-amber-dark text-night font-bold text-[15px] py-4 rounded-xl transition-all shadow-lg shadow-amber/20"
                      />
                    </form>
                  ) : (
                    <div className="w-full bg-green-500/10 border border-green-500/30 text-green-400 font-bold text-[15px] py-4 rounded-xl text-center">
                      Plano Ativo
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col pt-2">

                {isActive && (
                  <div className="bg-[#eefcf2] border border-[#bbf7d0] text-[#166534] p-5 rounded-xl flex items-center gap-2.5 mb-10 shadow-sm font-medium text-[15px]">
                    <CheckCircle className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> Sua assinatura está ativa — sua loja já tem prioridade.
                  </div>
                )}

                {assinatura?.status === "INADIMPLENTE" && (
                  <div className="bg-coral/10 border border-coral/30 text-coral p-5 rounded-xl flex items-center gap-2.5 mb-10 shadow-sm font-medium text-[15px]">
                    <AlertTriangle className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> Seu último pagamento falhou. Por favor, assine novamente para regularizar.
                  </div>
                )}

                <div className="mb-10">
                  <h2 className="text-[18px] font-bold text-night mb-4">Como funciona a prioridade</h2>
                  <p className="text-[15px] text-muted leading-relaxed font-medium">
                    As ofertas são sempre agrupadas por urgência primeiro — quem está prestes a vencer aparece antes de qualquer outra coisa. O destaque só decide a ordem <span className="font-bold text-night">dentro do mesmo grupo de urgência</span>, então sua loja ganha visibilidade real sem nunca contribuir pra mais desperdício.
                  </p>
                </div>

                {isActive && (
                  <div>
                    <form action="/api/assinatura/cancelar" method="POST">
                      <BotaoSubmit
                        texto="Cancelar assinatura"
                        textoCarregando="Cancelando..."
                        className="px-6 py-3 border border-coral/30 text-coral hover:bg-coral/10 font-bold rounded-xl text-[14px] transition-colors"
                      />
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