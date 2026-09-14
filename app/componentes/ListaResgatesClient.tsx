"use client";
import { useState } from "react";
import { OfertaCard } from "./ui/OfertaCard";
import Link from "next/link";
import { ViewToggle } from "./ui/ViewToggle";

export type ProdutoPropsComLocal = {
  id: string,
  nome: string,
  categoria?: string,
  descricao: string,
  preco: number,
  tempoPostagem: string,
  imagemUrl: string,
  latitude?: number | null,
  longitude?: number | null,
  isPremium?: boolean,
  faixaUrgencia?: number,
  tempoRestanteFormatado: string,
};

function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function ListaResgatesClient({ produtos }: { produtos: ProdutoPropsComLocal[] }) {
  const [view, setView] = useState<'lista' | 'mapa'>('lista');

  // Mantemos a lógica de localização para uso futuro no mapa
  const [localizacaoUser, setLocalizacaoUser] = useState<{ lat: number, lon: number } | null>(null);

  const produtosOrdenados = [...produtos].map(p => {
    if (localizacaoUser && p.latitude && p.longitude) {
      const dist = calcularDistancia(localizacaoUser.lat, localizacaoUser.lon, p.latitude, p.longitude);
      return { ...p, distancia: dist };
    }
    return p;
  });

  return (
    <>
      <div className="flex justify-between items-end gap-4 flex-wrap mb-5">
        <div>
          <h1 className="font-display text-[25px] font-extrabold m-0 mb-1.5 tracking-[-0.01em]">Ofertas perto de você</h1>
          <p className="text-[13.5px] text-muted m-0 max-w-[520px]">{produtos.length} ofertas ativas agora</p>
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {view === 'mapa' ? (
        <div className="bg-[#EDE7D6] rounded-xl relative border border-line overflow-hidden w-full aspect-[16/10] md:aspect-[21/9] flex items-center justify-center">
          <p className="text-muted font-bold text-sm bg-white/80 px-4 py-2 rounded-lg">Mapa interativo será renderizado aqui</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
          {produtosOrdenados.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted font-semibold text-sm bg-card border border-line rounded-xl">
              Nenhum resgate disponível nessa categoria.
            </div>
          ) : (
            produtosOrdenados.map((produto) => (
              <Link href={`/resgates/${produto.id}`} key={produto.id}>
                <OfertaCard 
                  loja="Loja Parceira" 
                  titulo={produto.nome}
                  precoAntigo={`R$ ${(produto.preco * 2).toFixed(2).replace('.', ',')}`}
                  precoNovo={`R$ ${produto.preco.toFixed(2).replace('.', ',')}`}
                  tempoRestante={produto.tempoRestanteFormatado}
                  isPremium={produto.isPremium}
                />
              </Link>
            ))
          )}
        </div>
      )}
    </>
  );
}
