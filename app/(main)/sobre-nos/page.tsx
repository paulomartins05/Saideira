import { prisma } from "@/lib/prisma";
import { ShoppingBag, Leaf, Store } from "lucide-react";
import CardImpacto from "@/app/componentes/CardImpacto";
import Footer from "@/app/_components/footer";

export const revalidate = 3600

export const metadata = {
    title: "Sobre Nós",
    description: "Conheça o Saideira: salvando alimentos deliciosos do desperdício e conectando você a lojas locais sustentáveis.",
}

export default async function SobreNos() {

    const [parceirosAtivos, comprasSalvas, resgatesRetiradosComOferta] = await Promise.all([

        prisma.user.count({
            where: {
                role: "PARCEIRO"
            }
        }),
        prisma.resgate.count({
            where: {
                status: 'RETIRADO'
            }
        }),
        prisma.resgate.findMany({
            where: { status: "RETIRADO" },
            select: {
                quantidade: true,
                oferta: {
                    select: { peso: true }
                }
            }
        })
    ])


    const quilosSalvos = resgatesRetiradosComOferta.reduce((total, resgate) => {
        const pesoDaOferta = resgate.oferta.peso || 0.3;
        return total + (pesoDaOferta * resgate.quantidade);
    }, 0);

    return (
        <div className="min-h-screen bg-paper font-inter text-night flex flex-col">

            <main className="grow">
                <section className="bg-night text-paper pt-24 pb-32 px-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-amber/10 blur-[80px]" />
                        <div className="absolute top-[60%] -left-[10%] w-[400px] h-[400px] rounded-full bg-coral/10 blur-[80px]" />
                    </div>

                    <div className="max-w-[1160px] mx-auto relative z-10 text-center">
                        <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-amber text-[13px] font-bold tracking-widest uppercase mb-6 backdrop-blur-md border border-white/5">
                            Nossa Missão
                        </span>
                        <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                            Transformando desperdício em <br className="hidden md:block" />
                            <span className="text-amber">oportunidade.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted/90 max-w-2xl mx-auto font-medium leading-relaxed">
                            O Saideira nasceu para conectar pessoas e estabelecimentos, salvando alimentos deliciosos e criando uma rede de consumo mais consciente, acessível e sustentável.
                        </p>
                    </div>
                </section>

                <section className="py-20 px-6 -mt-16 z-20 relative">
                    <div className="max-w-[1160px] mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <CardImpacto
                                icone={<ShoppingBag className="w-8 h-8" />}
                                valor={comprasSalvas}
                                titulo="Resgates Realizados"
                                descricao="Refeições e produtos excelentes que ganharam um destino feliz."
                                corFundoIcone="bg-amber/20"
                                corTextoIcone="text-amber-dark"
                            />
                            <CardImpacto
                                icone={<Leaf className="w-8 h-8" />}
                                valor={`${quilosSalvos.toFixed(1)} Kg`}
                                titulo="Comida Salva"
                                descricao="Alimentos de alta qualidade que deixaram de ir para o lixo."
                                corFundoIcone="bg-green-100"
                                corTextoIcone="text-green-600"
                            />
                            <CardImpacto
                                icone={<Store className="w-8 h-8" />}
                                valor={parceirosAtivos}
                                titulo="Lojas Parceiras"
                                descricao="Estabelecimentos engajados na nossa causa sustentável."
                                corFundoIcone="bg-coral/10"
                                corTextoIcone="text-coral"
                            />
                        </div>

                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
