import { prisma } from "@/lib/prisma";
import { ShoppingBag, Leaf, Store } from "lucide-react";
import CardImpacto from "@/app/componentes/CardImpacto";

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

                <section className="py-24 px-6 bg-[#f3efe8]">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="font-display text-3xl font-bold text-night mb-8">Por que existimos</h2>
                        <p className="text-night/70 text-[17px] leading-relaxed mb-16 max-w-3xl mx-auto">
                            O Brasil desperdiça cerca de 46 milhões de toneladas de comida por ano — quase 30% 
                            de tudo que produzimos — enquanto milhões de pessoas enfrentam insegurança 
                            alimentar. Boa parte desse desperdício acontece bem perto de você: na padaria, no 
                            restaurante, no mercado do seu bairro, todos os dias, no fim do expediente. A Saideira 
                            existe pra fechar essa distância — não com doação, mas com um negócio que faz 
                            sentido pros dois lados: o estabelecimento recupera parte do que perderia, e você 
                            come bem gastando menos.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center px-4">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-night text-amber font-bold flex items-center justify-center mb-6">1</div>
                                <h3 className="font-bold text-night text-[17px] mb-3">Negócios publicam o excedente</h3>
                                <p className="text-night/60 text-[15px] leading-relaxed">No fim do dia, restaurantes, padarias<br/>e mercados publicam o que sobrou<br/>com desconto.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-night text-amber font-bold flex items-center justify-center mb-6">2</div>
                                <h3 className="font-bold text-night text-[17px] mb-3">Você resgata perto de você</h3>
                                <p className="text-night/60 text-[15px] leading-relaxed">Busca o que está disponível agora,<br/>ordenado pelo que está prestes a<br/>acabar.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-night text-amber font-bold flex items-center justify-center mb-6">3</div>
                                <h3 className="font-bold text-night text-[17px] mb-3">Retira com um código</h3>
                                <p className="text-night/60 text-[15px] leading-relaxed">Mostra o código na loja e pronto —<br/>um prato a menos no lixo.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 px-6 border-t border-night/5 bg-[#f3efe8]">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="font-display text-[26px] font-bold text-night mb-3">Tem um negócio de alimentação?</h2>
                        <p className="text-night/60 mb-8 text-[17px]">
                            Cadastre sua loja e comece a recuperar receita do que hoje vira desperdício.
                        </p>
                        <a href="/login" className="inline-block bg-amber hover:bg-amber-dark text-night font-bold px-8 py-3 rounded-lg transition-colors">
                            Cadastrar meu negócio
                        </a>
                    </div>
                </section>

            </main>
        </div>
    );
}
