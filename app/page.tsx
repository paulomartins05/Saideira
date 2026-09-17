export const metadata = {
  title: 'Saideira | Resgate de Lanches e Alimentos',
  description: 'A última rodada do dia, por um preço menor. Compre excedentes perto de você.',
}

import { Suspense } from "react";
import Header from "./_components/header";
import HeroSection from "./_components/hero-section";
import ExploreLanches from "./_components/ExploreLanches";
import ResgatesDisponiveis from "./_components/ResgatesDisponiveis";

import { CategoriasSkeleton, ResgatesSkeleton } from "./_components/skeletons";

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <div className="pb-10">

        <Suspense fallback={<CategoriasSkeleton />}>
          <ExploreLanches />
        </Suspense>

        <Suspense fallback={
          <div className="max-w-[1160px] mx-auto px-7">
            <h2 className="font-display text-[21px] font-extrabold m-0 tracking-[-0.01em] flex items-center gap-2">
              Buscando <span className="text-amber-dark animate-pulse">ofertas...</span>
            </h2>
            <ResgatesSkeleton />
          </div>
        }>
          <ResgatesDisponiveis />
        </Suspense>

      </div>
    </>
  );
}