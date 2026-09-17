import Image from "next/image";
import Link from "next/link";
import Header from "../../_components/header";
import Container from "../../componentes/container";
import ProdutoDetalhes from "../../componentes/ProdutoDetalhes";
import GaleriaImagens from "../../componentes/GaleriaImagens";
import MapaGeolocalizacao from "../../componentes/MapaGeolocalizacao";
import CountdownValidade from "../_components/CountdownValidade";

import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { calcularTempoPostagem, calcularDistancia } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const idResolvido = (await params).id;
  const produto = await prisma.oferta.findUnique({
    where: { id: idResolvido },
    select: { titulo: true }
  });

  return {
    title: produto ? `${produto.titulo} | Saideira` : "Resgate não encontrado",
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
      <Header />
      <hr className="border-line" />

      <div className="bg-night w-full py-4 shadow-inner">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
            <div className="font-display text-4xl md:text-5xl font-bold tracking-tighter text-amber drop-shadow-md">
              <CountdownValidade validade={produto.dataValidade} />
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
                parceiroId={produto.vendedorId}
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
