"use client";

import { useTransition } from "react";
import { validarResgate } from "@/app/actions/resgate";
import { appToast } from "@/lib/toast";

export default function FormValidarResgate({ resgateId }: { resgateId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleValidar = (formData: FormData) => {
        const pin = formData.get("pin") as string;

        startTransition(async () => {
            try {
                await validarResgate(resgateId, pin);
                appToast.sucesso("Tudo Certo!", "Resgate validado com sucesso.");
            } catch (error: any) {
                appToast.erro("PIN Inválido", error.message || "Erro ao validar.");
            }
        });
    };

    return (
        <form action={handleValidar} className="flex items-center gap-2">
            <input
                type="text"
                name="pin"
                placeholder="PIN"
                maxLength={4}
                required
                disabled={isPending}
                className="w-16 px-2 py-2 text-center border border-line rounded-lg text-sm font-bold focus:outline-none focus:border-night bg-white disabled:opacity-50"
            />
            <button
                type="submit"
                disabled={isPending}
                className={`bg-night text-amber font-bold py-2 px-3 rounded-lg text-[12px] transition-colors ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-night-3'
                    }`}
            >
                {isPending ? "VALIDANDO..." : "VALIDAR"}
            </button>
        </form>
    );
}
