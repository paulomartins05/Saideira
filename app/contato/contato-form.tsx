"use client";

import { useState } from "react";
import { enviarMensagemContato } from "../actions/contato";
import { appToast } from "@/lib/toast";
import Button from "../componentes/button";

export default function ContatoForm() {
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); 
    
    setEnviando(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      const response = await enviarMensagemContato(formData);

      if (response.success) {
        appToast.sucesso("Sua mensagem foi enviada com sucesso! Retornaremos em breve.");
        event.currentTarget.reset(); 
      } else {
        appToast.erro(response.error || "Ocorreu um erro ao enviar a mensagem.");
      }
    } catch (error) {
      appToast.erro("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="assunto" className="block text-sm font-medium mb-1">Assunto</label>
        <input
          id="assunto"
          name="assunto"
          type="text"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#D9774A]"
          placeholder="Ex: Problema com o resgate"
        />
      </div>

      <div>
        <label htmlFor="mensagem" className="block text-sm font-medium mb-1">Mensagem</label>
        <textarea
          id="mensagem"
          name="mensagem"
          required
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#D9774A] resize-none"
          placeholder="Escreva sua mensagem aqui..."
        ></textarea>
      </div>

      <Button type="submit" disabled={enviando} className="mt-2 bg-[#D9774A] hover:bg-[#c4683e] text-white py-3 rounded-xl w-full font-bold">
        {enviando ? "Enviando..." : "Enviar Mensagem"}
      </Button>
    </form>
  );
}
