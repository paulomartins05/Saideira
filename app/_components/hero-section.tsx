import { Search } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-night to-[#20242E] text-paper pt-9 px-7 pb-10">
      <div className="max-w-[640px] mx-auto text-center md:text-left flex flex-col md:items-start items-center">

        <p className="text-xs font-bold tracking-[0.12em] uppercase text-amber mb-2.5">
          Fim de expediente, comida de sobra
        </p>

        <h1 className="font-display text-3xl md:text-[32px] font-extrabold leading-[1.14] mb-3 text-white tracking-[-0.01em]">
          A última rodada do dia, por um preço menor
        </h1>

        <p className="text-[13.5px] text-[#B9BEC9] max-w-[440px] mb-6 leading-relaxed">
          Restaurantes, padarias, mercados e docerias perto de você com excedentes do dia.
        </p>

        <form
          action="/resgates"
          className="flex items-stretch bg-card rounded-xl overflow-hidden shadow-[0_12px_28px_-10px_rgba(0,0,0,0.4)] w-full max-w-[500px]"
        >
          <span className="flex items-center pl-4 pr-2 text-muted bg-white">
            <Search className="w-[18px] h-[18px]" />
          </span>
          <input
            type="text"
            name="busca"
            placeholder="Busque um prato, padaria ou mercado"
            aria-label="Campo de busca de lanches e locais"
            className="flex-1 min-w-0 border-none py-3.5 px-1 text-[13.5px] text-night focus:outline-none bg-white placeholder:text-muted"
          />
          <button
            type="submit"
            className="bg-amber text-night font-bold text-[13px] px-5 shrink-0 hover:bg-amber-dark transition-colors"
          >
            Buscar
          </button>
        </form>

      </div>
    </section>
  );
}