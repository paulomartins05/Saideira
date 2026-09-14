"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { User, ShoppingCart } from "lucide-react";
import MenuMobile from "../componentes/MenuMobile";
import MenuUsuario from "../componentes/menu-usuario";
import { authClient } from "@/lib/auth-client";
import { getCartCount } from "../actions/resgate";

export default function Header() {
  const { data: session } = authClient.useSession();
  const usuario = session?.user;
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (usuario) {
      getCartCount().then(setCartCount).catch(console.error);
    } else {
      setCartCount(0);
    }
  }, [usuario, pathname]); // Re-fetch se trocar de página ou logar

  // Função para estilo do link ativo
  const getNavClass = (path: string) => {
    const isActive = pathname === path || (path !== "/" && pathname?.startsWith(path));
    return isActive 
      ? "text-[13.5px] font-semibold text-amber py-1 border-b-2 border-amber" 
      : "text-[13.5px] font-semibold text-[#C6CAD3] py-1 border-b-2 border-transparent hover:text-white transition-colors";
  };

  return (
    <header className="w-full bg-night text-paper relative z-50">
      <div className="max-w-[1160px] mx-auto py-4 px-7 flex items-center justify-between gap-5">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-display font-extrabold text-[19px] text-white">
          <span className="w-8 h-8 rounded-lg bg-amber text-night flex items-center justify-center font-display font-extrabold text-base">
            S
          </span>
          Saidera
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className={getNavClass("/")}>
            Início
          </Link>
          <Link href="/resgates" className={getNavClass("/resgates")}>
            Ofertas
          </Link>
          {usuario?.role === "PARCEIRO" ? (
            <Link href="/parceiro" className={getNavClass("/parceiro")}>
              Painel do Parceiro
            </Link>
          ) : (
            <Link href="/contato" className={getNavClass("/contato")}>
              Vender excedente
            </Link>
          )}
          {usuario?.role !== "PARCEIRO" && (
            <Link href="/contato" className={getNavClass("/contato")}>
              Contato
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <div className="hidden md:block">
            {usuario ? (
              <MenuUsuario usuario={usuario} />
            ) : (
              <Link 
                href="/login" 
                className="w-9 h-9 rounded-full bg-transparent border-[1.5px] border-paper/30 text-paper flex items-center justify-center hover:bg-paper/10 transition-colors" 
                aria-label="Conta"
              >
                <User className="w-[18px] h-[18px]" />
              </Link>
            )}
          </div>

          <Link 
            href="/carrinho" 
            className="w-9 h-9 rounded-full bg-amber text-night flex items-center justify-center relative hover:bg-amber-dark transition-colors" 
            aria-label="Resgates"
          >
            <ShoppingCart className="w-[18px] h-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -top-[3px] -right-[3px] bg-coral text-white text-[9.5px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-[1.5px] border-night">
                {cartCount}
              </span>
            )}
          </Link>

          <MenuMobile />
        </div>

      </div>
    </header>
  );
}