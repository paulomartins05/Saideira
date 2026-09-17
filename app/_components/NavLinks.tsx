"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getHeaderRoutes } from "@/lib/routes";

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
            {getHeaderRoutes(role).map((rota) => (
                <Link key={rota.path} href={rota.path} className={getNavClass(rota.path)}>
                    {rota.label}
                </Link>
            ))}
        </nav>
    );
}
