export const metadata = {
  title: 'Saideira | Resgate de Lanches e Alimentos',
  description: 'A última rodada do dia, por um preço menor. Compre excedentes perto de você.',
}

import { Suspense } from "react";
import Header from "./_components/header";
import HeroSection from "./_components/hero-section";
import ExploreLanches from "./_components/ExploreLanches";
import ResgatesDisponiveis from "./_components/ResgatesDisponiveis";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <div className="pb-10">
        <Suspense fallback={<div className="text-center py-10 text-amber-dark font-bold">Carregando categorias...</div>}>
          <ExploreLanches />
        </Suspense>
        <Suspense fallback={<div className="text-center py-10 text-amber-dark font-bold">Buscando resgates quentinhos...</div>}>
          <ResgatesDisponiveis />
        </Suspense>
      </div>
    </>
  );
}