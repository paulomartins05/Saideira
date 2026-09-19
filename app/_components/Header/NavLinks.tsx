"use client";

import NavLink from "./NavLink";

interface NavLinksProps {
    rotas: Array<{ label: string; path: string }>;
}

export default function NavLinks({ rotas }: NavLinksProps) {
    return (
        <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-6">
            {rotas.map((rota) => (
                <NavLink key={rota.path} href={rota.path} variant="desktop">
                    {rota.label}
                </NavLink>
            ))}
        </nav>
    );
}
