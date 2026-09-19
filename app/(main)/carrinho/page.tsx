import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { Ticket } from "@/app/componentes/ui/Ticket";
import { ChevronRight, ShoppingBag } from "lucide-react";
import { Suspense } from "react";
import { TicketSkeleton } from "@/app/_components/skeletons";

async function ListaResgates({ userId, abaAtiva }: { userId: string, abaAtiva: string }) {
    const whereClause: Prisma.ResgateWhereInput = abaAtiva === "historico"
        ? { userId, status: { in: ["RETIRADO", "EXPIRADO", "CANCELADO"] } }
        : { userId, status: "PENDENTE" };

    const meusResgates = await prisma.resgate.findMany({
        where: whereClause,
        include: {
            oferta: {
                include: { vendedor: true }
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        ...(abaAtiva === "historico" ? { take: 15 } : {})
    })

    if (meusResgates.length === 0) {
        return (
            <div className="bg-card border border-line p-10 rounded-[20px] text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-line rounded-full flex items-center justify-center text-muted mb-4">
                    <ShoppingBag className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold mb-2">Sem resgates {abaAtiva === "historico" ? "no histórico" : "pendentes"}</h2>
                <p className="text-sm text-muted mb-6">
                    {abaAtiva === "historico" ? "Você não tem nenhum resgate concluído ou expirado." : "Você ainda não reservou nenhum produto recentemente."}
                </p>
                {abaAtiva === "pendentes" && (
                    <Link href="/" className="bg-night text-amber font-bold text-[13px] px-6 py-2.5 rounded-lg hover:bg-night-3 transition-colors">
                        Ver ofertas disponíveis
                    </Link>
                )}
            </div>
        );
    }
    return (
        <div className="flex flex-col">
            {meusResgates.map((resgate) => (
                <Ticket
                    key={resgate.id}
                    id={resgate.id}
                    titulo={resgate.oferta.titulo}
                    loja={resgate.oferta.vendedor?.name || "Loja Parceira"}
                    codigoPin={resgate.codigoPin}
                    status={resgate.status}
                    imageUrl={resgate.oferta.imagemUrl?.[0]}
                    endereco={resgate.oferta.vendedor?.rua ? `${resgate.oferta.vendedor.rua}, ${resgate.oferta.vendedor.numero}` : undefined}
                    bairro={resgate.oferta.vendedor?.bairro || undefined}
                    dataValidade={resgate.oferta.dataValidade}
                    telefone={resgate.oferta.vendedor?.telefone || undefined}
                />
            ))}
        </div>
    );
}


export default async function CarrinhoPage({
    searchParams
}: {
    searchParams: Promise<{ tab?: string }>
}) {
    const params = await searchParams;
    const abaAtiva = params.tab === "historico" ? "historico" : "pendentes";

    const reqHeaders = await headers()
    const session = await auth.api.getSession({
        headers: reqHeaders
    })

    if (!session?.user || session.user.role != "CONSUMIDOR") {
        redirect("/")
    }

    return (
        <div className="bg-paper min-h-screen flex flex-col font-inter text-night">
            <main className="pb-10">
                <div className="max-w-[800px] mx-auto px-7 pt-7">
                    <div className="flex items-center gap-1.5 text-[12.5px] text-muted mb-6 flex-wrap font-medium">
                        <Link href="/" className="hover:text-night transition-colors">Início</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-night font-bold">Meus Resgates</span>
                    </div>
                    <h1 className="font-display font-extrabold text-[28px] mb-2 tracking-[-0.01em]">Meus Resgates</h1>
                    <p className="text-[13.5px] text-muted mb-6">Acompanhe seus pedidos e apresente o código no estabelecimento.</p>

                    <div className="flex border-b border-line mb-6">
                        <Link href="/carrinho?tab=pendentes" className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${abaAtiva === 'pendentes' ? 'border-night text-night' : 'border-transparent text-muted hover:text-night'}`}>
                            Pendentes
                        </Link>
                        <Link href="/carrinho?tab=historico" className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${abaAtiva === 'historico' ? 'border-night text-night' : 'border-transparent text-muted hover:text-night'}`}>
                            Histórico
                        </Link>
                    </div>

                    <Suspense key={abaAtiva} fallback={
                        <div className="flex flex-col">
                            <TicketSkeleton />
                            <TicketSkeleton />
                        </div>
                    }>
                        <ListaResgates userId={session.user.id} abaAtiva={abaAtiva} />
                    </Suspense>

                </div>
            </main>
        </div>
    );
}