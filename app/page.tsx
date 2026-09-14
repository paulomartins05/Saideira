import Header from "./pages/header";
import HeroSection from "./pages/hero-section";
import ExploreLanches from "./pages/ExploreLanches";
import ResgatesDisponiveis from "./pages/ResgatesDisponiveis";

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