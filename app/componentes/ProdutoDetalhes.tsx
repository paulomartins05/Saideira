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
  nome,
  loja,
  localizacao,
  descricao,
  precoOriginal,
  precoAtual,
  tempoPostagem,
  ofertaId,
  usuarioId,
  estoqueDisponivel
}: DetalhesProps) {

  const router = useRouter()

  const [quantidade, setQuantidade] = useState(1)
  const [erroEstoque, setErroEstoque] = useState("")

  const diminuir = () => {
    if (quantidade > 1) {
      setQuantidade(quantidade - 1)
      setErroEstoque("")
    }
  }

  const aumentar = () => {
    if (quantidade < estoqueDisponivel) {
      setQuantidade(quantidade + 1)
      setErroEstoque("")
    } else {
      setErroEstoque(`Temos apenas ${estoqueDisponivel} itens em estoque no momento!`)
    }
  }

  const formatarPreco = (valor: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col h-full">

      <div className="flex items-center gap-2 mb-4">
        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
          🕒 Postado há {tempoPostagem}
        </span>
      </div>

      <h1 className="font-playfair text-3xl md:text-4xl font-bold text-background-secondary mb-2 leading-tight">
        {nome}
      </h1>

      <p className="font-inter text-sm text-background-secondary/70 mb-4">
        Do "{loja}"
      </p>

      <div className="flex items-start gap-2 mb-6 p-3 bg-gray-50 rounded-xl border border-gray-100">
        <span className="text-lg">📍</span>
        <p className="font-inter text-sm text-background-secondary/80">
          <strong>Endereço de Retirada:</strong> <br />
          {localizacao}
        </p>
      </div>

      <p className="font-inter text-sm md:text-base text-background-secondary mb-8 leading-relaxed">
        {descricao}
      </p>

      <div className="mt-auto border-t border-gray-100 pt-6">
        <div className="mb-6">
          <span className="line-through text-gray-400 font-inter text-sm block mb-1">
            {formatarPreco(precoOriginal)}
          </span>
          <div className="flex items-end gap-3">
            <span className="font-inter font-bold text-3xl text-background-secondary">
              {formatarPreco(precoAtual)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-2 sm:w-1/3">
              <button type="button" onClick={diminuir} className="text-gray-500 hover:text-background-secondary text-xl font-bold">−</button>
              <span className="font-inter font-semibold">{quantidade}</span>
              <button type="button" onClick={aumentar} className="text-gray-500 hover:text-background-secondary text-xl font-bold">+</button>
            </div>

            <form action={async () => {
              if (!usuarioId) {
                router.push("/login");
                return;
              }
              await criarResgate(usuarioId, ofertaId, quantidade);
              router.push("/perfil");
            }} className="flex-1 w-full">
              <Button type="submit" variant="primary" size="lg" className="w-full flex justify-center items-center gap-2 bg-[#D9774A] hover:bg-[#c4683e] rounded-xl">
                {usuarioId ? (
                  <>🛒 Adicionar {quantidade > 1 ? `${quantidade} itens` : 'ao Resgate'}</>
                ) : (
                  <>Faça Login para Resgatar</>
                )}
              </Button>
            </form>
          </div>
          {erroEstoque && (
            <span className="text-red-500 text-sm font-medium pl-2">{erroEstoque}</span>
          )}
        </div>
      </div>

    </div>
  );
}