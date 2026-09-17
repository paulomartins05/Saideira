"use client";

import { enviarMensagemContato } from "../actions/contato";
import { appToast } from "@/lib/toast";
import Button from "../componentes/button";
import FormGroup from "../componentes/FormGroup";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";

const contatoSchema = z.object({
  assunto: z.string().min(3, "O assunto deve ter no mínimo 3 letras"),
  mensagem: z.string().min(10, "Por favor, explique com mais detalhes (mínimo de 10 letras)"),
});

type ContatoFormInputs = z.infer<typeof contatoSchema>;

export default function ContatoForm() {
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
        appToast.sucesso("Sua mensagem foi enviada com sucesso! Retornaremos em breve.");
        reset();
      } else {
        appToast.erro(response.error || "Ocorreu um erro ao enviar a mensagem.");
      }
    } catch (error) {
      appToast.erro("Erro de conexão. Verifique sua internet e tente novamente.");
    }
  };

  const inputClass = "w-full bg-paper border border-line rounded-lg px-4 py-3 text-[13.5px] text-night focus:outline-none focus:border-night transition-colors placeholder:text-muted";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormGroup label="Assunto" error={errors.assunto?.message}>
        <input
          type="text"
          placeholder="Ex: Problema com o resgate"
          className={inputClass}
          {...register("assunto")}
        />
      </FormGroup>

      <FormGroup label="Mensagem" error={errors.mensagem?.message}>
        <textarea
          rows={5}
          className={`${inputClass} resize-none`}
          placeholder="Escreva sua mensagem aqui..."
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
