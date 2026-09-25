import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Container from "@/app/componentes/container";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import FormOferta from "@/app/componentes/FormOferta";
import { ChevronRight } from "lucide-react";
import SubmitButton from "@/app/componentes/SubmitButton";

export default async function EditarProduto({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const reqHeaders = await headers()
    const session = await auth.api.getSession({ headers: reqHeaders })

    if (!session || session.user.role !== "PARCEIRO") redirect("/")

    const id = (await params).id;

    const oferta = await prisma.oferta.findUnique({ where: { id } });

    if (!oferta || oferta.vendedorId !== session.user.id) {
        redirect("/parceiro/perfil?aba=produtos");
    }

    return (
        <div className="min-h-screen flex flex-col font-inter text-night bg-paper">
            <hr className="border-line" />
            <main className="py-10 grow">
                <Container>
                    <div className="mb-8 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-1.5 text-[12.5px] text-muted mb-4 font-medium flex-wrap">
                            <Link href="/parceiro/perfil" className="hover:text-night transition-colors">Painel do Parceiro</Link>
                            <ChevronRight className="w-3.5 h-3.5" />
                            <Link href="/parceiro/perfil?aba=produtos" className="hover:text-night transition-colors">Meus Produtos</Link>
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span className="font-bold text-night">Editar</span>
                        </div>
                        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-night tracking-tight">
                            Editar Oferta
                        </h1>
                    </div>

                    <div className="flex flex-col gap-10">

                        <FormOferta ofertaInicial={oferta} />

                        <div className="max-w-3xl mx-auto w-full p-6 rounded-[20px] border border-coral/30 bg-[#FFF5F5] relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-display font-bold text-lg text-coral mb-2">Perigo</h3>
                                <p className="text-[13px] text-night/80 mb-5 font-medium leading-relaxed">Ao excluir esta oferta, ela será permanentemente removida. Resgates já gerados continuarão válidos. Esta ação é irreversível.</p>
                                <form action={async () => {
                                    "use server";
                                    const { excluirOferta } = await import("@/app/actions/ofertas");
                                    await excluirOferta(oferta.id);
                                }}>
                                    <SubmitButton className="w-full bg-coral hover:bg-[#d64a38] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-[13.5px]">
                                        Excluir Oferta
                                    </SubmitButton>
                                </form>
                            </div>
                        </div>
                    </div>
                </Container>
            </main>
        </div>
    );
}
