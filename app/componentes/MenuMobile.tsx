"use client";

import { useState } from "react";
import NavLink from "./navLink";
import { Menu, X } from "lucide-react";
import { getHeaderRoutes } from "@/lib/routes";

export default function MenuMobile({ role }: { role?: string | null }) {
  const [aberto, setAberto] = useState(false);

  const fecharMenu = () => setAberto(false);

  return (
    <div className="md:hidden">

      <button
        onClick={() => setAberto(!aberto)}
        className="flex items-center justify-center p-2 text-paper hover:text-amber transition-colors focus-visible:ring-2 focus-visible:ring-amber focus-visible:outline-none rounded-md"
        aria-expanded={aberto}
        aria-label="Menu Principal"
      >
        {aberto ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
      </button>

      {aberto && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 mt-[70px]"
            onClick={fecharMenu}
            aria-hidden="true"
          />
          <div className="absolute top-[70px] left-0 w-full bg-night shadow-2xl flex flex-col py-6 px-8 gap-6 z-50 border-t border-line/10 animate-in slide-in-from-top-2 duration-200">
            {getHeaderRoutes(role).map((rota) => (
              <NavLink key={rota.path} href={rota.path} onClick={fecharMenu}>
                {rota.label}
              </NavLink>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
