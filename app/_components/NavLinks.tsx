"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks({ role }: { role?: string | null }) {
    const pathname = usePathname();

    const getNavClass = (path: string) => {
        const isActive = pathname === path || (path !== "/" && pathname?.startsWith(path));
        return isActive
            ? "text-[13.5px] font-semibold text-amber py-1 border-b-2 border-amber transition-colors"
            : "text-[13.5px] font-semibold text-paper/70 py-1 border-b-2 border-transparent hover:text-white transition-colors";
    };

    return (
        <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className={getNavClass("/")}>
                Início
            </Link>
            <Link href="/resgates" className={getNavClass("/resgates")}>
                Ofertas
            </Link>

            {role === "PARCEIRO" ? (
                <Link href="/parceiro" className={getNavClass("/parceiro")}>
                    Painel do Parceiro
                </Link>
            ) : (
                <Link href="/contato" className={getNavClass("/contato")}>
                    Vender excedente
                </Link>
            )}
        </nav>
    );
}
