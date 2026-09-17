import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Header from "@/app/_components/header";
import { auth } from "@/lib/auth"
import { ChevronRight, Edit2, Wallet, PackageCheck, Star, Tag } from "lucide-react";
import { Suspense } from "react";

import VisaoGeral from "./_components/VisaoGeral";
import MeusProdutos from "./_components/MeusProdutos";
import Financeiro from "./_components/Financeiro";

export default async function Parceiro({
  searchParams
}: {
  searchParams: Promise<{ aba?: string; periodo?: string }>
}) {
  const params = await searchParams;
  const abaAtiva = params.aba || "visao-geral";
  const periodoAtivo = params.periodo || "todos";

  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user || session.user.role != "PARCEIRO") {
    redirect("/");
  }

  const usuario = session.user;



  return (
    <div className="bg-paper min-h-screen flex flex-col font-inter text-night">
      <Header />

      <main className="pb-10">
        <div className="max-w-[1000px] mx-auto px-7 pt-7">

          <div className="mb-8">
            <div className="flex items-center gap-1.5 text-[12.5px] text-muted mb-4 flex-wrap font-medium">
              <Link href="/" className="hover:text-night transition-colors">Início</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-night font-bold">Painel do Parceiro</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-line p-6 rounded-[20px]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-night text-amber font-display font-extrabold text-xl flex items-center justify-center border-2 border-amber overflow-hidden">
                  {usuario.image ? (
                    <img src={usuario.image} alt={usuario.name || "Loja"} className="w-full h-full object-cover" />
                  ) : (
                    usuario.name ? usuario.name.charAt(0).toUpperCase() : "L"
                  )}
                </div>
                <div>
                  <h1 className="text-[22px] font-display font-extrabold tracking-[-0.01em]">
                    {usuario.name || "Minha Loja"}
                  </h1>
                  <p className="text-[13px] text-muted">Gerencie suas ofertas e resgates</p>
                </div>
              </div>
              <Link href="/parceiro/editar" className="shrink-0 bg-line text-night font-bold text-[13px] px-5 py-2.5 rounded-lg hover:bg-line/70 transition-colors flex items-center gap-2 justify-center">
                <Edit2 className="w-4 h-4" />
                Editar Perfil
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">

            <aside className="w-full md:w-64 shrink-0 flex flex-col gap-1.5">
              <Link href="?aba=visao-geral" className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl font-bold text-[13.5px] transition-colors ${abaAtiva === "visao-geral" ? "bg-night text-amber" : "text-muted hover:bg-line/50 hover:text-night"}`}>
                <PackageCheck className="w-4 h-4" /> Visão Geral
              </Link>
              <Link href="?aba=produtos" className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl font-bold text-[13.5px] transition-colors ${abaAtiva === "produtos" ? "bg-night text-amber" : "text-muted hover:bg-line/50 hover:text-night"}`}>
                <Tag className="w-4 h-4" /> Meus Produtos
              </Link>
              <Link href="?aba=financeiro" className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl font-bold text-[13.5px] transition-colors ${abaAtiva === "financeiro" ? "bg-night text-amber" : "text-muted hover:bg-line/50 hover:text-night"}`}>
                <Wallet className="w-4 h-4" /> Relatórios Financeiros
              </Link>
              <Link href="/parceiro/assinatura" className="flex items-center gap-2.5 px-4 py-3.5 mt-2 rounded-xl font-bold text-[13.5px] transition-colors text-amber-dark bg-amber/10 border border-amber/30 hover:bg-amber/20">
                <Star className="w-4 h-4" /> Assinatura Premium
              </Link>
            </aside>

            <div className="grow flex flex-col gap-6">
              <Suspense fallback={
                <div className="animate-pulse bg-card h-[400px] rounded-[20px] border border-line flex items-center justify-center text-muted font-bold">
                  Carregando dados com rapidez extrema...
                </div>
              }>
                {abaAtiva === "visao-geral" && <VisaoGeral usuarioId={usuario.id} />}
                {abaAtiva === "produtos" && <MeusProdutos usuarioId={usuario.id} />}
                {abaAtiva === "financeiro" && <Financeiro usuarioId={usuario.id} periodo={periodoAtivo} />}
              </Suspense>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
