"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Download } from "lucide-react";

type ResgateSimples = {
    id: string;
    titulo: string;
    precoResgate: number;
    updatedAtStr: string;
}

export default function FiltroEExportacao({ resgates }: { resgates: ResgateSimples[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams);
        params.set("periodo", e.target.value);
        router.replace(`${pathname}?${params.toString()}`);
    };

    const exportToCSV = () => {
        if (resgates.length === 0) return;

        const cabecalho = "Data,Hora,Produto,Valor\n";

        const linhas = resgates.map(r => {
            const dataObj = new Date(r.updatedAtStr);
            const data = dataObj.toLocaleDateString('pt-BR');
            const hora = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            const produto = `"${r.titulo}"`;
            const valor = r.precoResgate.toFixed(2).replace('.', ',');
            return `${data},${hora},${produto},${valor}`;
        }).join("\n");

        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + cabecalho + linhas;
        const encodedUri = encodeURI(csvContent);

        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `historico_vendas_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col gap-4 w-full h-full justify-center">
            <div className="flex flex-col gap-1 w-full">
                <label className="text-[12px] font-bold text-muted">Período de Análise</label>
                <select
                    onChange={handleFilterChange}
                    defaultValue={searchParams.get("periodo") || "todos"}
                    className="bg-paper border border-line text-night text-[13.5px] font-semibold rounded-lg px-3 py-2.5 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber w-full transition-colors cursor-pointer"
                >
                    <option value="1">Últimas 24 horas</option>
                    <option value="5">Últimos 5 dias</option>
                    <option value="15">Últimos 15 dias</option>
                    <option value="30">Último 1 Mês</option>
                    <option value="180">Últimos 6 Meses</option>
                    <option value="365">Último 1 Ano</option>
                    <option value="todos">Todo o Histórico</option>
                </select>
            </div>

            <button
                onClick={exportToCSV}
                className="bg-night hover:bg-night-3 text-amber font-bold py-2.5 px-4 text-[13px] rounded-lg w-full transition-colors flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-amber focus-visible:outline-none"
            >
                <Download className="w-4 h-4" />
                Extrair p/ Excel (.CSV)
            </button>
        </div>
    );
}
