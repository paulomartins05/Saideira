import Image from "next/image";
import Link from "next/link";
import Header from "../../pages/header";
import Container from "../../componentes/container";
import ProdutoDetalhes from "../../componentes/ProdutoDetalhes";
import GaleriaImagens from "../../componentes/GaleriaImagens";
import MapaGeolocalizacao from "../../componentes/MapaGeolocalizacao";

import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { calcularTempoPostagem } from "@/lib/utils";
import { Metadata } from "next";

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const idResolvido = (await params).id;
  
  const produto = await prisma.oferta.findUnique({
    where: { id: idResolvido },
    include: { vendedor: true },
  });

  if (!produto) {
    return {
      title: "Oferta não encontrada | Salgado Salvo",
      description: "A oferta que você procura não existe ou já expirou.",
    };
  }

  // Se tiver imagem, usa a primeira, senão usa uma imagem genérica do app
  const imagemDestaque = produto.imagemUrl && produto.imagemUrl.length > 0 
    ? produto.imagemUrl[0] 
    : "https://seusite.com.br/imagem-padrao.jpg"; // Troque pelo domínio real depois

  const precoFormatado = Number(produto.precoResgate).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return {
    title: `${produto.titulo} - ${produto.vendedor.name} | Salgado Salvo`,
    description: produto.descricao.substring(0, 150) + "...",
    openGraph: {
      title: `${produto.titulo} por apenas ${precoFormatado}!`,
      description: `Resgate agora no ${produto.vendedor.name} antes que acabe! Uma atitude sustentável e deliciosa.`,
      url: `https://seusite.com.br/resgates/${idResolvido}`,
      siteName: "Salgado Salvo",
      images: [
        {
          url: imagemDestaque,
          width: 1200,
          height: 630,
          alt: produto.titulo,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${produto.titulo} por apenas ${precoFormatado}!`,
      description: `Salve comida deliciosa de ser desperdiçada e pague menos!`,
      images: [imagemDestaque],
    },
  };
}

export default async function PaginaProdutoUnico({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders
  });
  const usuario = session?.user;

  const idResolvido = (await params).id;
  const produto = await prisma.oferta.findUnique({
    where: { id: idResolvido },
    include: { vendedor: true },
  })

  if (!produto) notFound();

  const nomeDaLoja = produto.vendedor.name || "Parceiro Salgado Salvo";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <hr className="border-line" />

      <div className="bg-night w-full py-4 shadow-inner">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
            <div className="font-display text-4xl md:text-5xl font-bold tracking-tighter text-amber drop-shadow-md">
              02:15:30
            </div>
            <div className="font-body text-sm md:text-base text-paper/80 uppercase tracking-widest font-semibold">
              Para encerrar resgates do dia
            </div>
          </div>
        </Container>
      </div>

      <main className="py-8 grow">
        <Container>
          <div className="text-sm font-body text-amber-dark mb-6 flex items-center gap-2">
            <Link href="/" className="hover:underline">Início</Link>
            <span className="text-muted">{'>'}</span>
            <Link href="/resgates" className="hover:underline">Resgates</Link>
            <span className="text-muted">{'>'}</span>
            <span className="text-night font-medium truncate">
              {produto.titulo}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
            <GaleriaImagens imagens={produto.imagemUrl || []} titulo={produto.titulo} />

            <div>
              <ProdutoDetalhes
                nome={produto.titulo}
                loja={nomeDaLoja}
                localizacao={produto.localizacao}
                descricao={produto.descricao}
                precoOriginal={Number(produto.precoOriginal)}
                precoAtual={Number(produto.precoResgate)}
                tempoPostagem={calcularTempoPostagem(produto.createdAt)}
                ofertaId={produto.id}
                usuarioId={usuario?.id}
                estoqueDisponivel={produto.quantidade}
                parceiroId={produto.vendedorId}
              />

              {produto.latitude && produto.longitude && (
                <div className="mt-8">
                  <h3 className="font-display font-bold text-xl mb-3 text-night">Local de Retirada</h3>
                  <div className="rounded-[2rem] overflow-hidden border border-line">
                    <MapaGeolocalizacao latitude={produto.latitude} longitude={produto.longitude} />
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
