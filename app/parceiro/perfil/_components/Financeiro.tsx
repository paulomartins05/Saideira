import { prisma } from "@/lib/prisma";
import { Wallet, History } from "lucide-react";

export default async function Financeiro({ usuarioId }: { usuarioId: string }) {
    const resgatesConcluidos = await prisma.resgate.findMany({
        where: {
            oferta: { vendedorId: usuarioId },
            status: "RETIRADO"
        },
        include: { oferta: true }
    });

    const saldo = resgatesConcluidos.reduce((total, resgate) => total + Number(resgate.oferta.precoResgate), 0);

    return (
        <div className="bg-card p-6 md:p-8 rounded-[20px] border border-line flex flex-col">
            <div className="mb-8">
                <h2 className="font-display font-extrabold text-[22px] mb-1">Relatórios Financeiros</h2>
                <p className="text-[13.5px] text-muted">Acompanhe seus ganhos e histórico de vendas.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <div className="bg-amber/10 p-6 rounded-[16px] border border-amber/30">
                    <p className="text-[12px] uppercase tracking-widest font-bold text-amber-dark mb-1">Saldo Disponível</p>
                    <p className="font-display font-extrabold text-[32px] text-night">
                        R$ {saldo.toFixed(2).replace('.', ',')}
                    </p>
                </div>

                <div className="bg-paper p-6 rounded-[16px] border border-line flex flex-col justify-center items-start">
                    <p className="text-[13px] font-bold text-night mb-3">Deseja receber seu dinheiro?</p>
                    <button className="bg-night hover:bg-night-3 text-amber font-bold py-2.5 px-5 text-[13px] rounded-lg w-full sm:w-auto transition-colors">
                        Solicitar Saque
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-4 border-b border-line pb-3">
                <History className="w-5 h-5 text-muted" />
                <h3 className="font-display font-extrabold text-lg">Histórico de Transações</h3>
            </div>

            <div className="flex flex-col gap-3">
                {resgatesConcluidos.length === 0 ? (
                    <p className="text-[13.5px] text-center text-muted py-8">Você ainda não possui transações finalizadas.</p>
                ) : (
                    resgatesConcluidos
                        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                        .map(resgate => (
                            <div key={resgate.id} className="flex items-center justify-between p-4 border border-line rounded-[12px] bg-paper">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                        <Wallet className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[13.5px] text-night">{resgate.oferta.titulo}</p>
                                        <p className="text-[11.5px] text-muted font-medium mt-0.5">
                                            {resgate.updatedAt.toLocaleDateString('pt-BR')} às {resgate.updatedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-bold text-green-600 text-[14px]">
                                    + R$ {Number(resgate.oferta.precoResgate).toFixed(2).replace('.', ',')}
                                </p>
                            </div>
                        ))
                )}
            </div>
        </div>
    );
}
