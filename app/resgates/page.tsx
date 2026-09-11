
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
import { Prisma } from "@/generated/prisma/client";
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

  const categoriaFilter = categoriaAtiva !== "Todos"
    ? Prisma.sql`AND o.categoria = ${categoriaAtiva}`
    : Prisma.empty;

  const searchFilter = textoDaBusca
    ? Prisma.sql`AND (o.titulo ILIKE ${'%' + textoDaBusca + '%'} OR o.localizacao ILIKE ${'%' + textoDaBusca + '%'} OR o.descricao ILIKE ${'%' + textoDaBusca + '%'})`
    : Prisma.empty;

  const countRaw: any = await prisma.$queryRaw`
    SELECT COUNT(o.id) as count
    FROM "Oferta" o
    WHERE o.ativo = true 
      AND o.quantidade > 0 
      AND o."dataValidade" > NOW()
      ${categoriaFilter}
      ${searchFilter}
  `;
  const totalDeItens = Number(countRaw[0].count);
  const totalPaginas = Math.ceil(totalDeItens / itensPorPagina);

  const limit = itensPorPagina;
  const offset = (paginaAtual - 1) * itensPorPagina;

  const produtosDoBancoPaginados: any[] = await prisma.$queryRaw`
    SELECT 
      o.*,
      a.status as "assinaturaStatus"
    FROM "Oferta" o
    JOIN "User" u ON o."vendedorId" = u.id
    LEFT JOIN "Assinatura" a ON u.id = a."parceiroId"
    WHERE o.ativo = true 
      AND o.quantidade > 0 
      AND o."dataValidade" > NOW()
      ${categoriaFilter}
      ${searchFilter}
    ORDER BY
      CASE 
        WHEN o."dataValidade" <= NOW() + INTERVAL '2 hours' THEN 0
        WHEN o."dataValidade" <= NOW() + INTERVAL '6 hours' THEN 1
        WHEN o."dataValidade" <= NOW() + INTERVAL '12 hours' THEN 2
        ELSE 3
      END ASC,
      CASE 
        WHEN a.status = 'ATIVA' THEN 0
        ELSE 1
      END ASC,
      o."dataValidade" ASC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const agora = new Date().getTime();

  const produtosFormatados = produtosDoBancoPaginados.map((p) => {
    const isPremium = p.assinaturaStatus === "ATIVA";
    const tempoRestanteHoras = (new Date(p.dataValidade).getTime() - agora) / (1000 * 60 * 60);

    let faixaUrgencia = 3;
    if (tempoRestanteHoras <= 2) faixaUrgencia = 0;
    else if (tempoRestanteHoras <= 6) faixaUrgencia = 1;
    else if (tempoRestanteHoras <= 12) faixaUrgencia = 2;

    return {
      id: p.id,
      nome: p.titulo,
      categoria: p.categoria,
      descricao: p.descricao,
      preco: Number(p.precoResgate),
      tempoPostagem: calcularTempoPostagem(new Date(p.createdAt)),
      imagemUrl: p.imagemUrl?.[0] || "https://cdn-icons-png.flaticon.com/512/3225/3225091.png",
      latitude: p.latitude,
      longitude: p.longitude,
      isPremium,
      faixaUrgencia
    }
  })

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