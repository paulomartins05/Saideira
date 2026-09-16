import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Header from "@/app/pages/header";
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache";
import { validarResgate } from "@/app/actions/resgate";
import { alterarStatusOferta } from "@/app/actions/ofertas";
import { getMetricasParceiro } from "@/app/actions/dashboard-parceiro";
import { StatsCard } from "@/app/componentes/StatsCard";
import { ChevronRight, Edit2, Wallet, PackageCheck, TrendingDown, Star, Leaf, QrCode, Tag, Plus, CheckCircle2, History, TrendingUp } from "lucide-react";

export default async function Parceiro({
  searchParams
}: {
  searchParams: Promise<{ aba?: string }>
}) {
  const params = await searchParams;
  const abaAtiva = params.aba || "visao-geral";

  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user || session.user.role != "PARCEIRO") {
    redirect("/");
  }

  const usuario = session.user;
  const metricas = await getMetricasParceiro(usuario.id);
  const ofertasDoBanco = await prisma.oferta.findMany({
    where: {
      vendedorId: usuario.id,
      quantidade: { gt: 0 },
      dataValidade: { gt: new Date() }
    },
    orderBy: { createdAt: "desc" }
  });

  const todasAsOfertas = await prisma.oferta.findMany({
    where: { vendedorId: usuario.id },
    orderBy: { createdAt: "desc" }
  });

  const pedidosPendentes = await prisma.resgate.findMany({
    where: {
      oferta: { vendedorId: usuario.id },
      status: "PENDENTE"
    },
    include: {
      user: { select: { name: true } },
      oferta: true
    },
    orderBy: { createdAt: "asc" }
  });

  const resgatesConcluidos = await prisma.resgate.findMany({
    where: {
      oferta: { vendedorId: usuario.id },
      status: "RETIRADO"
    },
    include: { oferta: true }
  });

  const saldo = resgatesConcluidos.reduce((total, resgate) => total + Number(resgate.oferta.precoResgate), 0);

  const hoje = new Date().toLocaleDateString("pt-BR");
  const resgatesHoje = resgatesConcluidos.filter(r => r.updatedAt.toLocaleDateString("pt-BR") === hoje).length;
  const impactoKg = (resgatesConcluidos.length * 0.3).toFixed(1);

  return (
    <div className="bg-paper min-h-screen flex flex-col font-inter text-night">
      <Header />

      <main className="pb-10">
        <div className="max-w-[1000px] mx-auto px-7 pt-7">
          
          <div className="mb-8">
            <div className="flex items-center gap-1.5 text-[12.5px] text-muted mb-4 flex-wrap font-medium">
              <Link href="/" className="hover:text-night transition-colors">Início</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-night font-bold">Painel do Parceiro</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-line p-6 rounded-[20px]">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-full bg-night text-amber font-display font-extrabold text-xl flex items-center justify-center border-2 border-amber">
                    {usuario.name ? usuario.name.charAt(0).toUpperCase() : "L"}
                 </div>
                 <div>
                    <h1 className="text-[22px] font-display font-extrabold tracking-[-0.01em]">
                      {usuario.name || "Minha Loja"}
                    </h1>
                    <p className="text-[13px] text-muted">Gerencie suas ofertas e resgates</p>
                 </div>
              </div>
              <Link href="/parceiro/editar" className="shrink-0 bg-line text-night font-bold text-[13px] px-5 py-2.5 rounded-lg hover:bg-line/70 transition-colors flex items-center gap-2 justify-center">
                <Edit2 className="w-4 h-4" />
                Editar Perfil
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 shrink-0 flex flex-col gap-1.5">
              <Link href="?aba=visao-geral" className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl font-bold text-[13.5px] transition-colors ${abaAtiva === "visao-geral" ? "bg-night text-amber" : "text-muted hover:bg-line/50 hover:text-night"}`}>
                <PackageCheck className="w-4 h-4" /> Visão Geral
              </Link>
              <Link href="?aba=produtos" className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl font-bold text-[13.5px] transition-colors ${abaAtiva === "produtos" ? "bg-night text-amber" : "text-muted hover:bg-line/50 hover:text-night"}`}>
                <Tag className="w-4 h-4" /> Meus Produtos
              </Link>
              <Link href="?aba=financeiro" className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl font-bold text-[13.5px] transition-colors ${abaAtiva === "financeiro" ? "bg-night text-amber" : "text-muted hover:bg-line/50 hover:text-night"}`}>
                <Wallet className="w-4 h-4" /> Relatórios Financeiros
              </Link>
              <Link href="/parceiro/assinatura" className="flex items-center gap-2.5 px-4 py-3.5 mt-2 rounded-xl font-bold text-[13.5px] transition-colors text-amber-dark bg-amber/10 border border-amber/30 hover:bg-amber/20">
                <Star className="w-4 h-4" /> Assinatura Premium
              </Link>
            </aside>

            {/* Main Content Area */}
            <div className="grow flex flex-col gap-6">

              {abaAtiva === "visao-geral" && (
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
                    
                    {/* Validador */}
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
                              <div>
                                <p className="font-bold text-[14px]">{pedido.user.name}</p>
                                <p className="text-[12px] text-muted font-medium">
                                  {pedido.oferta.titulo} • {pedido.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>

                              {pedido.bloqueadoAte && pedido.bloqueadoAte > new Date() ? (
                                <div className="bg-coral/10 text-coral px-3 py-1.5 rounded-lg border border-coral/20 text-[11px] font-bold text-center">
                                  Bloqueado.<br/>Tente em {Math.ceil((pedido.bloqueadoAte.getTime() - new Date().getTime()) / 60000)} min.
                                </div>
                              ) : (
                                <form action={async (formData) => {
                                  "use server"
                                  const resgateId = formData.get("resgateId") as string
                                  const pin = formData.get("pin") as string
                                  await validarResgate(resgateId, pin)
                                }} className="flex items-center gap-2">
                                  <input type="hidden" name="resgateId" value={pedido.id} />
                                  <input
                                    type="text"
                                    name="pin"
                                    placeholder="PIN"
                                    maxLength={4}
                                    required
                                    className="w-16 px-2 py-2 text-center border border-line rounded-lg text-sm font-bold focus:outline-none focus:border-night bg-white"
                                  />
                                  <button type="submit" className="bg-night hover:bg-night-3 text-amber font-bold py-2 px-3 rounded-lg text-[12px] transition-colors">
                                    VALIDAR
                                  </button>
                                </form>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Ofertas Ativas */}
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

                  {/* Top Ofertas (Itens Mais Resgatados) */}
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
              )}

              {abaAtiva === "produtos" && (
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
              )}

              {abaAtiva === "financeiro" && (
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
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}