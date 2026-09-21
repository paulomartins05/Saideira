import { prisma } from "@/lib/prisma";
import CardProduto from "@/app/componentes/CardProduto";
import { calcularTempoPostagem } from "@/lib/utils";

export async function ListaOfertasLoja({ idLoja }: { idLoja: string }) {

    const ofertas = await prisma.oferta.findMany({
        where: {
            vendedorId: idLoja,
            ativo: true,
            quantidade: { gt: 0 },
            dataValidade: { gt: new Date() }
        },
        orderBy: { createdAt: 'desc' }
    });

    if (ofertas.length === 0) {
        return (
            <div className="bg-white p-10 rounded-3xl text-center border border-line shadow-sm">
                <p className="text-muted text-lg">Poxa, todos os produtos dessa loja já foram resgatados hoje!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {ofertas.map((oferta) => (
                <CardProduto
                    key={oferta.id}
                    id={oferta.id}
                    nome={oferta.titulo}
                    descricao={oferta.descricao}
                    preco={oferta.precoResgate}
                    tempoPostagem={calcularTempoPostagem(oferta.createdAt)}
                    imagemUrl={oferta.imagemUrl.length > 0 ? oferta.imagemUrl[0] : ""}
                    quantidade={oferta.quantidade}
                />
            ))}
        </div>
    );
}
