"use client";

import { useState, useEffect } from "react";
import NavLink from "./NavLink";
import { Menu, X } from "lucide-react";
import BotaoLogout from "@/app/componentes/BotaoLogout";

interface MenuMobileProps {
  rotas: Array<{ label: string; path: string }>;
  usuario?: any;
}

export default function MenuMobile({ rotas, usuario }: MenuMobileProps) {
  const [aberto, setAberto] = useState(false);
  const fecharMenu = () => setAberto(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && aberto) fecharMenu();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [aberto]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setAberto(!aberto)}
        className="flex items-center justify-center p-2 text-paper hover:text-amber transition-colors focus-visible:ring-2 focus-visible:ring-amber focus-visible:outline-none rounded-md"
        aria-expanded={aberto}
        aria-label="Menu Mobile"
      >
        {aberto ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
      </button>

      {aberto && (
        <div className="absolute left-0 top-full mt-2 w-full">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={fecharMenu}
            aria-hidden="true"
          />
          <nav aria-label="Menu mobile" className="absolute left-0 w-full bg-night shadow-2xl flex flex-col py-6 px-8 gap-6 z-50 border-t border-line/10 animate-in slide-in-from-top-2 duration-200">
            {rotas.map((rota) => (
              <NavLink key={rota.path} href={rota.path} variant="mobile" onClick={fecharMenu}>
                {rota.label}
              </NavLink>
            ))}

            <NavLink href="/sobre-nos" variant="mobile" onClick={fecharMenu}>
              Sobre Nós
            </NavLink>

            {usuario ? (
              <BotaoLogout className="block w-full py-2 text-[24px] font-display font-extrabold text-coral hover:text-red-500 transition-colors text-left">
                Sair da Conta
              </BotaoLogout>
            ) : (
              <NavLink href="/login" variant="mobile" onClick={fecharMenu}>
                Entrar
              </NavLink>
            )}
          </nav>

        </div>
      )}
    </div>
  );
}
