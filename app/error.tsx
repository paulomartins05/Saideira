"use client"

import { useEffect } from "react"
import Link from "next/link"
import { appToast } from "@/lib/toast"
import { AlertTriangle } from "lucide-react";


export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Erro capturado pelo Error Boundary", error)

        appToast.erro("Ops! Algo deu errado", "Ocorreu um erro inesperado na aplicação")
    }, [error])

    return (
        <div className="bg-[#F6EFE5] min-h-screen flex flex-col items-center justify-center font-inter p-6 text-center">
            <div className="bg-white border border-[#e8dfd5] shadow-lg rounded-3xl p-8 max-w-md w-full">
                <div className="text-6xl mb-4"><AlertTriangle className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /></div>
                <h2 className="text-2xl font-bold text-background-secondary mb-4 font-playfair">
                    Tivemos um problema!
                </h2>

                <p className="text-gray-600 mb-8 text-sm">
                    Desculpe, não conseguimos carregar esta página devido a um erro inesperado.
                    Nossa equipe já foi notificada (Erro: {error.message || "Desconhecido"}).
                </p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="w-full bg-[#D9774A] hover:bg-[#c4683e] text-white font-bold py-3 rounded-xl shadow-md transition-colors"
                    >
                        Tentar Novamente
                    </button>

                    <Link
                        href="/"
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors"
                    >
                        Voltar para o Início
                    </Link>
                </div>
            </div>
        </div>
    );
}
