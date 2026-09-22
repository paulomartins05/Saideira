"use client";

import { useState, useRef, Children } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { uploadImagemPerfil } from "@/app/actions/upload";
import { appToast } from "@/lib/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, User, Trash2 } from "lucide-react";
import { cadastroSchema, type CadastroFormInputs } from "@/lib/schemas/cadastro";
import FormGroup from "../componentes/FormGroup";

const formartarCEP = (v: string) => {
  v = v.replace(/\D/g, '');
  v = v.replace(/(\d{5})(\d)/, '$1-$2');
  return v;
}

const formatarTelefone = (v: string) => {
  v = v.replace(/\D/g, "");
  if (v.length <= 10) return v.replace(/^(\d{2})(\d{4})(\d)/, "($1) $2-$3").slice(0, 14);
  return v.replace(/^(\d{2})(\d{5})(\d)/, "($1) $2-$3").slice(0, 15);
};
const formatarCNPJ = (v: string) => {
  v = v.replace(/\D/g, "");
  return v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d)/, "$1.$2.$3/$4-$5").slice(0, 18);
};

export default function CadastroPage() {

  const router = useRouter();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, watch, setError, clearErrors, formState: { errors, isSubmitting } } = useForm<CadastroFormInputs>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: { tipoConta: "consumidor" }
  });
  const tipoConta = watch("tipoConta");


  const buscarCep = async (cepDigitado: string) => {
    const cepLimpo = cepDigitado.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setValue("rua", data.logradouro, { shouldValidate: true });
        setValue("bairro", data.bairro, { shouldValidate: true });
        setValue("cidade", data.localidade, { shouldValidate: true });
        setValue("estado", data.uf, { shouldValidate: true });

        document.getElementById("numero")?.focus();
      }
    } catch (error) {
      console.error("Erro ao buscar CEP", error);
    }
  };

  const handleRemoverFoto = () => {
    setFotoPerfil(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validarCnpjAoVivo = async (cnpjDigitado: string) => {
    const cnpjLimpo = cnpjDigitado.replace(/\D/g, "");
    if (cnpjLimpo.length !== 14) return;
    
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);
      if (!res.ok) {
        setError("cnpj", { type: "manual", message: "CNPJ não encontrado na Receita Federal" });
        return;
      }
      const data = await res.json();
      if (data.descricao_situacao_cadastral !== "ATIVA") {
        setError("cnpj", { type: "manual", message: `CNPJ inativo (Situação: ${data.descricao_situacao_cadastral})` });
        return;
      }
      clearErrors("cnpj");
    } catch (error) {
      console.error("Erro ao validar CNPJ", error);
    }
  };

  const onSubmit = async (data: CadastroFormInputs) => {
    try {
      let fotoUrlCloudinary = undefined;
      if (fotoPerfil) {
        const uploadData = new FormData();
        uploadData.append("imagem", fotoPerfil);
        fotoUrlCloudinary = await uploadImagemPerfil(uploadData) || undefined;
      }

      let latitude = undefined;
      let longitude = undefined;

      if (tipoConta === "parceiro" && data.rua && data.numero && data.cidade) {
        try {
          const query = encodeURIComponent(`${data.numero} ${data.rua}, ${data.cidade}, ${data.estado}, Brazil`);
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
            headers: {
              'User-Agent': 'SalgadoSalvoApp/1.0'
            }
          });
          const geoData = await geoRes.json();
          if (geoData && geoData.length > 0) {
            latitude = parseFloat(geoData[0].lat);
            longitude = parseFloat(geoData[0].lon);
          }
        } catch (e) {
          console.error("Erro ao geocodificar endereço", e);
        }
      }

      const payload = {
        name: data.nome, email: data.email, password: data.senha,
        image: fotoUrlCloudinary, telefone: data.telefone,
        role: tipoConta === "parceiro" ? "PARCEIRO" : "CONSUMIDOR",
        cnpj: tipoConta === "parceiro" ? data.cnpj : undefined,
        tipoNegocio: tipoConta === "parceiro" ? data.tipoNegocio : undefined,
        cep: tipoConta === "parceiro" ? data.cep : undefined, 
        rua: tipoConta === "parceiro" ? data.rua : undefined, 
        numero: tipoConta === "parceiro" ? data.numero : undefined, 
        bairro: tipoConta === "parceiro" ? data.bairro : undefined,
        cidade: tipoConta === "parceiro" ? data.cidade : undefined, 
        estado: tipoConta === "parceiro" ? data.estado : undefined,
        latitude, longitude,
        callbackURL: "/"
      };

      const { error } = await authClient.signUp.email(payload);
      if (error) { appToast.cadastroError(error.message); return; }

      appToast.cadastroSuccess();
      router.push("/");
    } catch (error) {
      appToast.cadastroError("Ocorreu um erro ao processar o cadastro.");
    }
  };

  const inputClass = "w-full bg-paper border border-line rounded-lg px-4 py-3 text-[13.5px] text-night focus:outline-none focus:border-night transition-colors placeholder:text-muted";
  const labelClass = "block text-[13px] font-bold text-night mb-1.5";

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper font-inter p-6">

      <div className="w-full max-w-[480px] bg-card rounded-2xl shadow-sm border border-line p-6 md:p-10 my-10">

        <div className="w-full pb-2">

          <Link href="/" className="inline-flex items-center gap-2 font-display font-extrabold text-[22px] text-night mb-8">
            <span className="w-8 h-8 rounded-lg bg-amber text-night flex items-center justify-center font-display font-extrabold text-base">S</span>
            Saidera
          </Link>

          <h1 className="font-display font-extrabold text-[28px] text-night mb-2">Criar sua conta</h1>
          <p className="text-[13.5px] text-muted mb-8">Preencha seus dados para começar a salvar ofertas.</p>

          <div className="flex bg-card p-1 rounded-xl mb-8 border border-line">
            <button type="button" onClick={() => setValue("tipoConta", "consumidor")} className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-colors ${tipoConta === "consumidor" ? "bg-night text-amber" : "text-muted hover:text-night"}`}>
              Sou Consumidor
            </button>
            <button type="button" onClick={() => setValue("tipoConta", "parceiro")} className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-colors ${tipoConta === "parceiro" ? "bg-night text-amber" : "text-muted hover:text-night"}`}>
              Sou Parceiro
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

            <FormGroup label="Nome Completo" error={errors.nome?.message}>
              <input type="text" placeholder="Seu nome" className={inputClass} {...register("nome")} />
            </FormGroup>

            <FormGroup label="Email" error={errors.email?.message}>
              <input type="email" placeholder="seu@email.com" className={inputClass} {...register("email")} />
            </FormGroup>

            <FormGroup label="Telefone / WhatsApp" error={errors.telefone?.message}>
              <input
                type="tel"
                placeholder="(00) 00000-0000"
                className={inputClass}
                {...register("telefone", {
                  onChange: (e) => e.target.value = formatarTelefone(e.target.value)
                })}
              />
            </FormGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-[18px] h-[18px] text-muted" />
                  </div>
                  <input type={mostrarSenha ? "text" : "password"} placeholder="Senha secreta" className={`${inputClass} pl-[42px] pr-10`} {...register("senha")} />
                  <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-night">
                    {mostrarSenha ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
                {errors.senha && <span className="text-coral text-xs mt-1 block font-medium">{errors.senha.message}</span>}
              </div>

              <div>
                <label className={labelClass}>Confirmar Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-[18px] h-[18px] text-muted" />
                  </div>
                  <input type={mostrarConfirmarSenha ? "text" : "password"} placeholder="Repita a senha" className={`${inputClass} pl-[42px] pr-10`} {...register("confirmarSenha")} />
                  <button type="button" onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-night">
                    {mostrarConfirmarSenha ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
                {errors.confirmarSenha && <span className="text-coral text-xs mt-1 block font-medium">{errors.confirmarSenha.message}</span>}
              </div>
            </div>

            <div className="pt-2">
              <label className={labelClass}>Foto de Perfil <span className="text-muted font-normal text-xs ml-1">(Opcional)</span></label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="file" accept="image/*" ref={fileInputRef}
                  onChange={(e) => setFotoPerfil(e.target.files?.[0] || null)}
                  className="w-full text-[13px] text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[12.5px] file:font-bold file:bg-card file:text-night hover:file:bg-line cursor-pointer border border-line rounded-lg px-2 py-1.5"
                />
                {fotoPerfil && (
                  <button type="button" onClick={handleRemoverFoto} className="p-2 bg-coral/10 text-coral hover:bg-coral hover:text-white rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {tipoConta === "parceiro" && (
              <div className="mt-4 pt-4 border-t border-line">
                <h3 className="font-bold text-night mb-4">Endereço da Loja</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormGroup label="CEP" error={errors.cep?.message}>
                    <input
                      type="text"
                      placeholder="00000-000"
                      className={inputClass}
                      {...register("cep", {
                        onChange: (e) => {
                          const valorFormatado = formartarCEP(e.target.value);
                          e.target.value = valorFormatado;
                          if (valorFormatado.length === 9) buscarCep(valorFormatado);
                        }
                      })}
                    />
                  </FormGroup>
                  <FormGroup label="Rua" error={errors.rua?.message}>
                    <input type="text" placeholder="Rua das Flores" className={inputClass} {...register("rua")} />
                  </FormGroup>
                  <FormGroup label="Número" error={errors.numero?.message}>
                    <input id="numero" type="text" placeholder="100" className={inputClass} {...register("numero")} />
                  </FormGroup>
                  <FormGroup label="Bairro" error={errors.bairro?.message}>
                    <input type="text" placeholder="Centro" className={inputClass} {...register("bairro")} />
                  </FormGroup>
                  <FormGroup label="Cidade" error={errors.cidade?.message}>
                    <input type="text" placeholder="Sua Cidade" className={inputClass} {...register("cidade")} />
                  </FormGroup>
                  <FormGroup label="Estado" error={errors.estado?.message}>
                    <input type="text" placeholder="UF" className={inputClass} {...register("estado")} />
                  </FormGroup>
                </div>
              </div>
            )}

            {tipoConta === "parceiro" && (
              <div className="mt-2 pt-4 border-t border-line animate-in fade-in slide-in-from-top-4">
                <h3 className="font-bold text-night mb-4">Dados da Loja</h3>
                <div className="grid grid-cols-1 gap-4">
                  <FormGroup label="CNPJ" htmlFor="cnpj" error={errors.cnpj?.message}>
                    <input
                      id="cnpj"
                      type="text"
                      placeholder="00.000.000/0000-00"
                      className={inputClass}
                      {...register("cnpj", {
                        onChange: (e) => e.target.value = formatarCNPJ(e.target.value),
                        onBlur: (e) => validarCnpjAoVivo(e.target.value)
                      })}
                    />
                  </FormGroup>
                  <FormGroup label="Tipo de Negócio" error={errors.tipoNegocio?.message}>
                    <select id="tipoNegocio" className={inputClass} {...register("tipoNegocio")}>
                      <option value="">Selecione o tipo do seu negócio</option>
                      <option value="RESTAURANTE">Restaurante</option>
                      <option value="PADARIA">Padaria</option>
                      <option value="MERCADO">Mercado</option>
                      <option value="DOCERIA">Doceria</option>
                      <option value="OUTRO">Outro</option>
                    </select>
                  </FormGroup>
                </div>
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="w-full mt-4 bg-night text-amber font-bold text-[14.5px] py-3.5 rounded-lg hover:bg-night-3 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? "Cadastrando..." : "Finalizar Cadastro"}
            </button>

          </form>

          <p className="mt-8 text-center text-[13px] text-muted font-medium">
            Já tem uma conta? <Link href="/login" className="text-night font-bold hover:underline">Entre agora</Link>
          </p>

        </div>
      </div>

    </div>
  );
}