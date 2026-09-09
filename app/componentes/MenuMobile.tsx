"use client";

import { useState } from "react";
import NavLink from "./navLink";

export default function MenuMobile() {
  const [aberto, setAberto] = useState(false);

  const fecharMenu = () => setAberto(false);

  return (
    <div className="md:hidden">

      <button
        onClick={() => setAberto(!aberto)}
        className="flex items-center justify-center p-2 text-background-secondary focus:outline-none"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {aberto && (
        <div className="absolute top-20 left-0 w-full bg-background-primary shadow-xl flex flex-col py-6 px-8 gap-6 z-50 border-t border-laranja-destaque/20">

          <NavLink href="/" onClick={fecharMenu}>
            Início
          </NavLink>

          <NavLink href="/resgates" onClick={fecharMenu}>
            Resgates do Dia
          </NavLink>


          <NavLink href="/contato" onClick={fecharMenu}>
            Contato
          </NavLink>

        </div>
      )}
    </div>
  );
}