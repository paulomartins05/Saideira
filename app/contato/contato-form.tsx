"use client";

import { enviarMensagemContato } from "../actions/contato";
import { appToast } from "@/lib/toast";
import Button from "../componentes/button";
import FormGroup from "../componentes/FormGroup";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const contatoSchema = z.object({
  assunto: z.string().min(3, "Selecione um assunto válido"),
  mensagem: z.string().min(10, "Por favor, explique com mais detalhes (mínimo de 10 letras)"),
});

type ContatoFormInputs = z.infer<typeof contatoSchema>;

export default function ContatoForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContatoFormInputs>({
    resolver: zodResolver(contatoSchema),
  });

  const onSubmit = async (data: ContatoFormInputs) => {
    try {
      const formData = new FormData();
      formData.append("assunto", data.assunto);
      formData.append("mensagem", data.mensagem);

      const response = await enviarMensagemContato(formData);

      if (response.success) {
        appToast.sucesso("Mensagem enviada!");
        setIsSuccess(true);
      } else {
        appToast.erro(response.error || "Ocorreu um erro ao enviar a mensagem.");
      }
    } catch (error) {
      appToast.erro("Erro de conexão. Verifique sua internet e tente novamente.");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-6 animate-in zoom-in duration-300">
        <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-night text-lg mb-2">Mensagem Recebida!</h3>
        <p className="text-sm text-muted">
          A nossa equipe já recebeu a sua solicitação e nós te responderemos pelo e-mail cadastrado em até 24 horas.
        </p>
      </div>
    );
  }

  const inputClass = "w-full bg-paper border border-line rounded-lg px-4 py-3 text-[13.5px] text-night focus:outline-none focus:border-night transition-colors placeholder:text-muted";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

      <FormGroup label="Qual o assunto?" error={errors.assunto?.message}>
        <select
          className={inputClass}
          {...register("assunto")}
        >
          <option value="">Selecione uma categoria...</option>
          <option value="Problema com um Resgate">Problema com um Resgate</option>
          <option value="Dúvida sobre o App">Dúvida sobre o App</option>
          <option value="Sugestão de Melhoria">Sugestão de Melhoria</option>
          <option value="Quero ser Parceiro">Quero ser Parceiro</option>
          <option value="Outros">Outros</option>
        </select>
      </FormGroup>

      <FormGroup label="Mensagem" error={errors.mensagem?.message}>
        <textarea
          rows={5}
          className={`${inputClass} resize-y`}
          placeholder="Escreva sua mensagem com detalhes aqui..."
          {...register("mensagem")}
        ></textarea>
      </FormGroup>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 bg-amber hover:bg-amber/90 text-night py-3.5 rounded-xl w-full font-bold flex items-center justify-center gap-2 transition-colors"
      >
        {isSubmitting ? (
          "Enviando..."
        ) : (
          <>
            <Send className="w-4 h-4" />
            Enviar Mensagem
          </>
        )}
      </Button>
    </form>
  );
}
