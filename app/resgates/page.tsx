
import { Suspense } from "react";
import Container from "../componentes/container";
import Link from "next/link";
import Header from "../pages/header";
import Text from "../componentes/text";
import CardProduto from "../componentes/CardProduto";
import FiltroCategorias from "../componentes/FiltroCategorias";
import Paginacao from "../componentes/Paginacao";
import ListaResgatesClient from "../componentes/ListaResgatesClient";
import { calcularTempoPostagem } from "@/lib/utils";
import { prisma } from "@/lib/prisma"




export default async function PaginaTodosResgates({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; pagina?: string; busca?: string }>
}) {

  const params = await searchParams
  const categoriaAtiva = params.categoria || "Todos"
  const paginaAtual = Number(params.pagina) || 1
  const textoDaBusca = params.busca || ""
  const itensPorPagina = 10

  let filtroDoBanco: any = {
    ativo: true, 
    quantidade: { gt: 0 }, 
    dataValidade: { gt: new Date() }
  }

  if (categoriaAtiva !== "Todos") {
    filtroDoBanco.categoria = categoriaAtiva
  }

  if (textoDaBusca) {
    filtroDoBanco.OR = [
      { titulo: { contains: textoDaBusca, mode: 'insensitive' } },
      { localizacao: { contains: textoDaBusca, mode: 'insensitive' } },
      { descricao: { contains: textoDaBusca, mode: 'insensitive' } }
    ]
  }

  const totalDeItens = await prisma.oferta.count({
    where: filtroDoBanco
  })

  const totalPaginas = Math.ceil(totalDeItens / itensPorPagina)

  const produtosDoBanco = await prisma.oferta.findMany({
    where: filtroDoBanco,
    skip: (paginaAtual - 1) * itensPorPagina,
    take: itensPorPagina,
    orderBy: { createdAt: "desc" }
  })

  const produtosFormatados = produtosDoBanco.map((p) => ({
    id: p.id,
    nome: p.titulo,
    categoria: p.categoria,
    descricao: p.descricao,
    preco: Number(p.precoResgate),
    tempoPostagem: calcularTempoPostagem(p.createdAt),
    imagemUrl: p.imagemUrl?.[0] || "https://cdn-icons-png.flaticon.com/512/3225/3225091.png",
    latitude: p.latitude,
    longitude: p.longitude,
  }))

  return (
    <div className="bg-[#F6EFE5] min-h-screen flex flex-col">
      <Header />
      <hr className="opacity-10 border-background-secondary" />

      <main className="py-8 grow">
        <Container>
          <div className="text-sm font-inter text-[#B87042] mb-6 flex items-center gap-2">
            <Link href="/" className="hover:underline cursor-pointer">Início</Link>
            <span>{'>'}</span>
            <span className="text-background-secondary font-medium">Todos os Resgates</span>
          </div>

          <div className="mb-8">
            <Text variant="playfair" as="h1" className="text-4xl md:text-5xl text-background-secondary font-bold mb-3">
              Todos os Resgates Disponíveis
            </Text>
            <p className="font-inter text-background-secondary opacity-90 text-sm md:text-base max-w-3xl">
              Lanches fresquinhos prontos para serem salvos.
            </p>
          </div>

          <Suspense fallback={<div className="py-12 text-center">Carregando resgates quentinhos...</div>}>

            <FiltroCategorias
              categoriaAtiva={categoriaAtiva}
            />

            <ListaResgatesClient produtos={produtosFormatados} />

            <Paginacao
              paginaAtual={paginaAtual}
              totalPaginas={totalPaginas}
            />

          </Suspense>

        </Container>
      </main>
    </div>
  );
}