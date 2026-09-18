"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function CarrinhoError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {

    useEffect(() => {
        console.error("Erro capturado pela bolha (Error Boundary) do Carrinho:", error);
    }, [error]);

    return (
        <div className="bg-paper min-h-screen flex flex-col font-inter text-night">
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">

                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <AlertTriangle className="w-10 h-10" />
                </div>

                <h1 className="font-display font-extrabold text-[28px] mb-2 tracking-[-0.01em]">
                    Ops! Nossos servidores estão com fome.
                </h1>

                <p className="text-sm text-muted max-w-[400px] mb-8">
                    Não conseguimos carregar a sua lista de resgates no momento. Pode ser uma instabilidade rápida na conexão com o banco de dados.
                </p>

                <div className="flex gap-4 flex-col sm:flex-row w-full max-w-[400px]">
                    <button
                        onClick={() => reset()}
                        className="flex-1 flex items-center justify-center gap-2 bg-night text-amber font-bold text-sm py-3.5 rounded-xl hover:bg-night-3 transition-colors shadow-sm"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Tentar Novamente
                    </button>

                    <Link
                        href="/"
                        className="flex-1 flex items-center justify-center bg-card text-night font-bold text-sm py-3.5 rounded-xl border border-line hover:bg-line/50 transition-colors"
                    >
                        Voltar ao Início
                    </Link>
                </div>

            </main>
        </div>
    );
}
