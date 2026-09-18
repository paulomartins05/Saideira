import { ReactNode } from "react";
interface CardImpactoProps {
    icone: ReactNode;
    valor: string | number;
    titulo: string;
    descricao: string;
    corFundoIcone: string;
    corTextoIcone: string;
}
export default function CardImpacto({ icone, valor, titulo, descricao, corFundoIcone, corTextoIcone }: CardImpactoProps) {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-line flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${corFundoIcone} ${corTextoIcone}`}>
                {icone}
            </div>
            <h3 className="font-display text-4xl font-extrabold text-night mb-2">{valor}</h3>
            <p className="text-[15px] font-bold text-muted uppercase tracking-wider">{titulo}</p>
            <p className="text-[14px] text-muted mt-3">{descricao}</p>
        </div>
    );
}
