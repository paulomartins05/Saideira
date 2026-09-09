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
    where: {
      id: idResolvido,
    },

    include: {
      vendedor: true,
    },


  })

  if (!produto) {
    notFound()
  }

  const imagemOficial = produto.imagemUrl?.[0] || "https://cdn-icons-png.flaticon.com/512/3225/3225091.png"

  const nomeDaLoja = produto.vendedor.name || "Parceiro Salgado Salvo";


  return (
    <div className="bg-[#F6EFE5] min-h-screen flex flex-col">
      <Header />
      <hr className="opacity-10 border-background-secondary" />

      <main className="py-8 grow">
        <Container>

          <div className="text-sm font-inter text-[#B87042] mb-6 flex items-center gap-2">
            <Link href="/" className="hover:underline">Início</Link>
            <span>{'>'}</span>
            <Link href="/resgates" className="hover:underline">Resgates</Link>
            <span>{'>'}</span>
            <span className="text-background-secondary font-medium truncate">
              {produto.titulo}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

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
              />

              {produto.latitude && produto.longitude && (
                <div className="mt-8">
                  <h3 className="font-bold text-lg mb-2">Local de Retirada</h3>
                  <MapaGeolocalizacao latitude={produto.latitude} longitude={produto.longitude} />
                </div>
              )}
            </div>

          </div>

        </Container>
      </main>
    </div>
  );
}