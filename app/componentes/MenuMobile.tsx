"use client";

import { useState } from "react";
import NavLink from "./navLink";
import { Menu, X } from "lucide-react";

export default function MenuMobile({ role }: { role?: string | null }) {
  const [aberto, setAberto] = useState(false);

  const fecharMenu = () => setAberto(false);

  return (
    <div className="md:hidden">

      <button
        onClick={() => setAberto(!aberto)}
        className="flex items-center justify-center p-2 text-paper focus:outline-none hover:text-amber transition-colors"
      >
        {aberto ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
      </button>

      {aberto && (
        <div className="absolute top-[70px] left-0 w-full bg-night shadow-2xl flex flex-col py-6 px-8 gap-6 z-50 border-t border-line/10">

          <NavLink href="/" onClick={fecharMenu}>
            Início
          </NavLink>

          <NavLink href="/resgates" onClick={fecharMenu}>
            Ofertas
          </NavLink>

          {role === "PARCEIRO" ? (
            <NavLink href="/parceiro" onClick={fecharMenu}>
              Painel do Parceiro
            </NavLink>
          ) : (
            <NavLink href="/contato" onClick={fecharMenu}>
              Vender excedente
            </NavLink>
          )}

        </div>
      )}
    </div>
  );
}
