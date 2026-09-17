import Link from "next/link";
import Header from "../_components/header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ChevronRight, Edit2 } from "lucide-react";
import { Suspense } from "react";
import HistoricoResgates from "./_components/HistoricoResgates";
import { SkeletonHistorico } from "./_components/SkeletonHistorico";

export default async function PerfilPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  const usuario = session?.user;

  if (!usuario) {
    redirect("/login");
  }

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

          <Suspense fallback={<SkeletonHistorico />}>
            <HistoricoResgates userId={usuario.id} />
          </Suspense>

        </div>
      </main>
    </div>
  )
}
