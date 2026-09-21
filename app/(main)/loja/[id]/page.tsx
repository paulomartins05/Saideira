import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CardProduto from "@/app/componentes/CardProduto";
import { Star, MapPin, Store } from "lucide-react";
import { calcularTempoPostagem } from "@/lib/utils";
import { cache, Suspense } from "react"
import { ListaOfertasLoja } from "@/app/componentes/ListaOfertasLoja";
import { LoadingSpinner } from "@/app/componentes/LoadingSpinner";


export const revalidate = 60

interface LojaPageProps {
    params: Promise<{
        id: string
    }>;
}

const getLojaCached = cache(async (id: string) => {
    return await prisma.user.findUnique({
        where: { id: id, role: "PARCEIRO" },
        include: {
            avaliacoesRecebidas: {
                select: { nota: true }
            }
        }
    });
});



export async function generateMetadata({ params }: LojaPageProps) {
    const idResolvido = (await params).id;

    const loja = await getLojaCached(idResolvido);

    if (!loja) return { title: "Loja não encontrada | Saideira" };
    return {
        title: `${loja.name} | Saideira`,
        description: `Confira as ofertas exclusivas de ${loja.name} e ajude a combater o desperdício!`,
    }
}


export default async function LojaParceiroPage({ params }: LojaPageProps) {
    const idResolvido = (await params).id;

    const loja = await getLojaCached(idResolvido);


    if (!loja) {
        notFound()
    }

    const temAvaliacoes = loja.avaliacoesRecebidas.length > 0;
    let notaMedia = 0;
    if (loja.avaliacoesRecebidas.length > 0) {
        const somaNotas = loja.avaliacoesRecebidas.reduce((acc, aval) => acc + aval.nota, 0)
        notaMedia = somaNotas / loja.avaliacoesRecebidas.length
    }

    const partesEndereco = [loja.rua, loja.numero, loja.bairro, loja.cidade].filter(Boolean)
    const enderecoCompleto = partesEndereco.length > 0 ? partesEndereco.join(', ') : ''
    const queryMapa = encodeURIComponent(enderecoCompleto)

    return (
        <div className="min-h-screen bg-paper font-inter text-night flex flex-col">

            <main className="grow">
                <section className="bg-night text-paper pt-16 pb-20 px-6 relative border-b-4 border-amber">
                    <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">

                        <div className="w-24 h-24 rounded-2xl bg-amber text-night flex items-center justify-center font-display font-extrabold text-4xl shadow-lg border-4 border-white/10 shrink-0 overflow-hidden relative">
                            {loja.image ? (
                                <img src={loja.image} alt={`Foto de ${loja.name}`} className="w-full h-full object-cover" />
                            ) : (
                                loja.name.charAt(0).toUpperCase()
                            )}
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                                <h1 className="font-display text-4xl font-extrabold">{loja.name}</h1>

                                {temAvaliacoes ? (
                                    <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-amber font-bold text-sm backdrop-blur-sm border border-white/5">
                                        <Star className="w-4 h-4 fill-amber" />
                                        {notaMedia.toFixed(1)} ({loja.avaliacoesRecebidas.length})
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-white font-bold text-[13px] backdrop-blur-sm border border-white/5">
                                        <Star className="w-3.5 h-3.5 text-paper/80" />
                                        Novo Parceiro
                                    </div>
                                )}
                            </div>

                            <p className="text-muted/80 text-lg flex items-center justify-center md:justify-start gap-2 mb-4">
                                <Store className="w-5 h-5 text-coral" />
                                {loja.tipoNegocio || 'Parceiro Saideira'}
                            </p>
                        </div>
                    </div>
                </section>

                <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">

                    <div className="lg:col-span-2">
                        <h2 className="font-display text-2xl font-extrabold mb-8 flex items-center gap-2">
                            Ofertas Disponíveis Hoje
                        </h2>

                        <Suspense fallback={<LoadingSpinner />}>
                            <ListaOfertasLoja idLoja={idResolvido} />
                        </Suspense>

                    </div>

                    <aside>
                        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-line sticky top-24">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-night">
                                <MapPin className="w-5 h-5 text-coral" />
                                Localização
                            </h3>

                            <p className="text-muted text-sm leading-relaxed mb-6">
                                {enderecoCompleto ? enderecoCompleto : "Endereço não informado."}
                            </p>

                            {enderecoCompleto && (
                                <div className="w-full h-64 rounded-2xl overflow-hidden border border-line bg-gray-100 relative mt-4 shadow-sm">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        allowFullScreen
                                        src={`https://maps.google.com/maps?width=100%25&height=600&hl=pt-BR&q=${queryMapa}&t=&z=15&ie=UTF8&iwloc=B&output=embed`}
                                        title="Mapa de localização da loja"
                                    ></iframe>
                                </div>
                            )}
                        </div>
                    </aside>

                </div>
            </main>
        </div>
    );
}
