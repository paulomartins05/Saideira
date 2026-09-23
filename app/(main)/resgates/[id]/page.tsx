import Link from "next/link";
import Container from "@/app/componentes/container";
import ProdutoDetalhes from "@/app/componentes/ProdutoDetalhes";
import GaleriaImagens from "@/app/componentes/GaleriaImagens";
import MapaGeolocalizacao from "@/app/componentes/MapaGeolocalizacao";
import CountdownValidade from "../_components/CountdownValidade";

import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { calcularTempoPostagem, calcularDistancia } from "@/lib/utils";
import { cache } from "react";

const getProdutoCached = cache(async (id: string) => {
  return await prisma.oferta.findUnique({
    where: { id },
    include: { vendedor: true },
  });
});
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const idResolvido = (await params).id;

  const produto = await getProdutoCached(idResolvido);
  if (!produto) {
    return { title: "Resgate não encontrado | Saideira" };
  }
  const fotoOpenGraph = produto.imagemUrl?.[0] || "";
  return {
    title: `${produto.titulo} | Saideira`,
    description: `Resgate ${produto.titulo} por apenas R$ ${Number(produto.precoResgate).toFixed(2).replace('.', ',')} no app Saideira! Salve comida deliciosa e economize.`,
    openGraph: {
      title: `${produto.titulo} | Saideira`,
      description: `Resgate este produto no app Saideira e evite o desperdício alimentar!`,
      images: fotoOpenGraph ? [{ url: fotoOpenGraph }] : [],
    }
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

  const produto = await getProdutoCached(idResolvido);
  if (!produto) notFound();
  const nomeDaLoja = produto.vendedor.name || "Parceiro Salgado Salvo";
  let userLat = null;
  let userLon = null;
  if (usuario?.id) {
    const dbUser = await prisma.user.findUnique({ where: { id: usuario.id } });
    userLat = dbUser?.latitude;
    userLon = dbUser?.longitude;
  }
  let distanciaFormatada = null;
  if (userLat && userLon && produto.latitude && produto.longitude) {
    const distKm = calcularDistancia(userLat, userLon, produto.latitude, produto.longitude);
    if (distKm < 1) {
      distanciaFormatada = `${Math.round(distKm * 1000)}m`;
    } else {
      distanciaFormatada = `${distKm.toFixed(1).replace('.', ',')}km`;
    }
  }
  return (
    <div className="min-h-screen flex flex-col">
      <hr className="border-line" />

      <div className="bg-night w-full py-4 shadow-inner">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
            <div className="font-display text-4xl md:text-5xl font-bold tracking-tighter text-amber drop-shadow-md">
              <CountdownValidade validade={produto.dataValidade} />
            </div>
            {produto.dataValidade > new Date() && (
              <div className="font-body text-sm md:text-base text-paper/80 uppercase tracking-widest font-semibold">
                Para encerrar resgates do dia
              </div>
            )}
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
                parceiroId={produto.vendedorId}
                nome={produto.titulo}
                loja={nomeDaLoja}
                imagemParceiro={produto.vendedor.image}
                localizacao={produto.localizacao}
                descricao={produto.descricao}
                precoOriginal={Number(produto.precoOriginal)}
                precoAtual={Number(produto.precoResgate)}
                tempoPostagem={calcularTempoPostagem(produto.createdAt)}
                ofertaId={produto.id}
                usuarioId={usuario?.id}
                estoqueDisponivel={produto.quantidade}
                distanciaFormatada={distanciaFormatada}
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
