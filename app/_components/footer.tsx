import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-night text-paper border-t border-white/10 pt-16 pb-8">
            <div className="max-w-[1160px] mx-auto px-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">

                    <div className="flex flex-col items-start">
                        <Link href="/" className="flex items-center gap-2.5 font-display font-extrabold text-[22px] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber rounded-lg pr-2 mb-4 group">
                            <span className="w-8 h-8 rounded-lg bg-amber text-night flex items-center justify-center font-display font-extrabold text-base group-hover:scale-110 transition-transform">
                                S
                            </span>
                            Saideira
                        </Link>
                        <p className="text-muted text-sm max-w-[300px] leading-relaxed">
                            Nossa missão é combater o desperdício de alimentos, conectando você a estabelecimentos locais com ofertas sustentáveis.
                        </p>
                    </div>

                    <div className="flex flex-col md:items-end">
                        <h4 className="font-bold text-white mb-4 tracking-wider text-sm uppercase">Navegação</h4>
                        <nav className="flex flex-col gap-3 md:items-end text-sm font-medium text-muted">
                            <Link href="/" className="hover:text-amber transition-colors">Página Inicial</Link>
                            <Link href="/resgates" className="hover:text-amber transition-colors">Explorar Ofertas</Link>
                            <Link href="/sobre-nos" className="hover:text-amber transition-colors">Sobre o Impacto</Link>
                            <Link href="/cadastro" className="text-amber hover:text-amber-dark transition-colors font-bold mt-2">
                                + Seja um Parceiro
                            </Link>
                        </nav>
                    </div>

                </div>

                <div className="w-full h-px bg-white/10 mb-8" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-muted/60">
                    <p>© {new Date().getFullYear()} Saideira. Todos os direitos reservados.</p>
                    <p>Feito com impacto social.</p>
                </div>

            </div>
        </footer>
    );
}
