"use client"

import Button from "./button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { criarResgate } from "@/app/actions/resgate";

interface DetalhesProps {
  nome: string;
  loja: string;
  localizacao: string;
  descricao: string;
  precoOriginal: number;
  precoAtual: number;
  tempoPostagem: string;
  ofertaId: string;
  usuarioId?: string;
  estoqueDisponivel: number;
}

export default function ProdutoDetalhes({
  nome, loja, localizacao, descricao, precoOriginal, precoAtual, tempoPostagem, ofertaId, usuarioId, estoqueDisponivel
}: DetalhesProps) {

  const router = useRouter()
  const [quantidade, setQuantidade] = useState(1)
  const [erroEstoque, setErroEstoque] = useState("")

  const diminuir = () => {
    if (quantidade > 1) { setQuantidade(quantidade - 1); setErroEstoque(""); }
  }

  const aumentar = () => {
    if (quantidade < estoqueDisponivel) { setQuantidade(quantidade + 1); setErroEstoque(""); }
    else { setErroEstoque(`Temos apenas ${estoqueDisponivel} itens em estoque no momento!`); }
  }

  const formatarPreco = (valor: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  return (
    <div className="bg-card rounded-[2rem] p-6 md:p-8 shadow-sm border border-line flex flex-col h-full">

      <div className="flex items-center gap-2 mb-4">
        <span className="bg-success-bg text-success text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          🕒 Postado há {tempoPostagem}
        </span>
      </div>

      <h1 className="font-display text-3xl md:text-4xl font-bold text-night mb-2 leading-tight">
        {nome}
      </h1>

      <p className="font-body text-sm text-muted mb-6">
        Do "{loja}"
      </p>

      <div className="flex items-start gap-3 mb-8 p-4 bg-paper rounded-2xl border border-line-dark">
        <span className="text-xl">📍</span>
        <p className="font-body text-sm text-night/80 leading-relaxed">
          <strong>Endereço de Retirada:</strong> <br />
          {localizacao}
        </p>
      </div>

      <p className="font-body text-sm md:text-base text-night/90 mb-8 leading-relaxed">
        {descricao}
      </p>

      <div className="mt-auto border-t border-line pt-6">
        <div className="flex flex-col mb-6 bg-paper p-5 rounded-2xl border border-line-dark">
          <span className="text-muted line-through font-body text-sm mb-1">
            De {formatarPreco(precoOriginal)}
          </span>
          <div className="flex items-end gap-3">
            <span className="font-display font-bold text-4xl text-night">
              Por {formatarPreco(precoAtual)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center justify-between bg-paper border border-line rounded-2xl px-5 py-3 sm:w-1/3">
              <button type="button" onClick={diminuir} className="text-muted hover:text-night text-2xl font-bold transition-colors">−</button>
              <span className="font-display text-lg font-bold text-night">{quantidade}</span>
              <button type="button" onClick={aumentar} className="text-muted hover:text-night text-2xl font-bold transition-colors">+</button>
            </div>

            <form action={async () => {
              if (!usuarioId) return router.push("/login");
              await criarResgate(usuarioId, ofertaId, quantidade);
              router.push("/perfil");
            }} className="flex-1 w-full">
              <Button type="submit" variant="primary" className="w-full h-full min-h-[3.5rem] flex justify-center items-center gap-2 bg-amber hover:bg-amber-dark text-night font-bold rounded-2xl shadow-lg shadow-amber/20 transition-all text-base md:text-lg">
                {usuarioId ? (
                  <>🛒 Resgatar {quantidade > 1 ? `${quantidade} itens` : ''}</>
                ) : (
                  <>Faça Login para Resgatar</>
                )}
              </Button>
            </form>
          </div>
          {erroEstoque && (
            <span className="text-coral text-sm font-medium pl-2">{erroEstoque}</span>
          )}
        </div>
      </div>

    </div>
  );
}
