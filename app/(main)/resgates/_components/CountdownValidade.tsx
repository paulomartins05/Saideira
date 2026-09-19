"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function CountdownValidade({ validade }: { validade: Date }) {
    const [tempoRestante, setTempoRestante] = useState<string>("Carregando...");
    const [expirou, setExpirou] = useState(false);

    useEffect(() => {
        const dataAlvo = new Date(validade).getTime();

        const atualizarRelogio = () => {
            const agora = new Date().getTime();
            const diff = dataAlvo - agora;

            if (diff <= 0) {
                setExpirou(true);
                setTempoRestante("00:00:00");
                return;
            }

            const horas = Math.floor(diff / (1000 * 60 * 60));
            const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((diff % (1000 * 60)) / 1000);

            const h = String(horas).padStart(2, "0");
            const m = String(minutos).padStart(2, "0");
            const s = String(segundos).padStart(2, "0");

            setTempoRestante(`${h}:${m}:${s}`);
        };

        atualizarRelogio();

        const intervalo = setInterval(atualizarRelogio, 1000);

        return () => clearInterval(intervalo);
    }, [validade]);

    if (expirou) {
        return (
            <span className="text-coral flex items-center gap-2 drop-shadow-none uppercase">
                <Clock className="w-8 h-8 md:w-10 md:h-10" />
                Encerrado
            </span>
        );
    }

    return <>{tempoRestante}</>;
}
