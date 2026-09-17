import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Header from "@/app/_components/header";
import Container from "@/app/componentes/container";
import Link from "next/link";
import FormEditarConsumidor from "./_components/FormEditarConsumidor";
import FormTrocarSenha from "@/app/parceiro/editar/_components/FormTrocarSenha"; // <-- Reaproveitando código (DRY)!

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

                        <div className="flex items-center justify-between mb-8 border-b border-line pb-4">
                            <h1 className="text-2xl font-display font-bold text-night">Editar Perfil</h1>
                            <Link href="/perfil" className="text-sm font-bold text-muted hover:text-night transition-colors">
                                Voltar
                            </Link>
                        </div>

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
