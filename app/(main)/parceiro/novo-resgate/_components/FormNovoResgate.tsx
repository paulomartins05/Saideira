"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { novoResgateSchema, type NovoResgateFormInputs } from "@/lib/schemas/novo-resgates";
import { juntarEndereco } from "@/lib/utils";
import { formatCoinInput } from "@/lib/formatacao";
import { criarOferta } from "@/app/actions/ofertas";
import { authClient } from "@/lib/auth-client";
import { appToast } from "@/lib/toast";
import {
    Utensils, Archive, Coffee, CupSoda, Croissant, Donut, Cake, Apple,
    Beef, ShoppingCart, Candy, Pizza, Package, Tag, Scale, Store, MapPin
} from "lucide-react";
import { CATEGORIAS_POR_NEGOCIO } from "@/app/constants/categorias";
import FormGroup from "@/app/componentes/FormGroup";

type UsuarioComLocalizacao = {
    localizacao?: string | null
    tipoNegocio?: "RESTAURANTE" | "PADARIA" | "MERCADO" | "DOCERIA" | "OUTRO" | null
}

export default function FormNovoResgate() {
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const tipoNegocioUsuario = (session?.user as UsuarioComLocalizacao)?.tipoNegocio || "OUTRO";
    const categoriasDisponiveis = CATEGORIAS_POR_NEGOCIO[tipoNegocioUsuario as keyof typeof CATEGORIAS_POR_NEGOCIO] || CATEGORIAS_POR_NEGOCIO.OUTRO;

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
            cep?: string | null; rua?: string | null; numero?: string | null;
            bairro?: string | null; cidade?: string | null; estado?: string | null;
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

    const handleBuscarCep = async () => {
        const cepAtual = watch("cep");
        if (!cepAtual) return;
        const cepLimpo = cepAtual.replace(/\D/g, "");
        if (cepLimpo.length !== 8) return;
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const data = await res.json();
            if (data.erro) {
                appToast.erro("CEP Inválido", "Verifique o número e tente novamente.");
                return;
            }
            setValue("rua", data.logradouro, { shouldValidate: true });
            setValue("bairro", data.bairro, { shouldValidate: true });
            setValue("cidade", data.localidade, { shouldValidate: true });
            setValue("estado", data.uf, { shouldValidate: true });
            appToast.sucesso("Endereço encontrado!", "Preenchemos os campos para você.");
        } catch (e) {
            appToast.erro("Erro de conexão", "Falha ao buscar o CEP no ViaCEP.");
        }
    };

    const onSubmit = async (data: NovoResgateFormInputs) => {
        if (imagemFiles.length === 0) {
            appToast.aviso("Foto obrigatória", "Por favor, adicione pelo menos uma foto do produto.");
            return;
        }

        try {
            const precoOriginalLimpo = data.precoOriginal.replace(/\./g, "").replace(",", ".");
            const precoResgateLimpo = data.precoResgate.replace(/\./g, "").replace(",", ".");
            const pesoLimpo = data.peso.replace(/\./g, "").replace(",", ".");

            const localizacaoUnificada = juntarEndereco({
                cep: data.cep, rua: data.rua, numero: data.numero,
                bairro: data.bairro, cidade: data.cidade, estado: data.estado
            });

            const serverData = new FormData();
            serverData.append("titulo", data.nome);
            serverData.append("descricao", data.descricao);
            serverData.append("precoOriginal", precoOriginalLimpo);
            serverData.append("precoResgate", precoResgateLimpo);
            serverData.append("quantidade", data.quantidade.toString());
            serverData.append("peso", pesoLimpo);

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
            router.push("/parceiro/perfil");

        } catch (error: any) {
            appToast.erro("Erro ao publicar", error.message);
        }
    };

    const inputClass = "w-full bg-paper border border-line rounded-xl py-3 px-4 text-[14.5px] font-medium text-night placeholder:text-muted focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-colors";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-line rounded-[24px] p-6 md:p-10 max-w-3xl mx-auto flex flex-col gap-10 shadow-sm">

            <div className="bg-night rounded-2xl p-4 flex items-center gap-4">
                <div className="text-amber pl-2">
                    <Store className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[12px] text-muted font-medium tracking-widest uppercase">Publicando como</span>
                    <span className="text-[15px] text-paper font-bold">
                        {session?.user?.name || "Carregando..."} <span className="text-muted font-normal mx-1">·</span> {
                            tipoNegocioUsuario.charAt(0).toUpperCase() + tipoNegocioUsuario.slice(1).toLowerCase()
                        }
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 border-b border-line pb-3">
                    <div className="w-8 h-8 rounded-full bg-night text-amber flex items-center justify-center font-bold text-sm">1</div>
                    <h2 className="font-display text-[18px] font-bold text-night">O que você está oferecendo</h2>
                </div>

                <FormGroup label="Nome do item" error={errors.nome?.message}>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"><Tag className="w-4 h-4" /></span>
                        <input type="text" placeholder="Ex: Marmita executiva do dia" className={`${inputClass} pl-10`} {...register("nome")} />
                    </div>
                </FormGroup>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormGroup label="Categoria" error={errors.categoria?.message}>
                        <select className={`${inputClass} appearance-none cursor-pointer`} {...register("categoria")}>
                            <option value="">Selecione uma categoria...</option>
                            {categoriasDisponiveis.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>
                    </FormGroup>

                    <FormGroup label="Disponível Até" error={errors.validade?.message}>
                        <input type="time" className={`${inputClass} cursor-pointer`} {...register("validade")} />
                    </FormGroup>
                </div>

                <FormGroup label="Descrição" error={errors.descricao?.message}>
                    <textarea placeholder="Ex: Arroz, feijão, frango grelhado e salada." className={`${inputClass} resize-none h-24`} {...register("descricao")} />
                </FormGroup>

                <FormGroup label="Fotos (Máx. 3)">
                    <label className="group relative cursor-pointer block w-full md:w-[60%]">
                        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                            if (e.target.files) {
                                const files = Array.from(e.target.files).slice(0, 3);
                                setImagemFiles(files);
                                setImagemPreviews(files.map(f => URL.createObjectURL(f)));
                            }
                        }} />
                        <div className="grid grid-cols-3 gap-3">
                            {[0, 1, 2].map((index) => (
                                <div key={index} className={`aspect-square rounded-xl border flex flex-col items-center justify-center transition-all overflow-hidden relative pointer-events-none
                  ${imagemPreviews[index] ? "border-line bg-paper" : "border-dashed border-line bg-paper/50"}`}>
                                    {imagemPreviews[index] ? (
                                        <img src={imagemPreviews[index]} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xl text-muted">{index === 0 ? <Utensils className="w-5 h-5" /> : "+"}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </label>
                </FormGroup>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 border-b border-line pb-3">
                    <div className="w-8 h-8 rounded-full bg-night text-amber flex items-center justify-center font-bold text-sm">2</div>
                    <h2 className="font-display text-[18px] font-bold text-night">Preço, Quantidade e Peso</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <FormGroup label="Preço Normal" error={errors.precoOriginal?.message}>
                        <input type="text" inputMode="numeric" placeholder="R$ 28,00" className={`${inputClass} line-through text-muted`}
                            {...register("precoOriginal", { onChange: (e) => e.target.value = formatCoinInput(e.target.value) })} />
                    </FormGroup>

                    <FormGroup label="Preço de Resgate" error={errors.precoResgate?.message}>
                        <input type="text" inputMode="numeric" placeholder="R$ 12,00" className={`${inputClass} !bg-green-50 !border-green-600 !text-green-700 font-bold focus:!border-green-700`}
                            {...register("precoResgate", { onChange: (e) => e.target.value = formatCoinInput(e.target.value) })} />
                    </FormGroup>
                </div>

                {descontoPercentual > 0 && (
                    <div className="flex items-center gap-3 -mt-2">
                        <div className="bg-coral text-white font-bold py-1 px-2.5 rounded text-[12px]">-{descontoPercentual}% de desconto</div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <FormGroup label="Quantidade Disponível" error={errors.quantidade?.message}>
                        <input type="number" min="1" className={inputClass} {...register("quantidade", { valueAsNumber: true })} />
                    </FormGroup>

                    <FormGroup label="Peso Estimado (em Kg)" error={errors.peso?.message}>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"><Scale className="w-4 h-4" /></span>
                            <input type="text" placeholder="Ex: 0,5 (para 500g)" className={`${inputClass} pl-10`}
                                {...register("peso", { onChange: (e) => e.target.value = e.target.value.replace(/[^0-9,]/g, '') })} />
                        </div>
                    </FormGroup>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 border-b border-line pb-3">
                    <div className="w-8 h-8 rounded-full bg-night text-amber flex items-center justify-center font-bold text-sm">3</div>
                    <h2 className="font-display text-[18px] font-bold text-night">Local de retirada</h2>
                </div>

                <div className="bg-paper border border-line rounded-[20px] p-6 relative">
                    <span className="absolute left-5 top-7 text-muted"><MapPin className="w-5 h-5" /></span>
                    <div className="pl-8 grid grid-cols-2 gap-5">
                        <div className="col-span-2 md:col-span-1"><FormGroup label="CEP" error={errors.cep?.message}><input type="text" className={inputClass} {...register("cep", { onBlur: handleBuscarCep })} /></FormGroup></div>
                        <div className="col-span-2 md:col-span-1"><FormGroup label="Rua" error={errors.rua?.message}><input type="text" className={inputClass} {...register("rua")} /></FormGroup></div>
                        <div className="col-span-2 md:col-span-1"><FormGroup label="Número" error={errors.numero?.message}><input type="text" className={inputClass} {...register("numero")} /></FormGroup></div>
                        <div className="col-span-2 md:col-span-1"><FormGroup label="Bairro" error={errors.bairro?.message}><input type="text" className={inputClass} {...register("bairro")} /></FormGroup></div>
                        <div className="col-span-2 md:col-span-1"><FormGroup label="Cidade" error={errors.cidade?.message}><input type="text" className={inputClass} {...register("cidade")} /></FormGroup></div>
                        <div className="col-span-2 md:col-span-1"><FormGroup label="Estado" error={errors.estado?.message}><input type="text" className={inputClass} {...register("estado")} /></FormGroup></div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-5 pt-4">
                <FormGroup label={<>
                    Li e concordo com os <a href="/documentos/termos-contrato.pdf" target="_blank" className="text-amber-dark underline hover:text-amber-600 transition-colors">termos de publicação</a>.
                </>} error={errors.termosAceitos?.message}>
                    <div className="flex items-center gap-3 mt-1">
                        <input type="checkbox" className="w-5 h-5 rounded border-line text-amber focus:ring-amber cursor-pointer" {...register("termosAceitos")} />
                        <span className="text-[13px] text-muted">Sim, estou de acordo.</span>
                    </div>
                </FormGroup>

                <button type="submit" disabled={isSubmitting} className={`w-full bg-amber hover:bg-amber-dark text-night font-bold text-[15px] py-4 rounded-xl transition-all ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}>
                    {isSubmitting ? "PUBLICANDO..." : "Publicar Oferta"}
                </button>
            </div>
        </form>
    );
}
