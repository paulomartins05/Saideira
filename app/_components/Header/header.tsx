import Link from "next/link";
import { User, ShoppingCart } from "lucide-react";
import MenuMobile from "./MenuMobile";
import MenuUsuario from "./MenuUsuario";
import NavLinks from "./NavLinks";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getCartCountByUserId } from "@/app/actions/resgate";
import { getHeaderRoutes } from "@/lib/routes";

export default async function Header() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });
  const usuario = session?.user;

  const cartCount = usuario ? await getCartCountByUserId(usuario.id) : 0;

  const rotas = getHeaderRoutes(usuario?.role);

  return (
    <header className="w-full bg-night/90 backdrop-blur-md text-paper sticky top-0 z-50 border-b border-white/5 shadow-sm transition-all">
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-amber text-night px-4 py-2 rounded-lg font-bold z-50"
      >
        Pular para o conteúdo principal
      </a>

      <div className="max-w-[1160px] mx-auto py-4 px-7 flex items-center justify-between gap-5">

        <Link href="/" className="flex items-center gap-2.5 font-display font-extrabold text-[19px] text-white group focus-visible:ring-2 focus-visible:ring-amber focus-visible:outline-none rounded-lg pr-2">
          <span className="w-8 h-8 rounded-lg bg-amber text-night flex items-center justify-center font-display font-extrabold text-base group-hover:scale-110 transition-transform">
            S
          </span>
          Saideira
        </Link>

        <NavLinks rotas={rotas} />

        <div className="flex items-center gap-1.5">
          <div className="hidden md:block">
            {usuario ? (
              <MenuUsuario usuario={usuario} />
            ) : (
              <Link
                href="/login"
                className="w-9 h-9 rounded-full bg-transparent border-[1.5px] border-paper/30 text-paper flex items-center justify-center hover:bg-paper/10 transition-colors focus-visible:ring-2 focus-visible:ring-amber focus-visible:outline-none"
                aria-label="Fazer Login"
              >
                <User className="w-[18px] h-[18px]" />
              </Link>
            )}
          </div>

          {usuario?.role !== "PARCEIRO" && (
            <Link
              href="/carrinho"
              aria-label="Ver Carrinho de Resgates"
              className={`w-9 h-9 rounded-full flex items-center justify-center relative transition-colors focus-visible:ring-2 focus-visible:ring-amber focus-visible:outline-none ${cartCount > 0
                ? "bg-amber text-night hover:bg-amber-dark"
                : "bg-transparent border-[1.5px] border-paper/30 text-paper hover:bg-paper/10"
                }`}
            >
              <ShoppingCart className="w-[18px] h-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -top-[3px] -right-[3px] bg-coral text-white text-[9.5px] font-extrabold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center border-[1.5px] border-night animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          <MenuMobile rotas={rotas} />
        </div>
      </div>
    </header>
  );
}
