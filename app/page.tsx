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
        <ExploreLanches />
        <ResgatesDisponiveis />
      </div>
    </>
  );
}