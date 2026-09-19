import { prisma } from "@/lib/prisma";
import { History, PackageCheck, TrendingDown } from "lucide-react";
import { BotaoAvaliar } from "@/app/componentes/BotaoAvaliar";

export default async function HistoricoResgates({ userId }: { userId: string }) {
    const [totalResgates, historicoPedidos, todasAsOfertas] = await Promise.all([
        prisma.resgate.count({
            where: { userId: userId }
        }),
        prisma.resgate.findMany({
            where: { userId: userId },
            include: {
                oferta: { include: { vendedor: true } },
                avaliacao: true
            },
            orderBy: { createdAt: "desc" },
            take: 20
        }),
        prisma.resgate.findMany({
            where: { userId: userId },
            include: {
                oferta: { select: { precoOriginal: true, precoResgate: true } }
            }
        })
    ]);

    const valorEconomizado = todasAsOfertas.reduce((total, resgate) => {
        const economiaUnitaria = Number(resgate.oferta.precoOriginal) - Number(resgate.oferta.precoResgate);
        const economiaTotalDoPedido = economiaUnitaria * resgate.quantidade;
        return total + (isNaN(economiaTotalDoPedido) ? 0 : economiaTotalDoPedido);
    }, 0);


    return (
        <>
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
                                    <p className="text-[12px] text-muted">{resgate.oferta.vendedor?.name || "Loja Parceira"}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-[12px] font-bold uppercase tracking-wide mb-0.5 ${resgate.status === "PENDENTE" ? "text-amber-dark" : "text-green-600"}`}>
                                        {resgate.status}
                                    </p>

                                    {resgate.status === "PENDENTE" && (
                                        <div className="bg-amber/10 border border-amber/30 rounded-lg px-3 py-2 my-2 inline-block text-center">
                                            <p className="text-[10px] text-amber-dark uppercase font-bold tracking-wider mb-0.5">Código de Retirada</p>
                                            <p className="text-xl font-display font-extrabold text-night tracking-[0.2em]">{resgate.codigoPin}</p>
                                        </div>
                                    )}

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
        </>
    );
}
