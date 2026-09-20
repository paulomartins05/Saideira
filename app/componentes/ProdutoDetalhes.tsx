"use client"

import Button from "./button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMediaParceiro } from "@/app/actions/avaliacoes";
import { criarResgate } from "@/app/actions/resgate";
import { Clock, MapPin, ShoppingCart, Star, Store, Loader2 } from "lucide-react";
import Link from "next/link";



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
  distanciaFormatada?: string | null;
  imagemParceiro?: string | null;
}

export default function ProdutoDetalhes({
  nome, loja, localizacao, descricao, precoOriginal, precoAtual, tempoPostagem, ofertaId, usuarioId, estoqueDisponivel, parceiroId, distanciaFormatada, imagemParceiro
}: DetalhesProps) {

  const router = useRouter()
  const [quantidade, setQuantidade] = useState(1)
  const [erroEstoque, setErroEstoque] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stats, setStats] = useState<{ visivel: boolean, mensagem?: string, media?: number | null, quantidade?: number }>({ visivel: false, mensagem: "Carregando..." })

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

  const handleResgatar = async () => {
    if (!usuarioId) {
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      await criarResgate(usuarioId, ofertaId, quantidade);
      router.push("/carrinho");
    } catch (error) {
      console.error("Erro ao resgatar:", error);
      setIsSubmitting(false);
    }
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

      <div className="flex items-center gap-3 mb-6 bg-paper p-3 rounded-xl border border-line w-fit pr-6">
        <div className="w-10 h-10 rounded-full bg-night flex items-center justify-center text-amber overflow-hidden shrink-0 border border-line">
          {imagemParceiro ? (
            <img src={imagemParceiro} alt={`Logo de ${loja}`} className="w-full h-full object-cover" />
          ) : (
            <Store className="w-5 h-5" />
          )}
        </div>
        <div>
          <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-0.5">Vendido por</p>
          <Link
            href={`/loja/${parceiroId}`}
            className="font-body text-sm text-night font-bold hover:text-amber transition-colors underline decoration-amber/30 underline-offset-2"
          >
            {loja}
          </Link>
        </div>

      </div>

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
        <span className="text-xl text-night mt-1"><MapPin className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /></span>
        <div className="flex flex-col">
          <p className="font-body text-sm text-night/80 leading-relaxed mb-1.5">
            <strong>Endereço de Retirada:</strong> <br />
            {localizacao}
          </p>
          {distanciaFormatada && (
            <span className="text-xs font-bold text-amber-dark bg-amber/10 border border-amber/30 px-2 py-1 rounded-md w-fit">
              📍 A {distanciaFormatada} de você
            </span>
          )}
        </div>
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

            <form action={handleResgatar} className="flex-1 w-full">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                className={`w-full h-full min-h-[3.5rem] flex justify-center items-center gap-2 bg-amber text-night font-bold rounded-2xl shadow-lg shadow-amber/20 transition-all text-base md:text-lg hover:bg-amber-dark`}
              >
                {!usuarioId ? (
                  "Faça Login para Resgatar"
                ) : isSubmitting ? (
                  "Processando..."
                ) : (
                  <><ShoppingCart className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> Resgatar {quantidade > 1 ? `${quantidade} itens` : ''}</>
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
