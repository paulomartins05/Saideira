"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { resend } from "@/lib/emails";

export async function enviarMensagemContato(formData: FormData) {
    const reqHeaders = await headers();

    const session = await auth.api.getSession({ headers: reqHeaders });

    if (!session?.user) {
        return { success: false, error: "Usuário não autenticado." };
    }
    const assunto = formData.get("assunto") as string;
    const mensagem = formData.get("mensagem") as string;

    try {
        await resend.emails.send({
            from: "Salgado Salvo <naoresponda@resend.dev>",
            to: "seu-email-real@seudominio.com.br",
            replyTo: session.user.email,
            subject: `Contato: ${assunto}`,
            html: `
        <p><strong>De:</strong> ${session.user.name} (${session.user.email})</p>
        <hr />
        <p>${mensagem.replace(/</g, "&lt;")}</p>
      `
        });

        return { success: true };
    } catch (error) {
        console.error("Erro ao enviar e-mail de contato:", error);
        return { success: false, error: "Falha ao enviar a mensagem. Tente novamente mais tarde." };
    }
}
