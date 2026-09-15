"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { novoResgateSchema, type NovoResgateFormInputs } from "@/lib/schemas/novo-resgates";
import { juntarEndereco } from "@/lib/utils";
import { formatCoinInput } from "@/lib/formatacao";

import Container from "../../componentes/container";
import { criarOferta } from "@/app/actions/ofertas";
import { authClient } from "@/lib/auth-client";
import Header from "../../pages/header";
import InputForm from "../../componentes/InputForm";
import { appToast } from "@/lib/toast";
import { Utensils, Archive, Coffee, CupSoda, Croissant, Donut, Cake, Apple, Beef, ShoppingCart, Candy, Pizza, Package, Tag } from "lucide-react";


const categoriasPorNegocio: Record<string, { id: string; label: string; icon: React.ReactNode }[]> = {
  RESTAURANTE: [
    { id: "Prato principal", label: "Prato Feito", icon: <Utensils className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> },
    { id: "Marmita", label: "Marmita", icon: <Archive className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> },
    { id: "Sobremesa", label: "Sobremesa", icon: <Coffee className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> },
    { id: "Bebida", label: "Bebida", icon: <CupSoda className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> },
  ],
  PADARIA: [
    { id: "Pães", label: "Pães", icon: <Croissant className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> },
    { id: "Salgados", label: "Salgados", icon: <Croissant className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> },
    { id: "Doces", label: "Doces", icon: <Donut className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> },
    { id: "Bolos", label: "Bolos", icon: <Cake className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> },
  ],
  MERCADO: [
    { id: "Hortifruti", label: "Hortifruti", icon: <Apple className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> },
    { id: "Padaria própria", label: "Padaria", icon: <Croissant className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> },
    { id: "Açougue", label: "Açougue", icon: <Beef className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> },
    { id: "Mercearia", label: "Mercearia", icon: <ShoppingCart className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> },
  ],
  DOCERIA: [
    { id: "Bolos", label: "Bolos", icon: <Cake className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> },
    { id: "Doces finos", label: "Doces Finos", icon: <Candy className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> },
    { id: "Tortas", label: "Tortas", icon: <Pizza className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> },
  ],
  OUTRO: [
    { id: "Diversos", label: "Diversos", icon: <Package className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> },
  ],
};




type UsuarioComLocalizacao = {
  localizacao?: string | null
  tipoNegocio?: "RESTAURANTE" | "PADARIA" | "MERCADO" | "DOCERIA" | "OUTRO" | null
}

export default function CadastrarNovoResgate() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const tipoNegocioUsuario = (session?.user as UsuarioComLocalizacao)?.tipoNegocio || "OUTRO";
  const categoriasDisponiveis = categoriasPorNegocio[tipoNegocioUsuario] || categoriasPorNegocio.OUTRO;

  const [imagemFiles, setImagemFiles] = useState<File[]>([]);
  const [imagemPreviews, setImagemPreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NovoResgateFormInputs>({
    resolver: zodResolver(novoResgateSchema),
    defaultValues: {
      quantidade: 1,
      termosAceitos: false,
    },
  });

  const categoriaSelecionada = watch("categoria");

  const precoOriginalWatch = watch("precoOriginal");
  const precoResgateWatch = watch("precoResgate");

  let descontoPercentual = 0;
  if (precoOriginalWatch && precoResgateWatch) {
    const original = parseFloat(String(precoOriginalWatch).replace(/\./g, "").replace(",", "."));
    const resgate = parseFloat(String(precoResgateWatch).replace(/\./g, "").replace(",", "."));

    if (original > 0 && resgate > 0 && original > resgate) {
      descontoPercentual = Math.round(((original - resgate) / original) * 100);
    }
  }

  useEffect(() => {
    type UsuarioComEnderecoCompleto = {
      cep?: string | null;
      rua?: string | null;
      numero?: string | null;
      bairro?: string | null;
      cidade?: string | null;
      estado?: string | null;
    };

    const user = session?.user as UsuarioComEnderecoCompleto;
    if (user) {
      if (user.cep && !watch("cep")) setValue("cep", user.cep);
      if (user.rua && !watch("rua")) setValue("rua", user.rua);
      if (user.numero && !watch("numero")) setValue("numero", user.numero);
      if (user.bairro && !watch("bairro")) setValue("bairro", user.bairro);
      if (user.cidade && !watch("cidade")) setValue("cidade", user.cidade);
      if (user.estado && !watch("estado")) setValue("estado", user.estado);
    }
  }, [session, setValue]);

  const onSubmit = async (data: NovoResgateFormInputs) => {
    if (imagemFiles.length === 0) {
      appToast.aviso("Foto obrigatória", "Por favor, adicione pelo menos uma foto do lanche.");
      return;
    }

    try {
      const precoOriginalLimpo = data.precoOriginal.replace(/\./g, "").replace(",", ".");
      const precoResgateLimpo = data.precoResgate.replace(/\./g, "").replace(",", ".");

      const localizacaoUnificada = juntarEndereco({
        cep: data.cep,
        rua: data.rua,
        numero: data.numero,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado
      });

      const serverData = new FormData();
      serverData.append("titulo", data.nome);
      serverData.append("descricao", data.descricao);
      serverData.append("precoOriginal", precoOriginalLimpo);
      serverData.append("precoResgate", precoResgateLimpo);
      serverData.append("quantidade", data.quantidade.toString());

      const [horasStr, minutosStr] = data.validade.split(":");
      const dataExpiraçao = new Date();
      dataExpiraçao.setHours(parseInt(horasStr), parseInt(minutosStr), 0, 0);

      if (dataExpiraçao.getTime() < Date.now()) {
        dataExpiraçao.setDate(dataExpiraçao.getDate() + 1);
      }
      serverData.append("dataValidade", dataExpiraçao.toISOString());

      serverData.append("categoria", data.categoria);
      serverData.append("localizacao", localizacaoUnificada);
      imagemFiles.forEach(file => {
        serverData.append("imagem", file);
      });

      await criarOferta(serverData);

      appToast.sucesso("Oferta Publicada!", `A oferta "${data.nome}" foi publicada.`);
      router.push("/");

    } catch (error: any) {
      appToast.erro("Erro ao publicar oferta", error.message);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body text-night">
      <Header />
      <hr className="border-line" />

      <main className="py-10 grow">
        <Container>

          <div className="mb-8 text-center md:text-left">
            <div className="text-sm text-amber-dark mb-3">
              Dashboard {'>'} Resgates {'>'} <span className="font-semibold text-night">Novo Cadastro</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-night">
              Cadastrar Novo Lanche para Resgate
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="bg-[#f4f1eb] border border-[#e5e7eb] rounded-xl p-6 md:p-10 max-w-3xl mx-auto flex flex-col gap-12 relative overflow-hidden shadow-sm">

            {/* CABEÇALHO DO PARCEIRO */}
            <div className="bg-[#1e2029] rounded-xl p-4 flex items-center gap-4 relative z-10 -mb-4">
              <div className="text-amber pl-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[12.5px] text-gray-400 font-medium tracking-wide">Publicando como</span>
                <span className="text-[14.5px] text-white font-bold">
                  {session?.user?.name || "Carregando..."} <span className="text-gray-400 font-normal mx-0.5">·</span> {
                    tipoNegocioUsuario.charAt(0).toUpperCase() + tipoNegocioUsuario.slice(1).toLowerCase()
                  }
                </span>
              </div>
            </div>

            {/* SEÇÃO 1: O que você está oferecendo */}
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                <div className="w-7 h-7 rounded-full bg-[#1e2029] text-white flex items-center justify-center font-bold text-sm">1</div>
                <h2 className="font-display text-[17px] font-bold text-[#111]">O que você está oferecendo</h2>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Nome do item</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"><Tag className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /></span>
                  <input
                    type="text"
                    placeholder="Marmita executiva do dia"
                    className="w-full bg-[#f8f9fa] border border-[#e5e7eb] text-[#374151] rounded-xl py-3 pl-10 pr-4 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all"
                    {...register("nome")}
                  />
                </div>
                {errors.nome && <span className="text-xs text-coral font-medium">{errors.nome.message}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Categoria</label>
                  <select
                    className="w-full bg-[#f8f9fa] border border-[#e5e7eb] text-[#374151] rounded-xl py-3 px-4 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all appearance-none cursor-pointer"
                    {...register("categoria")}
                  >
                    <option value="">Selecione uma categoria...</option>
                    {categoriasDisponiveis.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                  {errors.categoria && <span className="text-xs text-coral font-medium">{errors.categoria.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Disponível Até</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4b5563]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </span>
                    <input
                      type="time"
                      className="w-full bg-[#f8f9fa] border border-[#e5e7eb] text-[#173d7a] rounded-xl py-3 pl-10 pr-4 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all cursor-pointer"
                      {...register("validade")}
                    />
                  </div>
                  {errors.validade && <span className="text-xs text-coral font-medium">{errors.validade.message}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Descrição</label>
                <textarea
                  placeholder="Arroz, feijão, frango grelhado, legumes e salada."
                  className="w-full bg-[#f8f9fa] border border-[#e5e7eb] text-[#374151] rounded-xl p-4 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all resize-none h-24"
                  {...register("descricao")}
                />
                {errors.descricao && <span className="text-xs text-coral font-medium">{errors.descricao.message}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Fotos (Máx. 3)</label>
                <label className="group relative cursor-pointer block w-full md:w-[60%]">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files).slice(0, 3);
                        setImagemFiles(files);
                        const previews = files.map(f => URL.createObjectURL(f));
                        setImagemPreviews(previews);
                      }
                    }}
                  />
                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2].map((index) => (
                      <div key={index} className={`aspect-square rounded-xl border flex flex-col items-center justify-center transition-all overflow-hidden relative pointer-events-none
                        ${imagemPreviews[index] ? "border-[#e5e7eb] shadow-sm bg-white" : "border-dashed border-gray-300 bg-transparent"}
                      `}>
                        {imagemPreviews[index] ? (
                          <img src={imagemPreviews[index]} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl opacity-50">
                            {index === 0 ? <Utensils className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" /> : "+"}
                          </span>
                        )}
                        {index === 0 && (
                          <div className="absolute top-1.5 right-1.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </label>
              </div>
            </div>


            {/* SEÇÃO 2: Preço e quantidade */}
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                <div className="w-7 h-7 rounded-full bg-[#1e2029] text-white flex items-center justify-center font-bold text-sm">2</div>
                <h2 className="font-display text-[17px] font-bold text-[#111]">Preço e quantidade</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Preço Normal</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="R$ 28,00"
                    className="w-full bg-[#f8f9fa] border border-[#e5e7eb] text-gray-400 line-through rounded-xl py-3 px-4 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all"
                    {...register("precoOriginal", {
                      onChange: (e) => e.target.value = formatCoinInput(e.target.value)
                    })}
                  />
                  {errors.precoOriginal && <span className="text-xs text-coral font-medium">{errors.precoOriginal.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Preço de Resgate</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="R$ 12,00"
                    className="w-full bg-[#f4faee] border border-[#2e7d32] text-[#2e7d32] rounded-xl py-3 px-4 text-[15px] font-bold focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all"
                    {...register("precoResgate", {
                      onChange: (e) => e.target.value = formatCoinInput(e.target.value)
                    })}
                  />
                  {errors.precoResgate && <span className="text-xs text-coral font-medium">{errors.precoResgate.message}</span>}
                </div>
              </div>

              {descontoPercentual > 0 && (
                <div className="flex items-center gap-3 -mt-2">
                  <div className="bg-[#E85C4A] text-white font-bold py-1 px-2.5 rounded text-[12px]">
                    -{descontoPercentual}% de desconto
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Quantidade Disponível</label>
                <input
                  type="number"
                  min="1"
                  className="w-full bg-[#f8f9fa] border border-[#e5e7eb] text-[#374151] rounded-xl py-3 px-4 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all"
                  {...register("quantidade", { valueAsNumber: true })}
                />
                {errors.quantidade && <span className="text-xs text-coral font-medium">{errors.quantidade.message}</span>}
              </div>
            </div>


            {/* SEÇÃO 3: Local de retirada */}
            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-3 mb-2">
                <div className="w-7 h-7 rounded-full bg-[#1e2029] text-white flex items-center justify-center font-bold text-sm">3</div>
                <h2 className="font-display text-[17px] font-bold text-[#111]">Local de retirada</h2>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Endereço</label>

                <div className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-xl p-6 relative">
                  <span className="absolute left-4 top-6 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  </span>
                  <div className="pl-8 grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">CEP</label>
                      <input type="text" placeholder="Ex: 00000-000" className="w-full bg-[#f8f9fa] border border-[#e5e7eb] text-[#374151] rounded-xl py-2.5 px-3.5 text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all" {...register("cep")} />
                      {errors.cep && <span className="text-xs text-coral font-medium">{errors.cep.message}</span>}
                    </div>
                    <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Rua</label>
                      <input type="text" placeholder="Ex: Rua das Flores" className="w-full bg-[#f8f9fa] border border-[#e5e7eb] text-[#374151] rounded-xl py-2.5 px-3.5 text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all" {...register("rua")} />
                      {errors.rua && <span className="text-xs text-coral font-medium">{errors.rua.message}</span>}
                    </div>
                    <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Número</label>
                      <input type="text" placeholder="Ex: 123" className="w-full bg-[#f8f9fa] border border-[#e5e7eb] text-[#374151] rounded-xl py-2.5 px-3.5 text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all" {...register("numero")} />
                      {errors.numero && <span className="text-xs text-coral font-medium">{errors.numero.message}</span>}
                    </div>
                    <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Bairro</label>
                      <input type="text" placeholder="Ex: Centro" className="w-full bg-[#f8f9fa] border border-[#e5e7eb] text-[#374151] rounded-xl py-2.5 px-3.5 text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all" {...register("bairro")} />
                      {errors.bairro && <span className="text-xs text-coral font-medium">{errors.bairro.message}</span>}
                    </div>
                    <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Cidade</label>
                      <input type="text" placeholder="Ex: São Paulo" className="w-full bg-[#f8f9fa] border border-[#e5e7eb] text-[#374151] rounded-xl py-2.5 px-3.5 text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all" {...register("cidade")} />
                      {errors.cidade && <span className="text-xs text-coral font-medium">{errors.cidade.message}</span>}
                    </div>
                    <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Estado</label>
                      <input type="text" placeholder="Ex: SP" className="w-full bg-[#f8f9fa] border border-[#e5e7eb] text-[#374151] rounded-xl py-2.5 px-3.5 text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-amber/50 transition-all" {...register("estado")} />
                      {errors.estado && <span className="text-xs text-coral font-medium">{errors.estado.message}</span>}
                    </div>
                  </div>
                </div>

                <p className="text-[12px] text-gray-500 font-medium mt-1">Endereço da loja já preenchido a partir do seu cadastro — troque só se for retirar em outro lugar.</p>
              </div>
            </div>

            <div className="flex flex-col gap-5 relative z-10 pt-4">
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-amber focus:ring-amber cursor-pointer"
                    {...register("termosAceitos")}
                  />
                  <span className="text-[13px] text-[#111] font-semibold leading-relaxed">
                    Li e concordo com os{" "}
                    <a
                      href="/documentos/termos-contrato.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-amber-dark font-bold underline decoration-amber-dark/30 hover:decoration-amber-dark underline-offset-2 transition-all"
                    >
                      termos de publicação
                    </a>.
                  </span>
                </label>
                {errors.termosAceitos && <span className="text-xs text-coral ml-7 font-medium">{errors.termosAceitos.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#f6aa33] hover:bg-[#e09829] text-[#111] font-bold text-[15px] py-3.5 rounded-lg transition-all duration-200
                ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {isSubmitting ? "ENVIANDO..." : "Publicar oferta"}
              </button>
            </div>

          </form>
        </Container>
      </main>
    </div>
  );
}