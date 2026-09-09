"use client"

import { useState } from "react"
import Link from "next/link"
import BotaoLogout from "./BotaoLogout"
import { authClient } from "@/lib/auth-client"


type MenuUsuarioProps = {
  usuario: typeof authClient.$Infer.Session.user
}

export default function MenuUsuario({
  usuario
}: MenuUsuarioProps) {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <div className="relative">

      <button
        onClick={() => setMenuAberto(!menuAberto)}
        className="w-10 h-10 rounded-full border-2 border-background-secondary overflow-hidden flex items-center justify-center bg-white hover:opacity-80 transition-opacity"
        title="Menu da Conta"
      >
        {usuario.image ? (
          <img src={usuario.image} alt="Perfil" className="w-full h-full object-cover" />
        ) : (
          <span className="font-bold text-background-secondary uppercase text-lg">
            {usuario.name ? usuario.name.charAt(0) : "👤"}
          </span>
        )}
      </button>

      {menuAberto && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg p-3 flex flex-col gap-2 z-50">

          <div className="px-2 pb-2 border-b border-gray-100 mb-1">
            <p className="text-sm font-bold truncate text-background-secondary">{usuario.name}</p>
            <p className="text-xs opacity-70 truncate text-background-secondary">{usuario.email}</p>
          </div>

          <Link
            href={usuario.role === "PARCEIRO" ? "/parceiro/perfil" : "/perfil"}
            onClick={() => setMenuAberto(false)}
            className="block w-full px-3 py-2 text-sm text-background-secondary hover:bg-[#fdf3ef] rounded-lg transition-colors font-medium text-center"
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