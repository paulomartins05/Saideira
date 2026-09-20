import { prisma } from "@/lib/prisma";
import { getMetricasParceiro } from "@/app/actions/dashboard-parceiro";
import { StatsCard } from "@/app/componentes/StatsCard";
import { Leaf, QrCode, Tag, CheckCircle2, Star, Plus, TrendingUp, PackageCheck } from "lucide-react";
import Link from "next/link";
import { alterarStatusOferta } from "@/app/actions/ofertas";
import FormValidarResgate from "./FormValidarResgate";


export default async function VisãoGeral({ usuarioId }: { usuarioId: string }) {

    const metricas = await getMetricasParceiro(usuarioId);

    const ofertasDoBanco = await prisma.oferta.findMany({
        where: {
            vendedorId: usuarioId,
            quantidade: { gt: 0 },
            dataValidade: { gt: new Date() }
        },
        orderBy: { createdAt: "desc" }
    })

    const pedidosPendentes = await prisma.resgate.findMany({
        where: {
            oferta: {
                vendedorId: usuarioId,
                dataValidade: { gt: new Date() }
            },
            status: "PENDENTE"
        },
        include: {
            user: { select: { name: true } },
            oferta: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const impactoKg = (metricas.vendasNoMes * 0.3).toFixed(1);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatsCard
                    titulo="Vendas no Mês"
                    valor={metricas.vendasNoMes}
                    subtitulo="Itens retirados neste mês"
                    icone={PackageCheck}
                />
                <StatsCard
                    titulo="Receita no Mês"
                    valor={`R$ ${metricas.receitaNoMes.toFixed(2).replace('.', ',')}`}
                    subtitulo="Ganhos gerados este mês"
                    icone={TrendingUp}
                />
                <div className="bg-card p-6 rounded-[20px] border border-line flex flex-col justify-center text-center">
                    <p className="text-[12.5px] font-bold uppercase tracking-widest text-muted mb-2 flex items-center justify-center gap-1.5">
                        <Leaf className="w-4 h-4 text-green-600" /> Desperdício Evitado
                    </p>
                    <p className="font-display font-extrabold text-[28px] text-night mt-auto">{impactoKg} <span className="text-lg">kg</span></p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                <div className="bg-card p-6 rounded-[20px] border border-line flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                        <QrCode className="w-5 h-5 text-night" />
                        <h2 className="font-display font-extrabold text-[20px]">Validar Resgates</h2>
                    </div>
                    <p className="text-[13px] text-muted mb-6">Clientes aguardando retirada hoje.</p>
                    <div className="flex flex-col gap-3">
                        {pedidosPendentes.length === 0 ? (
                            <div className="text-center py-8 bg-paper rounded-xl border border-line border-dashed">
                                <CheckCircle2 className="w-8 h-8 text-muted mx-auto mb-2" />
                                <p className="text-[13px] text-muted font-medium">Nenhum cliente na fila.</p>
                            </div>
                        ) : (
                            pedidosPendentes.map(pedido => (
                                <div key={pedido.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-paper rounded-xl border border-line">
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-[14px] truncate">{pedido.user.name}</p>
                                        <p className="text-[12px] text-muted font-medium truncate">
                                            {pedido.oferta.titulo} • {pedido.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    {pedido.bloqueadoAte && pedido.bloqueadoAte > new Date() ? (
                                        <div className="bg-coral/10 text-coral px-3 py-1.5 rounded-lg border border-coral/20 text-[11px] font-bold text-center shrink-0">
                                            Bloqueado.<br />Tente em {Math.ceil((pedido.bloqueadoAte.getTime() - new Date().getTime()) / 60000)} min.
                                        </div>
                                    ) : (
                                        <div className="shrink-0">
                                            <FormValidarResgate resgateId={pedido.id} />
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="bg-card p-6 rounded-[20px] border border-line flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <Tag className="w-5 h-5 text-night" />
                            <h2 className="font-display font-extrabold text-[20px]">Ofertas Ativas</h2>
                        </div>
                        <Link href="/parceiro/novo-resgate" className="bg-night hover:bg-night-3 text-amber py-1.5 px-3 rounded-lg text-[12px] font-bold transition-colors flex items-center gap-1">
                            <Plus className="w-3.5 h-3.5" /> Novo
                        </Link>
                    </div>
                    <p className="text-[13px] text-muted mb-6">Controle em tempo real do seu estoque.</p>
                    <div className="flex flex-col gap-3 overflow-y-auto max-h-[400px] pr-1">
                        {ofertasDoBanco.length === 0 ? (
                            <div className="text-center py-8 bg-paper rounded-xl border border-line border-dashed">
                                <p className="text-[13px] text-muted font-medium">Nenhuma oferta ativa no momento.</p>
                            </div>
                        ) : (
                            ofertasDoBanco.map(oferta => (
                                <div key={oferta.id} className="flex items-center justify-between p-3.5 bg-paper border border-line rounded-xl">
                                    <div>
                                        <p className="font-bold text-[13.5px] text-night">
                                            {oferta.titulo}
                                            {!oferta.ativo && <span className="ml-2 text-[10px] text-coral uppercase tracking-widest font-bold">Inativo</span>}
                                        </p>
                                        <p className="text-[12px] text-night font-bold mt-0.5">
                                            R$ {Number(oferta.precoResgate).toFixed(2).replace('.', ',')}
                                        </p>
                                    </div>
                                    <form action={async () => {
                                        "use server";
                                        await alterarStatusOferta(oferta.id, !oferta.ativo);
                                    }}>
                                        <button
                                            type="submit"
                                            className={`py-1.5 px-3 text-[11px] font-bold uppercase tracking-wider rounded-lg border transition-colors ${oferta.ativo
                                                ? "border-night text-night hover:bg-night hover:text-paper"
                                                : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                                                }`}
                                        >
                                            {oferta.ativo ? "Inativar" : "Ativar"}
                                        </button>
                                    </form>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <div className="bg-card p-6 rounded-[20px] border border-line flex flex-col mt-6">
                <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-amber-500" />
                    <h2 className="font-display font-extrabold text-[20px]">Itens Mais Resgatados (Mês Atual)</h2>
                </div>
                <div className="flex flex-col gap-3">
                    {metricas.topOfertas.length === 0 ? (
                        <div className="text-center py-6 bg-paper rounded-xl border border-line border-dashed">
                            <p className="text-[13px] text-muted font-medium">Nenhum item resgatado ainda.</p>
                        </div>
                    ) : (
                        metricas.topOfertas.map((oferta) => (
                            <div key={oferta.id} className="flex justify-between items-center bg-paper p-4 rounded-xl border border-line">
                                <div>
                                    <p className="font-bold text-[14px] text-night">{oferta.titulo}</p>
                                    <p className="text-[12px] text-muted mt-0.5">{oferta.categoria}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-display font-bold text-[18px] text-amber-dark leading-none mb-1">{oferta._count.resgates}</p>
                                    <p className="text-[10px] uppercase font-bold text-muted tracking-widest leading-none">Resgates</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
