import { Suspense } from "react";
import Container from "../componentes/container";
import Link from "next/link";
import Header from "../pages/header";
import FiltroCategorias from "../componentes/FiltroCategorias";
import Paginacao from "../componentes/Paginacao";
import ListaResgatesClient from "../componentes/ListaResgatesClient";
import { calcularTempoPostagem } from "@/lib/utils";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma"
import { ChevronRight } from "lucide-react";

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    const diffMs = new Date(p.dataValidade).getTime() - agora;
    const diffMins = Math.max(1, Math.floor(diffMs / 60000));
    const tempoRestanteFormatado = diffMins > 60 
      ? `${Math.floor(diffMins / 60)}h ${diffMins % 60}m` 
      : `${diffMins} min`;

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
      faixaUrgencia,
      tempoRestanteFormatado
    }
  })

  return (
    <>
      <Header />

      <main className="pb-10">
        <div className="max-w-[1160px] mx-auto px-7 pt-7">
          
          <div className="flex items-center gap-1.5 text-[12.5px] text-muted mb-3.5 flex-wrap font-medium">
            <Link href="/" className="hover:text-night transition-colors">Início</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-night font-bold">Ofertas</span>
          </div>

          <Suspense fallback={<div className="py-12 text-center text-sm font-semibold text-muted">Carregando ofertas quentinhas...</div>}>

            <FiltroCategorias
              categoriaAtiva={categoriaAtiva}
            />

            <ListaResgatesClient produtos={produtosFormatados} />

            <div className="mt-8">
              <Paginacao
                paginaAtual={paginaAtual}
                totalPaginas={totalPaginas}
              />
            </div>

          </Suspense>

        </div>
      </main>
    </>
  );
}