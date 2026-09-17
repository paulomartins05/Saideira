import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit2 } from "lucide-react";

export default async function MeusProdutos({ usuarioId }: { usuarioId: string }) {
    const todasAsOfertas = await prisma.oferta.findMany({
        where: { vendedorId: usuarioId },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="bg-card p-6 md:p-8 rounded-[20px] border border-line flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h2 className="font-display font-extrabold text-[22px]">Meus Produtos</h2>
                <Link href="/parceiro/novo-resgate" className="bg-night hover:bg-night-3 text-amber py-2 px-4 rounded-lg text-[13px] font-bold transition-colors flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> Novo Produto
                </Link>
            </div>

            <div className="flex flex-col gap-4">
                {todasAsOfertas.length === 0 ? (
                    <p className="text-[13.5px] text-center text-muted py-8">Você ainda não cadastrou produtos.</p>
                ) : (
                    todasAsOfertas.map(oferta => (
                        <div key={oferta.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-line rounded-[16px] bg-paper">
                            <div>
                                <p className="font-bold text-[15px] mb-1">
                                    {oferta.titulo}
                                    {!oferta.ativo && <span className="ml-2 px-2 py-0.5 rounded-full bg-coral/10 text-coral text-[10px] uppercase tracking-widest font-bold">Inativo</span>}
                                    {oferta.quantidade === 0 && <span className="ml-2 px-2 py-0.5 rounded-full bg-line text-muted text-[10px] uppercase tracking-widest font-bold">Esgotado</span>}
                                    {new Date() > new Date(oferta.dataValidade) && (
                                        <span className="ml-2 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] uppercase tracking-widest font-bold">Expirado</span>
                                    )}
                                </p>
                                <p className="text-[12.5px] text-muted mb-2 font-medium">{oferta.categoria}</p>
                                <p className="text-[13px] text-night font-bold">
                                    R$ {Number(oferta.precoResgate).toFixed(2).replace('.', ',')} • <span className="text-muted font-medium">{oferta.quantidade} disponíveis</span>
                                </p>
                            </div>

                            <Link href={`/parceiro/editar-produto/${oferta.id}`} className="mt-4 sm:mt-0">
                                <button className="border border-line bg-white text-night hover:bg-line/50 font-bold py-2 px-5 text-[12.5px] rounded-lg w-full sm:w-auto transition-colors flex items-center justify-center gap-2">
                                    <Edit2 className="w-3.5 h-3.5" /> Editar
                                </button>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
