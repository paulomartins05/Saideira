"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { alterarSenha } from "@/app/actions/usuario";
import { appToast } from "@/lib/toast";
import FormGroup from "@/app/componentes/FormGroup";
import { KeyRound, Loader2, Eye, EyeOff } from "lucide-react";

const trocarSenhaSchema = z.object({
  senhaAtual: z.string().min(1, "A senha atual é obrigatória"),
  novaSenha: z.string().min(8, "A nova senha precisa ter no mínimo 8 caracteres"),
  confirmarSenha: z.string().min(1, "Confirme a nova senha"),
}).refine((data) => data.novaSenha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

type TrocarSenhaInputs = z.infer<typeof trocarSenhaSchema>;

export default function FormTrocarSenha() {
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TrocarSenhaInputs>({
    resolver: zodResolver(trocarSenhaSchema),
  });

  const onSubmit = async (data: TrocarSenhaInputs) => {
    try {
      const formData = new FormData();
      formData.append("senhaAtual", data.senhaAtual);
      formData.append("novaSenha", data.novaSenha);
      formData.append("confirmarSenha", data.confirmarSenha);

      await alterarSenha(formData);
      appToast.sucesso("Senha Atualizada!", "Sua senha foi trocada com sucesso.");
      reset();
    } catch (error: any) {
      appToast.erro("Erro ao trocar senha", error.message || "Verifique sua senha atual e tente novamente.");
    }
  };

  const inputClass = "w-full bg-paper border border-line rounded-xl py-3 px-4 text-[14.5px] font-medium text-night placeholder:text-muted focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-colors";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FormGroup label="Senha Atual" error={errors.senhaAtual?.message}>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"><KeyRound className="w-4 h-4" /></span>
          <input type={mostrarSenhaAtual ? "text" : "password"} placeholder="Sua senha atual" className={`${inputClass} pl-10 pr-10`} {...register("senhaAtual")} />
          <button type="button" onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-night transition-colors" aria-label="Alternar visibilidade da senha atual">
            {mostrarSenhaAtual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </FormGroup>

      <FormGroup label="Nova Senha" error={errors.novaSenha?.message}>
        <div className="relative">
          <input type={mostrarNovaSenha ? "text" : "password"} placeholder="Mínimo de 8 caracteres" className={`${inputClass} pr-10`} {...register("novaSenha")} />
          <button type="button" onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-night transition-colors" aria-label="Alternar visibilidade da nova senha">
            {mostrarNovaSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </FormGroup>

      <FormGroup label="Confirmar Nova Senha" error={errors.confirmarSenha?.message}>
        <div className="relative">
          <input type={mostrarConfirmarSenha ? "text" : "password"} placeholder="Repita a nova senha" className={`${inputClass} pr-10`} {...register("confirmarSenha")} />
          <button type="button" onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-night transition-colors" aria-label="Alternar visibilidade da confirmação de senha">
            {mostrarConfirmarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </FormGroup>

      <button type="submit" disabled={isSubmitting} className={`mt-2 bg-night hover:bg-black text-paper font-bold py-4 rounded-xl w-full transition-all ${isSubmitting ? "opacity-50" : ""}`}>
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Atualizando...
          </span>
        ) : (
          "Atualizar Senha"
        )}
      </button>

    </form>
  );
}
