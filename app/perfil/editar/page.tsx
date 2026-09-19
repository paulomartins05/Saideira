import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Header from "@/app/_components/header";
import Container from "@/app/componentes/container";
import Link from "next/link";
import FormEditarConsumidor from "./_components/FormEditarConsumidor";
import FormTrocarSenha from "@/app/parceiro/editar/_components/FormTrocarSenha";
import { ChevronRight } from "lucide-react";

export default async function EditarPerfil() {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });

    if (!session) {
        redirect('/login');
    }

    const usuarioDB = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!usuarioDB) {
        redirect('/login');
    }

    return (
        <div className="bg-paper min-h-screen flex flex-col font-inter text-night">
            <Header />
            <hr className="border-line" />
            <main className="py-8 grow">
                <Container>
                    <div className="max-w-xl mx-auto bg-card p-8 rounded-2xl shadow-sm border border-line">

                        <div className="flex items-center gap-1.5 text-[12.5px] text-muted mb-6 flex-wrap font-medium">
                            <Link href="/perfil" className="hover:text-night transition-colors">Minha Conta</Link>
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span className="text-night font-bold">Editar Perfil</span>
                        </div>
                        <h1 className="text-2xl font-display font-bold text-night mb-8 border-b border-line pb-4">
                            Configurações da Conta
                        </h1>

                        <FormEditarConsumidor usuario={usuarioDB} />

                        <div className="mt-10 pt-8 border-t border-line">
                            <h2 className="text-xl font-display font-bold mb-6 text-coral">Alterar Senha</h2>

                            <FormTrocarSenha />
                        </div>

                    </div>
                </Container>
            </main>
        </div>
    );
}
