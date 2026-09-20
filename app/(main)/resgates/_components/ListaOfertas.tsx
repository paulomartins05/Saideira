import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { calcularTempoPostagem } from "@/lib/utils";
import ListaResgatesClient from "@/app/componentes/ListaResgatesClient";
import Paginacao from "@/app/componentes/Paginacao";
import EmptyStateResgates from "./EmptyStateResgates";

interface ProdutoRaw {
  id: string;
  titulo: string;
  categoria: string;
  descricao: string;
  precoResgate: number;
  createdAt: Date;
  dataValidade: Date;
  imagemUrl: string[] | null;
  latitude: number | null;
  longitude: number | null;
  quantidade: number;
  vendedorName: string | null;
  assinaturaStatus: string | null;
}

export default async function ListaOfertas({
  categoriaAtiva,
  paginaAtual,
  textoDaBusca
}: {
  categoriaAtiva: string;
  paginaAtual: number;
  textoDaBusca: string;
}) {
  const itensPorPagina = 10;

  const categoriaFilter = categoriaAtiva !== "Todos"
    ? Prisma.sql`AND o.categoria = ${categoriaAtiva}`
    : Prisma.empty;

  const searchFilter = textoDaBusca
    ? Prisma.sql`AND (o.titulo ILIKE ${'%' + textoDaBusca + '%'} OR o.localizacao ILIKE ${'%' + textoDaBusca + '%'} OR o.descricao ILIKE ${'%' + textoDaBusca + '%'})`
    : Prisma.empty;

  const countRaw = await prisma.$queryRaw<{ count: bigint }[]>`
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

  const produtosDoBancoPaginados = await prisma.$queryRaw<ProdutoRaw[]>`
    SELECT 
      o.*,
      u.name as "vendedorName",
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
      tempoRestanteFormatado,
      loja: p.vendedorName || "Loja Desconhecida",
    }
  });


  return (
    <>
      <ListaResgatesClient produtos={produtosFormatados} />

      {totalPaginas > 1 && (
        <div className="mt-8">
          <Paginacao paginaAtual={paginaAtual} totalPaginas={totalPaginas} />
        </div>
      )}
    </>
  );
}
