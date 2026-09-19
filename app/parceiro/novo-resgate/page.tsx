import Container from "../../componentes/container";
import Header from "../../_components/header";
import FormNovoResgate from "./_components/FormNovoResgate";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function CadastrarNovoResgate() {

  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user || session.user.role !== "PARCEIRO") {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col font-inter text-night bg-paper">
      <Header />
      <hr className="border-line" />

      <main className="py-10 grow">
        <Container>
          <div className="mb-8 text-center md:text-left">

            <div className="flex items-center justify-center md:justify-start gap-1.5 text-[12.5px] text-muted mb-4 font-medium flex-wrap">
              <Link href="/parceiro/perfil" className="hover:text-night transition-colors">Painel do Parceiro</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-bold text-night">Novo Anúncio</span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-night tracking-tight">
              Anunciar Produto
            </h1>
          </div>

          <FormNovoResgate />
        </Container>
      </main>
    </div>
  );
}
