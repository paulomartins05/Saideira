"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { alterarSenha } from "@/app/actions/usuario";
import { appToast } from "@/lib/toast";
import FormGroup from "@/app/componentes/FormGroup";
import { KeyRound, Loader2 } from "lucide-react";

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
          <input type="password" placeholder="Sua senha atual" className={`${inputClass} pl-10`} {...register("senhaAtual")} />
        </div>
      </FormGroup>

      <FormGroup label="Nova Senha" error={errors.novaSenha?.message}>
        <input type="password" placeholder="Mínimo de 8 caracteres" className={inputClass} {...register("novaSenha")} />
      </FormGroup>

      <FormGroup label="Confirmar Nova Senha" error={errors.confirmarSenha?.message}>
        <input type="password" placeholder="Repita a nova senha" className={inputClass} {...register("confirmarSenha")} />
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
