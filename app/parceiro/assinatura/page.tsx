import Header from "@/app/pages/header";
import Container from "@/app/componentes/container";
import Button from "@/app/componentes/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PRECO_ASSINATURA_DESTAQUE, formatarPreco } from "@/lib/planos";

export default async function AssinaturaPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  if (!session?.user || session.user.role !== "PARCEIRO") {
    redirect("/");
  }
  const assinatura = await prisma.assinatura.findUnique({
    where: { parceiroId: session.user.id }
  });
  return (
    <div className="bg-[#F6EFE5] min-h-screen flex flex-col font-inter text-background-secondary">
      <Header />
      <hr className="opacity-10 border-background-secondary" />
      <main className="py-8 grow">
        <Container>
          <div className="mb-8">
            <div className="text-sm text-[#B87042] mb-4 flex items-center gap-2">
              <Link href="/parceiro/perfil" className="hover:underline">Área do Parceiro</Link>
              <span>{'>'}</span>
              <span className="font-medium">Assinatura Premium</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-playfair mb-2">
              Destaque sua loja
            </h1>
            <p className="text-lg opacity-80 max-w-2xl">
              Ative a assinatura premium para aparecer no topo das buscas e aumentar suas vendas.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-[#e8dfd5] shadow-sm max-w-xl">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Plano Destaque</h2>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black text-[#D9774A]">
                    {formatarPreco(PRECO_ASSINATURA_DESTAQUE)}
                  </span>
                  <span className="text-gray-500 font-medium">/mês</span>
                </div>
                <ul className="flex flex-col gap-3 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✅</span> Suas ofertas sempre no topo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✅</span> Selo de Destaque Exclusivo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✅</span> Cancele quando quiser
                  </li>
                </ul>
              </div>
              {assinatura?.status === "ATIVA" ? (
                <div className="flex flex-col gap-4">
                  <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200">
                    <h3 className="font-bold mb-1">🎉 Assinatura Ativa</h3>
                    <p className="text-sm">Sua loja já tem prioridade nas buscas!</p>
                  </div>
                  <form action="/api/assinatura/cancelar" method="POST">
                    <Button type="submit" variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors">
                      Cancelar Assinatura
                    </Button>
                  </form>
                </div>
              ) : (
                <form action="/api/assinatura" method="POST">
                  <Button type="submit" variant="primary" className="w-full py-4 text-lg">
                    Assinar com Mercado Pago
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}