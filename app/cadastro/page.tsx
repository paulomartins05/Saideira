"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { uploadImagemPerfil } from "@/app/actions/upload";

import InputForm from "../componentes/InputForm";
import { appToast } from "@/lib/toast";

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"

import EyeOpenIcon from "../assets/icon/eye-open-login.svg";
import EyeClosedIcon from "../assets/icon/eye-close-login.svg";
import DeleteIcon from "../assets/icon/delete-photo-profile.svg";


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
    ctx.addIssue({
      code: "custom",
      message: "As senhas não coincidem",
      path: ["confirmarSenha"],
    });
  }

  if (data.tipoConta === "parceiro") {
    if (!data.cnpj || data.cnpj.trim() === "") {
      ctx.addIssue({
        code: "custom",
        message: "CNPJ é obrigatório para parceiros",
        path: ["cnpj"],
      });
    }
    if (!data.tipoNegocio || data.tipoNegocio.trim() === "") {
      ctx.addIssue({
        code: "custom",
        message: "Selecione o tipo do seu negócio",
        path: ["tipoNegocio"],
      });
    }
  }
})

type CadastroFormInputs = z.infer<typeof cadastroSchema>


export default function CadastroPage() {
  const router = useRouter();

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CadastroFormInputs>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      tipoConta: "consumidor",
    }
  })

  const tipoConta = watch("tipoConta");

  const handleRemoverFoto = () => {
    setFotoPerfil(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  const onSubmit = async (data: CadastroFormInputs) => {
    try {
      let fotoUrlCloudinary: string | undefined = undefined;

      if (fotoPerfil) {
        const uploadData = new FormData();
        uploadData.append("imagem", fotoPerfil);

        const url = await uploadImagemPerfil(uploadData);
        if (url) {
          fotoUrlCloudinary = url;
        }
      }

      interface CadastroPayload {
        name: string;
        email: string;
        password: string;
        image?: string;
        telefone?: string;
        role?: string;
        cnpj?: string;
        tipoNegocio?: string;
        cep: string;
        rua: string;
        numero: string;
        bairro: string;
        cidade: string;
        estado: string;
        callbackURL?: string;
      }

      const payload: CadastroPayload = {
        name: data.nome,
        email: data.email,
        password: data.senha,
        image: fotoUrlCloudinary,
        telefone: data.telefone,
        role: tipoConta === "parceiro" ? "PARCEIRO" : "CONSUMIDOR",
        cnpj: tipoConta === "parceiro" ? data.cnpj : undefined,
        tipoNegocio: tipoConta === "parceiro" ? data.tipoNegocio : undefined,
        cep: data.cep,
        rua: data.rua,
        numero: data.numero,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
        callbackURL: "/"
      };

      const { error } = await authClient.signUp.email(payload)

      if (error) {
        appToast.cadastroError(error.message);
        return
      }

      appToast.cadastroSuccess()

      router.push("/")

    } catch (error: any) {
      console.error(error);
      appToast.cadastroError("Ocorreu um erro ao processar o cadastro.");
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen flex flex-col items-center justify-center font-inter py-10">

      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-2">
          Crie sua Conta
        </h1>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-xl w-full max-w-lg overflow-hidden">

        <div className="flex w-full border-b border-gray-200">
          <button
            type="button"
            className={`flex-1 py-4 text-center font-medium transition-colors ${tipoConta === "consumidor"
              ? "text-gray-900 border-b-2 border-[#D9774A]"
              : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setValue("tipoConta", "consumidor")}
          >
            Consumidor
          </button>

          <button
            type="button"
            className={`flex-1 py-4 text-center font-medium transition-colors ${tipoConta === "parceiro"
              ? "text-gray-900 border-b-2 border-[#D9774A]"
              : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setValue("tipoConta", "parceiro")}
          >
            Parceiro
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 flex flex-col gap-5">

          <InputForm
            label="Nome Completo"
            type="text"
            required
            {...register("nome")}
            error={errors.nome?.message}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700 font-medium">Foto de Perfil <span className="text-gray-400 font-normal">(OPCIONAL)</span> </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setFotoPerfil(e.target.files[0]);
                  } else {
                    setFotoPerfil(null);
                  }
                }}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#D9774A] focus:border-[#D9774A] outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#fdf3ef] file:text-[#D9774A] hover:file:bg-[#fae6dd] cursor-pointer"
              />

              {fotoPerfil && (
                <button
                  type="button"
                  onClick={handleRemoverFoto}
                  title="Remover Foto Selecionada"
                  className="shrink-0 p-2 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Image
                    src={DeleteIcon}
                    alt="Excluir foto"
                    width={22}
                    height={22}
                    className="opacity-70 hover:opacity-100 transition-opacity"
                  />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <InputForm
              label="Senha"
              type={mostrarSenha ? "text" : "password"}
              required
              {...register("senha")}
              error={errors.senha?.message}
              rightElement={
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="text-gray-400 focus:outline-none"
                >
                  <Image
                    src={mostrarSenha ? EyeClosedIcon : EyeOpenIcon}
                    alt="Alternar visibilidade da senha"
                    width={20}
                    height={20}
                    className="opacity-60 hover:opacity-100 transition-opacity"
                  />
                </button>
              }
            />

            {/* CONFIRMAR SENHA (O erro do Zod (.refine) aponta direto pra cá se divergirem!) */}
            <InputForm
              label="Confirmar Senha"
              type={mostrarConfirmarSenha ? "text" : "password"}
              required
              {...register("confirmarSenha")}
              error={errors.confirmarSenha?.message}
              rightElement={
                <button
                  type="button"
                  onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                  className="text-gray-400 focus:outline-none"
                >
                  <Image
                    src={mostrarConfirmarSenha ? EyeClosedIcon : EyeOpenIcon}
                    alt="Alternar visibilidade da confirmação"
                    width={20}
                    height={20}
                    className="opacity-60 hover:opacity-100 transition-opacity"
                  />
                </button>
              }
            />

          </div>

          {/* EMAIL */}
          <InputForm
            label="Email"
            type="email"
            required
            {...register("email")}
            error={errors.email?.message}
          />

          {/* TELEFONE */}
          <InputForm
            label="Telefone / WhatsApp"
            type="tel"
            required
            {...register("telefone")}
            error={errors.telefone?.message}
          />

          {/* ENDEREÇO (OBRIGATÓRIO PARA TODOS) */}
          <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-4 border-b pb-2">Endereço (Obrigatório)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputForm
                label="CEP"
                type="text"
                required
                placeholder="00000-000"
                {...register("cep" as any)}
                error={(errors as any).cep?.message}
              />
              <InputForm
                label="Rua"
                type="text"
                required
                placeholder="Ex: Rua das Flores"
                {...register("rua" as any)}
                error={(errors as any).rua?.message}
              />
              <InputForm
                label="Número"
                type="text"
                required
                placeholder="Ex: 100"
                {...register("numero" as any)}
                error={(errors as any).numero?.message}
              />
              <InputForm
                label="Bairro"
                type="text"
                required
                placeholder="Ex: Centro"
                {...register("bairro" as any)}
                error={(errors as any).bairro?.message}
              />
              <InputForm
                label="Cidade"
                type="text"
                required
                placeholder="Ex: São Paulo"
                {...register("cidade" as any)}
                error={(errors as any).cidade?.message}
              />
              <InputForm
                label="Estado (UF)"
                type="text"
                required
                placeholder="Ex: SP"
                {...register("estado" as any)}
                error={(errors as any).estado?.message}
              />
            </div>
          </div>

          {tipoConta === "parceiro" && (
            <>
              <div className="flex flex-col gap-1 animate-fadeIn">
                <InputForm
                  label="CNPJ"
                  type="text"
                  required
                  placeholder="00.000.000/0000-00"
                  {...register("cnpj")}
                  error={errors.cnpj?.message}
                />
                <span className="text-xs text-gray-500">(Obrigatório para Parceiros)</span>
              </div>

              <div className="flex flex-col gap-1 animate-fadeIn mt-2">
                <label className="text-sm text-gray-700 font-medium">Tipo de Negócio <span className="text-red-500">*</span></label>
                <select
                  {...register("tipoNegocio")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#D9774A] focus:border-[#D9774A] outline-none transition-colors bg-white"
                  required={tipoConta === "parceiro"}
                >
                  <option value="">Selecione o tipo do seu negócio</option>
                  <option value="RESTAURANTE">Restaurante</option>
                  <option value="PADARIA">Padaria</option>
                  <option value="MERCADO">Mercado</option>
                  <option value="DOCERIA">Doceria</option>
                  <option value="OUTRO">Outro</option>
                </select>
                {errors.tipoNegocio && <span className="text-red-500 text-xs">{errors.tipoNegocio.message}</span>}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-2 font-bold py-3 rounded-lg shadow transition-all ${isSubmitting
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-[#D9774A] hover:bg-[#c5673d] text-white"
              }`}
          >
            {isSubmitting ? "CRIANDO CONTA..." : "FINALIZAR CADASTRO"}
          </button>

          <div className="mt-2 text-center text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-[#D9774A] font-semibold hover:underline">
              Entre agora.
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}