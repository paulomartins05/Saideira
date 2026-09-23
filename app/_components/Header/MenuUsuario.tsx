"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import BotaoLogout from "@/app/componentes/BotaoLogout";
import { authClient } from "@/lib/auth-client";
import { User } from "lucide-react";

type MenuUsuarioProps = {
  usuario: typeof authClient.$Infer.Session.user;
};

export default function MenuUsuario({ usuario }: MenuUsuarioProps) {
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuAberto) setMenuAberto(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuAberto]);

  return (
    <div className="relative">
      <button
        onClick={() => setMenuAberto(!menuAberto)}
        className="relative w-10 h-10 rounded-full border-2 border-line overflow-hidden flex items-center justify-center bg-card hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-amber focus-visible:outline-none"
        title="Menu da Conta"
        aria-haspopup="true"
        aria-expanded={menuAberto}
      >
        {usuario.image ? (
          <Image
            src={usuario.image}
            alt={`Foto de perfil de ${usuario.name}`}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-night flex items-center justify-center bg-line w-full h-full">
            <User className="w-5 h-5 text-muted" />
          </span>
        )}
      </button>

      {menuAberto && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuAberto(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-3 w-56 bg-card border border-line rounded-2xl shadow-xl p-3 flex flex-col gap-2 z-50 animate-in slide-in-from-top-2 duration-200">
            <div className="px-2 pb-3 border-b border-line mb-1">
              <p className="text-[14px] font-bold truncate text-night">{usuario.name || "Usuário"}</p>
              <p className="text-[12px] text-muted truncate">{usuario.email}</p>
            </div>

            {usuario.role === "PARCEIRO" ? (
              <Link
                href={`/loja/${usuario.id}`}
                onClick={() => setMenuAberto(false)}
                className="block w-full px-3 py-2.5 text-[13.5px] text-night hover:bg-line/30 rounded-xl transition-colors font-bold text-center"
              >
                Minha Loja
              </Link>
            ) : (
              <Link
                href="/perfil"
                onClick={() => setMenuAberto(false)}
                className="block w-full px-3 py-2.5 text-[13.5px] text-night hover:bg-line/30 rounded-xl transition-colors font-bold text-center"
              >
                Meu Perfil
              </Link>
            )}

            <Link
              href="/sobre-nos"
              onClick={() => setMenuAberto(false)}
              className="block w-full px-3 py-2.5 text-[13.5px] text-night hover:bg-line/30 rounded-xl transition-colors font-bold text-center"
            >
              Sobre Nós
            </Link>

            <div onClick={() => setMenuAberto(false)}>
              <BotaoLogout />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
