"use client";
import { useState } from "react";
import CardProduto, { ProdutoProps } from "./CardProduto";
import Button from "./button";

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

export type ProdutoPropsComLocal = ProdutoProps & {
  latitude?: number | null,
  longitude?: number | null,
  faixaUrgencia?: number
};

export default function ListaResgatesClient({ produtos }: { produtos: ProdutoPropsComLocal[] }) {
  const [localizacaoUser, setLocalizacaoUser] = useState<{ lat: number, lon: number } | null>(null);
  const [carregandoLocal, setCarregandoLocal] = useState(false);

  const pegarLocalizacao = () => {
    setCarregandoLocal(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (posicao) => {
          setLocalizacaoUser({
            lat: posicao.coords.latitude,
            lon: posicao.coords.longitude
          });
          setCarregandoLocal(false);
        },
        (erro) => {
          console.error(erro);
          alert("Não conseguimos acessar sua localização.");
          setCarregandoLocal(false);
        }
      );
    } else {
      alert("Navegador não suporta geolocalização.");
      setCarregandoLocal(false);
    }
  };

  const produtosOrdenados = [...produtos].map(p => {
    if (localizacaoUser && p.latitude && p.longitude) {
      const dist = calcularDistancia(localizacaoUser.lat, localizacaoUser.lon, p.latitude, p.longitude);
      return { ...p, distancia: dist };
    }
    return p;
  });

  if (localizacaoUser) {
    produtosOrdenados.sort((a, b) => {
      if (a.faixaUrgencia !== undefined && b.faixaUrgencia !== undefined && a.faixaUrgencia !== b.faixaUrgencia) {
        return a.faixaUrgencia - b.faixaUrgencia;
      }

      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;

      if (a.distancia !== undefined && b.distancia !== undefined) return a.distancia - b.distancia;
      return 0;
    });
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button
          variant="outline"
          className="border-[#D9774A] text-[#D9774A] hover:bg-[#D9774A] hover:text-white"
          onClick={pegarLocalizacao}
          disabled={carregandoLocal || !!localizacaoUser}
        >
          {localizacaoUser ? "📍 Localização Ativada" : carregandoLocal ? "Buscando..." : "📍 Usar Minha Localização"}
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {produtosOrdenados.length === 0 ? (
          <div className="col-span-full py-12 text-center text-background-secondary font-inter">
            Nenhum resgate disponível.
          </div>
        ) : (
          produtosOrdenados.map((produto) => (
            <CardProduto key={produto.id} {...produto} />
          ))
        )}
      </div>
    </>
  );
}
