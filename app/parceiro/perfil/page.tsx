
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Header from "@/app/pages/header";
import Container from "@/app/componentes/container";
import Button from "@/app/componentes/button";
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache";
import { validarResgate } from "@/app/actions/resgate";
import { alterarStatusOferta } from "@/app/actions/ofertas";



export default async function Parceiro({
  searchParams
}: {
  searchParams: Promise<{ aba?: string }>
}) {
  const params = await searchParams
  const abaAtiva = params.aba || "visao-geral"

  const reqHeaders = await headers()
  const session = await auth.api.getSession({
    headers: reqHeaders
  })

  if (!session?.user || session.user.role != "PARCEIRO") {
    redirect("/")
  }

  const usuario = session.user
  const ofertasDoBanco = await prisma.oferta.findMany({
    where: {
      vendedorId: usuario.id,
      quantidade: { gt: 0 },
      dataValidade: { gt: new Date() }
    },

    orderBy: {
      createdAt: "desc"
    }
  })

  const todasAsOfertas = await prisma.oferta.findMany({
    where: {
      vendedorId: usuario.id,
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const pedidosPendentes = await prisma.resgate.findMany({
    where: {
      oferta: {
        vendedorId: usuario.id
      },
      status: "PENDENTE"
    },

    include: {
      user: { select: { name: true } },
      oferta: true
    },
    orderBy: { createdAt: "asc" }
  })

  const resgatesConcluidos = await prisma.resgate.findMany({
    where: {
      oferta: {
        vendedorId: usuario.id
      },
      status: "RETIRADO"
    },
    include: {
      oferta: true
    }
  })

  const saldo = resgatesConcluidos.reduce((total, resgate) => total + Number(resgate.oferta.precoResgate), 0)

  const hoje = new Date().toLocaleDateString("pt-BR")
  const resgatesHoje = resgatesConcluidos.filter(r => r.updatedAt.toLocaleDateString("pt-BR") === hoje).length
  const impactoKg = (resgatesConcluidos.length * 0.3).toFixed(1)
  return (
    <div className="bg-[#F6EFE5] min-h-screen flex flex-col font-inter text-background-secondary">
      <Header />
      <hr className="opacity-10 border-background-secondary" />

      <main className="py-8 grow">
        <Container>

          <div className="mb-8">
            <div className="text-sm text-[#B87042] mb-4 flex items-center gap-2">
              <Link href="/" className="hover:underline">Início</Link>
              <span>{'>'}</span>
              <span className="font-medium">Área do Parceiro</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-3xl md:text-4xl font-playfair font-bold">
                Painel do Parceiro: {usuario.name || "Minha Loja"}
              </h1>
              <Link href="/parceiro/editar">
                <Button variant="outline" className="border-[#D9774A] text-[#D9774A] hover:bg-[#D9774A] hover:text-white">
                  ✏️ Editar Perfil da Loja
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">

            <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2">
              <Link href="?aba=visao-geral" className={`block px-4 py-3 rounded-xl font-medium transition-colors ${abaAtiva === "visao-geral" ? "bg-[#e8d5c4] text-background-secondary" : "hover:bg-[#fdf3ef]"}`}>Visão Geral</Link>
              <Link href="?aba=produtos" className={`block px-4 py-3 rounded-xl font-medium transition-colors ${abaAtiva === "produtos" ? "bg-[#e8d5c4] text-background-secondary" : "hover:bg-[#fdf3ef]"}`}>Meus Produtos</Link>
              <Link href="?aba=financeiro" className={`block px-4 py-3 rounded-xl font-medium transition-colors ${abaAtiva === "financeiro" ? "bg-[#e8d5c4] text-background-secondary" : "hover:bg-[#fdf3ef]"}`}>Relatórios Financeiros</Link>
              <Link href="/parceiro/assinatura" className={`block px-4 py-3 mt-2 rounded-xl font-medium transition-colors text-[#D9774A] border border-[#D9774A]/30 hover:bg-[#D9774A]/10`}>⭐ Assinatura Premium</Link>
            </aside>

            <div className="grow flex flex-col gap-6">

              {abaAtiva === "visao-geral" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <p className="text-sm font-medium opacity-80 mb-2">Saldo a Receber</p>
                      <p className="text-3xl font-bold text-[#6B705C]">R$ {saldo.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <p className="text-sm font-medium opacity-80 mb-2">Resgates Hoje</p>
                      <p className="text-3xl font-bold text-laranja-destaque">{resgatesHoje}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <p className="text-sm font-medium opacity-80 mb-2 flex items-center justify-between">
                        Alimento Salvo (Kg) <span className="text-[#6B705C]">🌱</span>
                      </p>
                      <p className="text-3xl font-bold text-[#6B705C]">{impactoKg} kg</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                      <h2 className="text-xl font-bold mb-1">Validar Resgates Pendentes</h2>
                      <p className="text-sm opacity-70 mb-6">Clientes aguardando retirada hoje.</p>

                      <div className="flex flex-col gap-4">
                        {pedidosPendentes.length === 0 ? (
                          <p className="text-sm text-center opacity-70 py-4">Nenhum cliente na fila.</p>
                        ) : (
                          pedidosPendentes.map(pedido => (
                            <div key={pedido.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                              <div>
                                <p className="font-bold text-sm">{pedido.user.name}</p>
                                <p className="text-xs opacity-80">
                                  {pedido.oferta.titulo} • {pedido.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>

                              {pedido.bloqueadoAte && pedido.bloqueadoAte > new Date() ? (
                                <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-bold text-center">
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
                                    className="w-16 px-2 py-1.5 text-center border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-laranja-destaque"
                                  />
                                  <Button type="submit" className="bg-[#D9774A] hover:bg-[#c4683e] text-white py-1.5 px-3 text-xs h-auto">
                                    VALIDAR
                                  </Button>
                                </form>
                              )}

                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                      <div className="flex items-center justify-between mb-1">
                        <h2 className="text-xl font-bold">Ofertas Ativas</h2>
                        <Link href="/parceiro/novo-resgate">
                          <Button className="bg-[#D9774A] hover:bg-[#c4683e] text-white py-1 px-3 text-xs h-auto">
                            + Novo
                          </Button>
                        </Link>
                      </div>
                      <p className="text-sm opacity-70 mb-6">Controle em tempo real de estoque.</p>

                      <div className="flex flex-col gap-4 max-h-75 overflow-y-auto pr-2">
                        {ofertasDoBanco.length === 0 ? (
                          <p className="text-sm text-center opacity-70 py-4">Nenhuma oferta ativa no momento.</p>
                        ) : (
                          ofertasDoBanco.map(oferta => (
                            <div key={oferta.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0">
                              <div>
                                <p className="font-bold text-sm">
                                  {oferta.titulo}
                                  {!oferta.ativo && <span className="ml-2 text-xs text-red-500 font-normal">(Inativo)</span>}
                                </p>
                                <p className="text-xs text-[#6B705C] font-semibold">
                                  R$ {Number(oferta.precoResgate).toFixed(2).replace('.', ',')}
                                </p>
                              </div>
                              <form action={async () => {
                                "use server";
                                await alterarStatusOferta(oferta.id, !oferta.ativo);
                              }}>
                                <Button
                                  type="submit"
                                  variant="outline"
                                  className={`py-1 px-3 text-xs h-auto border ${oferta.ativo
                                    ? "border-laranja-destaque text-laranja-destaque hover:bg-laranja-destaque hover:text-white"
                                    : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                                    }`}
                                >
                                  {oferta.ativo ? "INATIVAR" : "ATIVAR"}
                                </Button>
                              </form>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>
                </>
              )}

              {abaAtiva === "produtos" && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Todos os Meus Produtos</h2>
                    <Link href="/parceiro/novo-resgate">
                      <Button className="bg-[#D9774A] hover:bg-[#c4683e] text-white py-1 px-3 text-xs h-auto">
                        + Novo Produto
                      </Button>
                    </Link>
                  </div>

                  <div className="flex flex-col gap-4">
                    {todasAsOfertas.length === 0 ? (
                      <p className="text-sm text-center opacity-70 py-4">Você ainda não cadastrou produtos.</p>
                    ) : (
                      todasAsOfertas.map(oferta => (
                        <div key={oferta.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
                          <div>
                            <p className="font-bold text-base">
                              {oferta.titulo}
                              {!oferta.ativo && <span className="ml-2 text-xs text-red-500 font-normal">(Inativo)</span>}
                              {oferta.quantidade === 0 && <span className="ml-2 text-xs text-gray-500 font-normal">(Esgotado)</span>}

                              {new Date() > new Date(oferta.dataValidade) && (
                                <span className="ml-2 text-xs text-red-500 font-normal">(EXPIRADO)</span>
                              )

                              }

                            </p>
                            <p className="text-sm opacity-70 mb-1">{oferta.categoria}</p>
                            <p className="text-sm text-[#6B705C] font-semibold">
                              R$ {Number(oferta.precoResgate).toFixed(2).replace('.', ',')} • {oferta.quantidade} disponíveis
                            </p>
                          </div>

                          <Link href={`/parceiro/editar-produto/${oferta.id}`} className="mt-3 sm:mt-0">
                            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-1.5 px-4 text-xs h-auto w-full sm:w-auto">
                              ✏️ EDITAR
                            </Button>
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {abaAtiva === "financeiro" && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold">Relatórios Financeiros</h2>
                    <p className="text-sm opacity-70">Acompanhe seus ganhos e histórico de vendas.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-[#fdf3ef] p-6 rounded-xl border border-[#e8d5c4]">
                      <p className="text-sm font-medium text-[#B87042] mb-1">Saldo Disponível</p>
                      <p className="text-3xl font-bold text-background-secondary">
                        R$ {saldo.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col justify-center items-start">
                       <p className="text-sm font-medium opacity-80 mb-2">Deseja receber seu dinheiro?</p>
                       <Button className="bg-[#D9774A] hover:bg-[#c4683e] text-white py-2 px-4 text-sm w-full sm:w-auto">
                         💸 Solicitar Saque
                       </Button>
                    </div>
                  </div>

                  <h3 className="font-bold mb-4">Histórico de Transações</h3>
                  
                  <div className="flex flex-col gap-3">
                    {resgatesConcluidos.length === 0 ? (
                      <p className="text-sm text-center opacity-70 py-6 bg-gray-50 rounded-xl">Você ainda não possui transações finalizadas.</p>
                    ) : (
                      resgatesConcluidos
                        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                        .map(resgate => (
                        <div key={resgate.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                              💰
                            </div>
                            <div>
                              <p className="font-bold text-sm">{resgate.oferta.titulo}</p>
                              <p className="text-xs opacity-70">
                                {resgate.updatedAt.toLocaleDateString('pt-BR')} às {resgate.updatedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                          <p className="font-bold text-green-600">
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
        </Container>
      </main>
    </div>
  );
}