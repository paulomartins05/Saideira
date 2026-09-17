import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Header from "@/app/_components/header";
import Container from "@/app/componentes/container";
import Link from "next/link";
import FormEditarLoja from "./_components/FormEditarLoja";
import FormTrocarSenha from "./_components/FormTrocarSenha";
import { Settings } from "lucide-react";

export default async function EditarPerfilParceiro() {
    const reqHeaders = await headers()
    const session = await auth.api.getSession({
        headers: reqHeaders
    })

    if (!session || session.user.role !== "PARCEIRO") {
        redirect("/")
    }

    const usuarioDB = await prisma.user.findUnique({
        where: {
            id: session.user.id
        }
    })

    if (!usuarioDB) {
        redirect("/")
    }

    return (
        <div className="min-h-screen flex flex-col font-inter text-night bg-paper">
            <Header />
            <hr className="border-line" />
            <main className="py-10 grow">
                <Container>
                    <div className="mb-8 text-center md:text-left">
                        <div className="text-[13px] text-muted mb-3 font-medium">
                            Dashboard {'>'} <span className="font-bold text-night">Configurações</span>
                        </div>
                        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-night tracking-tight flex items-center justify-center md:justify-start gap-3">
                            <Settings className="w-8 h-8 text-amber" />
                            Configurações da Loja
                        </h1>
                    </div>

                    <div className="max-w-2xl mx-auto bg-card p-6 md:p-10 rounded-[24px] shadow-sm border border-line flex flex-col gap-10">
                        <div className="flex items-center justify-between border-b border-line pb-4">
                            <h2 className="font-display text-xl font-bold text-night">Perfil da Loja</h2>
                            <Link href="/parceiro/perfil" className="text-[13px] font-bold text-muted hover:text-night transition-colors">
                                Voltar ao Painel
                            </Link>
                        </div>
                        
                        <FormEditarLoja usuario={usuarioDB} />

                        <div className="mt-6 pt-10 border-t border-line">
                            <h2 className="font-display text-xl font-bold text-coral mb-6">Alterar Senha</h2>
                            <FormTrocarSenha />
                        </div>
                    </div>
                </Container>
            </main>
        </div>
    );
}