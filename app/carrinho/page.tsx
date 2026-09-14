import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import Header from "../pages/header";
import { Ticket } from "../componentes/ui/Ticket";
import { ChevronRight, ShoppingBag } from "lucide-react";

export default async function carrinhoPage() {

    const reqHeaders = await headers()
    const session = await auth.api.getSession({
        headers: reqHeaders
    })

    if (!session?.user || session.user.role != "CONSUMIDOR") {
        redirect("/")
    }

    const meusResgates = await prisma.resgate.findMany({
        where: {
            userId: session.user.id,
            status: "PENDENTE"
        },
        include: {
            oferta: {
                include: { vendedor: true }
            }
        },
        orderBy: {
            createdAt: "desc",
        }
    })

    return (
        <div className="bg-paper min-h-screen flex flex-col font-inter text-night">
            <Header />
            
            <main className="pb-10">
                <div className="max-w-[800px] mx-auto px-7 pt-7">
                    
                    <div className="flex items-center gap-1.5 text-[12.5px] text-muted mb-6 flex-wrap font-medium">
                        <Link href="/" className="hover:text-night transition-colors">Início</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-night font-bold">Meus Resgates</span>
                    </div>

                    <h1 className="font-display font-extrabold text-[28px] mb-2 tracking-[-0.01em]">Meus Resgates</h1>
                    <p className="text-[13.5px] text-muted mb-8">Apresente o código no estabelecimento para retirar.</p>

                    {meusResgates.length === 0 ? (
                        <div className="bg-card border border-line p-10 rounded-[20px] text-center flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-line rounded-full flex items-center justify-center text-muted mb-4">
                                <ShoppingBag className="w-8 h-8" />
                            </div>
                            <h2 className="text-lg font-bold mb-2">Seu carrinho está vazio</h2>
                            <p className="text-sm text-muted mb-6">Você ainda não reservou nenhum produto.</p>
                            <Link href="/resgates" className="bg-night text-amber font-bold text-[13px] px-6 py-2.5 rounded-lg hover:bg-night-3 transition-colors">
                                Ver ofertas disponíveis
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {meusResgates.map((resgate) => (
                                <Ticket 
                                    key={resgate.id}
                                    titulo={resgate.oferta.titulo}
                                    loja={resgate.oferta.vendedor?.name || "Loja Parceira"}
                                    codigoPin={resgate.codigoPin}
                                    status={resgate.status}
                                    imageUrl={resgate.oferta.imagemUrl?.[0]}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

