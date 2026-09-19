"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function PerfilError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Erro no Perfil do Consumidor:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-paper p-4">
            <div className="flex flex-col items-center justify-center p-10 text-center bg-card rounded-[20px] border border-line w-full max-w-md shadow-sm">
                <div className="w-16 h-16 bg-red-50 text-coral rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8" />
                </div>
                <h2 className="font-display font-extrabold text-[22px] text-night mb-2">Ops! Algo deu errado.</h2>
                <p className="text-[13.5px] text-muted max-w-[300px] mb-6">
                    Não conseguimos carregar os dados do seu perfil no momento.
                </p>
                <button
                    onClick={() => reset()}
                    className="flex items-center gap-2 bg-night hover:bg-night-3 text-amber font-bold text-[13px] px-5 py-2.5 rounded-lg transition-colors"
                >
                    <RefreshCcw className="w-4 h-4" /> Tentar Novamente
                </button>
            </div>
        </div>
    );
}
