"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Container from "../../componentes/container";
import { criarOferta } from "@/app/actions/ofertas";
import { authClient } from "@/lib/auth-client";
import Header from "../../pages/header";
import InputForm from "../../componentes/InputForm";
import { appToast } from "@/lib/toast";

const categoriasDisponiveis = [
  { id: "Salgados", label: "Salgados", icon: "🥟" },
  { id: "Doces", label: "Doces", icon: "🍩" },
  { id: "Assados", label: "Assados", icon: "🥐" },
  { id: "Bolos", label: "Bolos", icon: "🍰" },
  { id: "Outros", label: "Outros", icon: "🛒" },
];

const formatCoinInput = (valorAtual: string): string => {
  const apenasNumeros = valorAtual.replace(/\D/g, "");
  if (!apenasNumeros) return "";
  const centavos = Number(apenasNumeros) / 100;
  return centavos.toLocaleString("PT-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const produtoSchema = z.object({
  nome: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres."),
  descricao: z.string().min(10, "Detalhe melhor os ingredientes do seu lanche."),
  categoria: z.string().min(1, "Você precisa selecionar uma categoria acima."),
  precoOriginal: z.string().min(1, "Obrigatório"),
  precoResgate: z.string().min(1, "Obrigatório"),
  localizacao: z.string().min(5, "Informe o endereço completo de retirada."),
  quantidade: z.number({ message: "Obrigatório" }).min(1, "Mínimo de 1."),
  validade: z.number({ message: "Obrigatório" }).min(1, "Mínimo de 1 hora."),
  termosAceitos: z.boolean().refine((val) => val === true, {
    message: "Você precisa aceitar os termos de contrato.",
  }),
}).refine((data) => {
  const pOrig = Number(data.precoOriginal.replace(/\./g, "").replace(",", "."));
  const pResg = Number(data.precoResgate.replace(/\./g, "").replace(",", "."));
  return pResg < pOrig;
}, {
  message: "Atenção: O Preço de Resgate deve ser MENOR que o Preço Normal!",
  path: ["precoResgate"],
});

type ProdutoFormInputs = z.infer<typeof produtoSchema>;
type UsuarioComLocalizacao = {
  localizacao?: string | null
}

export default function CadastrarNovoResgate() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [imagemFiles, setImagemFiles] = useState<File[]>([]);
  const [imagemPreviews, setImagemPreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormInputs>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      quantidade: 1,
      termosAceitos: false,
    },
  });

  const categoriaSelecionada = watch("categoria");

  useEffect(() => {
    type UsuarioComLocalizacao = {
      localizacao?: string | null;
    };
    const enderecoDoUsuario = (session?.user as UsuarioComLocalizacao)?.localizacao;
    if (enderecoDoUsuario) {
      setValue("localizacao", enderecoDoUsuario);
    }
  }, [session, setValue]);

  const onSubmit = async (data: ProdutoFormInputs) => {
    if (imagemFiles.length === 0) {
      appToast.aviso("Foto obrigatória", "Por favor, adicione pelo menos uma foto do lanche.");
      return;
    }

    try {
      const precoOriginalLimpo = data.precoOriginal.replace(/\./g, "").replace(",", ".");
      const precoResgateLimpo = data.precoResgate.replace(/\./g, "").replace(",", ".");

      const serverData = new FormData();
      serverData.append("titulo", data.nome);
      serverData.append("descricao", data.descricao);
      serverData.append("precoOriginal", precoOriginalLimpo);
      serverData.append("precoResgate", precoResgateLimpo);
      serverData.append("quantidade", data.quantidade.toString());

      const horasEmMilissegundos = data.validade * 60 * 60 * 1000;
      const dataExpiraçao = new Date(Date.now() + horasEmMilissegundos);
      serverData.append("dataValidade", dataExpiraçao.toISOString());

      serverData.append("categoria", data.categoria);
      serverData.append("localizacao", data.localizacao);
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
    <div className="bg-[#F6EFE5] min-h-screen flex flex-col font-inter">
      <Header />
      <hr className="opacity-10 border-background-secondary" />

      <main className="py-10 grow">
        <Container>

          <div className="mb-8 text-center md:text-left">
            <div className="text-sm text-[#B87042] mb-3">
              Dashboard {'>'} Resgates {'>'} <span className="font-semibold text-background-secondary">Novo Cadastro</span>
            </div>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-background-secondary">
              Cadastrar Novo Lanche para Resgate
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="bg-[#fcfaf8] border border-[#e8dfd5] shadow-sm rounded-3xl p-6 md:p-10 max-w-5xl mx-auto flex flex-col gap-8 relative overflow-hidden">

            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9774A] rounded-full mix-blend-multiply filter blur-[100px] opacity-5 pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-lg font-bold text-background-secondary mb-4">Informações do Lanche</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

                <InputForm
                  label="Nome do Lanche"
                  type="text"
                  placeholder="Ex: Coxinha Cremosa"
                  icon={<span className="text-xl">🏷️</span>}
                  className="bg-white"
                  {...register("nome")}
                  error={errors.nome?.message}
                />

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-background-secondary/80 font-medium">Adicionar Foto</label>
                  <label className="w-full h-12.5 border-2 border-dashed border-[#D9774A]/50 text-[#D9774A] rounded-xl flex items-center justify-center gap-2 hover:bg-[#D9774A]/10 transition-colors bg-white cursor-pointer relative overflow-hidden">
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
                    {imagemPreviews.length > 0 ? (
                      <span className="font-semibold truncate px-4 text-green-600 text-xs">
                        ✅ {imagemFiles.length} foto(s) adicionada(s)
                      </span>
                    ) : (
                      <>📷 <span>Fazer Upload (Até 3)</span></>
                    )}
                  </label>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-background-secondary/80 font-medium">Descrição detalhada</label>
                  <div className="relative">
                    <span className="absolute top-3 left-3 flex items-center text-gray-400">📝</span>
                    <textarea
                      placeholder="Ingredientes, etc..."
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none transition-all resize-none h-12.5
                        ${errors.descricao ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-[#D9774A] bg-white"}
                      `}
                      {...register("descricao")}
                    />
                  </div>
                  {errors.descricao && <span className="text-xs text-red-500 font-medium">{errors.descricao.message}</span>}
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <h2 className="text-lg font-bold text-background-secondary mb-4">
                Tipo de Produto
                {errors.categoria && <span className="ml-3 text-sm text-red-500 font-normal">*{errors.categoria.message}</span>}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {categoriasDisponiveis.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setValue("categoria", cat.id, { shouldValidate: true })}
                    className={`cursor-pointer flex flex-col items-center justify-center py-4 px-2 rounded-2xl border-2 transition-all duration-300 ${categoriaSelecionada === cat.id
                      ? "bg-[#D9774A] border-[#D9774A] text-white shadow-md transform scale-[1.02]"
                      : "bg-white border-gray-200 text-background-secondary hover:border-[#D9774A]/40 hover:shadow-sm"
                      }`}
                  >
                    <div className="w-full flex justify-start px-3 mb-1">
                      <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${categoriaSelecionada === cat.id ? 'border-white' : 'border-gray-300'}`}>
                        {categoriaSelecionada === cat.id && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                    </div>
                    <span className="text-4xl mb-2 drop-shadow-sm">{cat.icon}</span>
                    <span className="font-medium text-sm">{cat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <h2 className="text-lg font-bold text-background-secondary mb-4">Preços e Descontos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

                <InputForm
                  label="Preço Normalmente (R$)"
                  type="text"
                  inputMode="numeric"
                  placeholder="6,00"
                  icon={<span className="text-gray-400 font-medium">R$</span>}
                  className="bg-gray-50/50 text-gray-500 line-through"
                  {...register("precoOriginal", {
                    onChange: (e) => {
                      e.target.value = formatCoinInput(e.target.value);
                    }
                  })}
                  error={errors.precoOriginal?.message}
                />

                <InputForm
                  label="Preço de Venda (Menor Valor)"
                  type="text"
                  inputMode="numeric"
                  placeholder="3,90"
                  icon={<span className="text-[#2E7D32] font-bold">R$</span>}
                  className="border-2 border-[#4CAF50]/40 bg-[#E8F5E9] font-bold text-background-secondary"
                  {...register("precoResgate", {
                    onChange: (e) => {
                      e.target.value = formatCoinInput(e.target.value);
                    }
                  })}
                  error={errors.precoResgate?.message}
                />

              </div>
            </div>

            <div className="relative z-10">
              <h2 className="text-lg font-bold text-background-secondary mb-4">Inventário e Localização</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

                <div className="md:col-span-2">
                  <div className="flex justify-between items-end mb-1">
                    <label className="text-sm text-background-secondary/80 font-medium opacity-0">Espaçador</label>
                    {(session?.user as UsuarioComLocalizacao)?.localizacao && (
                      <button
                        type="button"
                        onClick={() => setValue("localizacao", (session?.user as UsuarioComLocalizacao).localizacao as string, { shouldValidate: true })}
                        className="text-xs text-[#D9774A] hover:text-[#c4683e] font-semibold flex items-center gap-1 transition-colors bg-[#D9774A]/10 px-2 py-1 rounded-md"
                      >
                        🏠 Meu endereço
                      </button>
                    )}
                  </div>
                  <InputForm
                    label="Localização de Retirada"
                    type="text"
                    placeholder="Ex: Rua das Flores, 123 - Centro"
                    icon={<span className="text-lg">📍</span>}
                    className="bg-white"
                    {...register("localizacao")}
                    error={errors.localizacao?.message}
                  />
                </div>

                <InputForm
                  label="Quantidade à Venda"
                  type="number"
                  min="1"
                  icon={<span className="text-lg">📦</span>}
                  className="bg-white mt-6"
                  {...register("quantidade", { valueAsNumber: true })}
                  error={errors.quantidade?.message}
                />

              </div>
            </div>

            <div className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputForm
                  label="Tempo de Oferta"
                  type="number"
                  min="1"
                  placeholder="Ex: 3"
                  icon={<span className="text-lg">⏱️</span>}
                  rightElement={<span className="text-[#E65100] font-bold text-sm pointer-events-none">Horas</span>}
                  className="bg-[#FFF3E0] font-medium text-[#E65100]"
                  {...register("validade", { valueAsNumber: true })}
                  error={errors.validade?.message}
                />
              </div>
            </div>

            <div className="flex flex-col gap-6 pt-6 border-t border-gray-100 relative z-10">

              <div className="flex flex-col gap-1">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#D9774A] focus:ring-[#D9774A] cursor-pointer"
                    {...register("termosAceitos")}
                  />
                  <span className="text-sm text-background-secondary font-medium leading-relaxed">
                    Li e concordo com os{" "}
                    <a
                      href="/documentos/termos-contrato.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#D9774A] font-bold underline decoration-[#D9774A]/30 hover:decoration-[#D9774A] underline-offset-2 transition-all"
                    >
                      Termos de Uso e o Contrato de Serviço
                    </a>
                    {" "}da Plataforma Salgado Salvo.
                  </span>
                </label>
                {errors.termosAceitos && <span className="text-xs text-red-500 ml-8 font-medium">{errors.termosAceitos.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#D9774A] hover:bg-[#c4683e] text-white font-bold text-lg py-4 rounded-xl shadow-[0_4px_14px_0_rgba(217,119,74,0.39)] hover:shadow-[0_6px_20px_rgba(217,119,74,0.23)] transform transition-all duration-200
                ${isSubmitting ? "bg-gray-400 text-gray-200 cursor-not-allowed transform-none" : ""}
                `}
              >
                {isSubmitting ? "ENVIANDO AO SERVIDOR..." : "PUBLICAR NOVO RESGATE "}
              </button>
            </div>

          </form>
        </Container>
      </main>
    </div>
  );
}