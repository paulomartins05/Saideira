"use client"

import { useState } from "react"
import Link from "next/link"
import BotaoLogout from "./BotaoLogout"
import { authClient } from "@/lib/auth-client"
import { User } from "lucide-react"

type MenuUsuarioProps = {
  usuario: typeof authClient.$Infer.Session.user
}

export default function MenuUsuario({ usuario }: MenuUsuarioProps) {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <div className="relative">

      <button
        onClick={() => setMenuAberto(!menuAberto)}
        className="w-10 h-10 rounded-full border-2 border-line overflow-hidden flex items-center justify-center bg-card hover:opacity-80 transition-opacity"
        title="Menu da Conta"
      >
        {usuario.image ? (
          <img src={usuario.image} alt="Perfil" className="w-full h-full object-cover" />
        ) : (
          <span className="text-night flex items-center justify-center bg-line w-full h-full">
            <User className="w-5 h-5 text-muted" />
          </span>
        )}
      </button>

      {menuAberto && (
        <div className="absolute right-0 mt-3 w-56 bg-card border border-line rounded-2xl shadow-xl p-3 flex flex-col gap-2 z-50">

          <div className="px-2 pb-3 border-b border-line mb-1">
            <p className="text-[14px] font-bold truncate text-night">{usuario.name || "Usuário"}</p>
            <p className="text-[12px] text-muted truncate">{usuario.email}</p>
          </div>

          <Link
            href={usuario.role === "PARCEIRO" ? "/parceiro/perfil" : "/perfil"}
            onClick={() => setMenuAberto(false)}
            className="block w-full px-3 py-2.5 text-[13.5px] text-night hover:bg-line/30 rounded-xl transition-colors font-bold text-center"
          >
            Meu Perfil
          </Link>

          <div onClick={() => setMenuAberto(false)}>
            <BotaoLogout />
          </div>

        </div>
      )}

    </div>
  );
}
