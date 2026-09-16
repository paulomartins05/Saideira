import Link from "next/link";
import Header from "../pages/header";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ChevronRight, Edit2, History, TrendingDown, PackageCheck } from "lucide-react";
import { BotaoAvaliar } from "../componentes/BotaoAvaliar";

export default async function PerfilPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  const usuario = session?.user;

  if (!usuario) {
    redirect("/login");
  }

  const historicoPedidos = await prisma.resgate.findMany({
    where: { userId: usuario.id },
    include: {
      oferta: {
        include: { vendedor: true }
      },
      avaliacao: true
    },
    orderBy: { createdAt: "desc" }
  });

  const totalResgates = historicoPedidos.length;
  const valorEconomizado = historicoPedidos.reduce((total, resgate) => {
    const economia = Number(resgate.oferta.precoOriginal) - Number(resgate.oferta.precoResgate);
    return total + (isNaN(economia) ? 0 : economia);
  }, 0);

  return (
    <div className="bg-paper min-h-screen flex flex-col font-inter text-night">
      <Header />

      <main className="pb-10">
        <div className="max-w-[800px] mx-auto px-7 pt-7">

          <div className="flex items-center gap-1.5 text-[12.5px] text-muted mb-6 flex-wrap font-medium">
            <Link href="/" className="hover:text-night transition-colors">Início</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-night font-bold">Minha Conta</span>
          </div>

          <div className="bg-card border border-line rounded-[20px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 mb-6">
            <div className="w-[88px] h-[88px] rounded-full bg-night text-amber font-display font-extrabold text-[32px] flex items-center justify-center shrink-0 overflow-hidden border-[3px] border-amber">
              {usuario.image ? (
                <img src={usuario.image} alt={usuario.name} className="w-full h-full object-cover" />
              ) : (
                usuario.name ? usuario.name.charAt(0) : "S"
              )}
            </div>
            <div className="text-center md:text-left grow">
              <h1 className="font-display font-extrabold text-[28px] mb-1 tracking-[-0.01em]">
                {usuario.name || "Usuário Salgado Salvo"}
              </h1>
              <p className="text-[14px] text-muted">{usuario.email}</p>
            </div>
            <Link href="/perfil/editar" className="shrink-0 bg-line text-night font-bold text-[13px] px-5 py-2.5 rounded-lg hover:bg-line/70 transition-colors flex items-center gap-2">
              <Edit2 className="w-4 h-4" />
              Editar
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-night text-paper rounded-[20px] p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber/10 blur-[30px] rounded-full"></div>
              <PackageCheck className="w-6 h-6 text-amber mb-3" />
              <span className="font-display font-extrabold text-[32px] mb-1 leading-none">{totalResgates}</span>
              <span className="text-[10px] uppercase tracking-widest text-muted font-bold">Resgates Feitos</span>
            </div>
            
            <div className="bg-amber text-night rounded-[20px] p-6 flex flex-col items-center justify-center text-center">
              <TrendingDown className="w-6 h-6 text-night/50 mb-3" />
              <span className="font-display font-extrabold text-[32px] mb-1 leading-none">
                <span className="text-xl">R$</span> {valorEconomizado.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-night/70 font-bold">Economizado</span>
            </div>
          </div>

          <div className="bg-card border border-line rounded-[20px] p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 border-b border-line pb-4">
              <History className="w-5 h-5 text-muted" />
              <h2 className="font-display font-extrabold text-lg">Histórico Recente</h2>
            </div>
            
            <div className="flex flex-col">
              {historicoPedidos.length === 0 ? (
                <p className="text-[13.5px] text-muted text-center py-6">Você ainda não realizou nenhum resgate.</p>
              ) : (
                historicoPedidos.map((resgate) => (
                  <div key={resgate.id} className="flex justify-between items-center py-4 border-b border-line last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-[14px] text-night mb-0.5">{resgate.oferta.titulo}</p>
                      <p className="text-[12px] text-muted">
                        {resgate.oferta.vendedor?.name || "Loja Parceira"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-[12px] font-bold uppercase tracking-wide mb-0.5 ${resgate.status === "PENDENTE" ? "text-amber-dark" : "text-green-600"}`}>
                        {resgate.status}
                      </p>
                      <p className="text-[11px] text-muted font-medium">
                        {resgate.createdAt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </p>
                      
                      {resgate.status === "RETIRADO" && !resgate.avaliacao && (
                         <BotaoAvaliar resgateId={resgate.id} />
                      )}
                      {resgate.avaliacao && (
                        <p className="text-[11px] text-green-600 font-bold mt-1">Avaliado com {resgate.avaliacao.nota} ⭐</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}