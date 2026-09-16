"use client"

import Button from "./button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMediaParceiro } from "@/app/actions/avaliacoes";
import { criarResgate } from "@/app/actions/resgate";
import { Clock, MapPin, ShoppingCart, Star } from "lucide-react";


interface DetalhesProps {
  parceiroId: string;
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
  nome, loja, localizacao, descricao, precoOriginal, precoAtual, tempoPostagem, ofertaId, usuarioId, estoqueDisponivel, parceiroId
}: DetalhesProps) {

  const router = useRouter()
  const [quantidade, setQuantidade] = useState(1)
  const [erroEstoque, setErroEstoque] = useState("")
  const [stats, setStats] = useState<{visivel: boolean, mensagem?: string, media?: number|null, quantidade?: number}>({ visivel: false, mensagem: "Carregando..." })

  useEffect(() => {
    getMediaParceiro(parceiroId).then(setStats).catch(console.error)
  }, [parceiroId])

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
          <Clock className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> Postado há {tempoPostagem}
        </span>
      </div>

      <h1 className="font-display text-3xl md:text-4xl font-bold text-night mb-2 leading-tight">
        {nome}
      </h1>

      <p className="font-body text-sm text-muted mb-6">
        Do &quot;{loja}&quot;
      </p>

      {/* Selo de Avaliação (Badge) */}
      <div className="mb-8">
        {!stats.visivel ? (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {stats.mensagem}
          </span>
        ) : (
          <div className="flex items-center gap-1.5 text-yellow-500 font-bold bg-yellow-50 inline-flex px-2 py-1 rounded-full ring-1 ring-inset ring-yellow-600/20">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span className="text-sm">{stats.media}</span>
            <span className="text-gray-500 text-xs font-normal ml-1">
              ({stats.quantidade})
            </span>
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 mb-8 p-4 bg-paper rounded-2xl border border-line-dark">
        <span className="text-xl"><MapPin className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /></span>
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
                  <><ShoppingCart className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> Resgatar {quantidade > 1 ? `${quantidade} itens` : ''}</>
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
