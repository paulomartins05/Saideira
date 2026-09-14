"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { uploadImagemPerfil } from "@/app/actions/upload";
import { appToast } from "@/lib/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, User, Trash2 } from "lucide-react";

const cadastroSchema = z.object({
  tipoConta: z.enum(["consumidor", "parceiro"]),
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().min(1, "O e-mail é obrigatório.").email("Digite um e-mail válido."),
  senha: z.string().min(6, "A senha deve possuir 6 caracteres"),
  confirmarSenha: z.string().min(1, "Confirme sua senha"),
  telefone: z.string().min(8, "Digite um número de telefone válido"),
  localizacao: z.string().optional(),
  cnpj: z.string().optional(),
  tipoNegocio: z.string().optional(),
  cep: z.string().min(8, "CEP inválido"),
  rua: z.string().min(1, "Rua é obrigatória"),
  numero: z.string().min(1, "Número é obrigatório"),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().min(2, "Estado é obrigatório"),
}).superRefine((data, ctx) => {
  if (data.senha !== data.confirmarSenha) {
    ctx.addIssue({ code: "custom", message: "As senhas não coincidem", path: ["confirmarSenha"] });
  }
  if (data.tipoConta === "parceiro") {
    if (!data.cnpj || data.cnpj.trim() === "") ctx.addIssue({ code: "custom", message: "CNPJ é obrigatório", path: ["cnpj"] });
    if (!data.tipoNegocio || data.tipoNegocio.trim() === "") ctx.addIssue({ code: "custom", message: "Selecione o tipo do negócio", path: ["tipoNegocio"] });
  }
});
type CadastroFormInputs = z.infer<typeof cadastroSchema>;

export default function CadastroPage() {
  const router = useRouter();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<CadastroFormInputs>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: { tipoConta: "consumidor" }
  });
  const tipoConta = watch("tipoConta");

  const handleRemoverFoto = () => {
    setFotoPerfil(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: CadastroFormInputs) => {
    try {
      let fotoUrlCloudinary = undefined;
      if (fotoPerfil) {
        const uploadData = new FormData();
        uploadData.append("imagem", fotoPerfil);
        fotoUrlCloudinary = await uploadImagemPerfil(uploadData) || undefined;
      }

      const payload = {
        name: data.nome, email: data.email, password: data.senha,
        image: fotoUrlCloudinary, telefone: data.telefone,
        role: tipoConta === "parceiro" ? "PARCEIRO" : "CONSUMIDOR",
        cnpj: tipoConta === "parceiro" ? data.cnpj : undefined,
        tipoNegocio: tipoConta === "parceiro" ? data.tipoNegocio : undefined,
        cep: data.cep, rua: data.rua, numero: data.numero, bairro: data.bairro,
        cidade: data.cidade, estado: data.estado, callbackURL: "/"
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

            <div>
              <label className={labelClass}>Nome Completo</label>
              <input type="text" placeholder="Seu nome" className={inputClass} {...register("nome")} />
              {errors.nome && <span className="text-coral text-xs mt-1 block font-medium">{errors.nome.message}</span>}
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input type="email" placeholder="seu@email.com" className={inputClass} {...register("email")} />
              {errors.email && <span className="text-coral text-xs mt-1 block font-medium">{errors.email.message}</span>}
            </div>

            <div>
              <label className={labelClass}>Telefone / WhatsApp</label>
              <input type="tel" placeholder="(00) 00000-0000" className={inputClass} {...register("telefone")} />
              {errors.telefone && <span className="text-coral text-xs mt-1 block font-medium">{errors.telefone.message}</span>}
            </div>

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

            {/* ENDEREÇO */}
            <div className="mt-4 pt-4 border-t border-line">
              <h3 className="font-bold text-night mb-4">Endereço de Entrega</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>CEP</label>
                  <input type="text" placeholder="00000-000" className={inputClass} {...register("cep")} />
                  {errors.cep && <span className="text-coral text-xs mt-1 block">{errors.cep.message}</span>}
                </div>
                <div>
                  <label className={labelClass}>Rua</label>
                  <input type="text" placeholder="Rua das Flores" className={inputClass} {...register("rua")} />
                  {errors.rua && <span className="text-coral text-xs mt-1 block">{errors.rua.message}</span>}
                </div>
                <div>
                  <label className={labelClass}>Número</label>
                  <input type="text" placeholder="100" className={inputClass} {...register("numero")} />
                  {errors.numero && <span className="text-coral text-xs mt-1 block">{errors.numero.message}</span>}
                </div>
                <div>
                  <label className={labelClass}>Bairro</label>
                  <input type="text" placeholder="Centro" className={inputClass} {...register("bairro")} />
                  {errors.bairro && <span className="text-coral text-xs mt-1 block">{errors.bairro.message}</span>}
                </div>
                <div>
                  <label className={labelClass}>Cidade</label>
                  <input type="text" placeholder="Sua Cidade" className={inputClass} {...register("cidade")} />
                  {errors.cidade && <span className="text-coral text-xs mt-1 block">{errors.cidade.message}</span>}
                </div>
                <div>
                  <label className={labelClass}>Estado</label>
                  <input type="text" placeholder="UF" className={inputClass} {...register("estado")} />
                  {errors.estado && <span className="text-coral text-xs mt-1 block">{errors.estado.message}</span>}
                </div>
              </div>
            </div>

            {/* DADOS DE PARCEIRO */}
            {tipoConta === "parceiro" && (
              <div className="mt-2 pt-4 border-t border-line animate-in fade-in slide-in-from-top-4">
                <h3 className="font-bold text-night mb-4">Dados da Loja</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={labelClass}>CNPJ</label>
                    <input type="text" placeholder="00.000.000/0000-00" className={inputClass} {...register("cnpj")} />
                    {errors.cnpj && <span className="text-coral text-xs mt-1 block">{errors.cnpj.message}</span>}
                  </div>
                  <div>
                    <label className={labelClass}>Tipo de Negócio</label>
                    <select className={inputClass} {...register("tipoNegocio")}>
                      <option value="">Selecione o tipo do seu negócio</option>
                      <option value="RESTAURANTE">Restaurante</option>
                      <option value="PADARIA">Padaria</option>
                      <option value="MERCADO">Mercado</option>
                      <option value="DOCERIA">Doceria</option>
                      <option value="OUTRO">Outro</option>
                    </select>
                    {errors.tipoNegocio && <span className="text-coral text-xs mt-1 block">{errors.tipoNegocio.message}</span>}
                  </div>
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