"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getResend } from "@/lib/emails";
import { prisma } from "@/lib/prisma";

export async function enviarMensagemContato(formData: FormData) {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });

    if (!session?.user) {
        return { success: false, error: "Usuário não autenticado." };
    }

    const userId = session.user.id;
    const assunto = formData.get("assunto") as string;
    const mensagem = formData.get("mensagem") as string;

    try {
        const ultimaMensagem = await prisma.contato.findFirst({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' }
        });

        if (ultimaMensagem) {
            const agora = new Date();
            const diferencaEmMs = agora.getTime() - ultimaMensagem.createdAt.getTime();
            const minutosPassados = Math.floor(diferencaEmMs / 1000 / 60);

            if (minutosPassados < 5) {
                return {
                    success: false,
                    error: "Calma aí! Você já enviou uma mensagem recentemente. Por favor, aguarde 5 minutos para enviar outra."
                };
            }
        }

        await prisma.contato.create({
            data: { userId, assunto, mensagem }
        });

        const emailDestino = process.env.ADMIN_EMAIL;
        if (!emailDestino) {
            throw new Error("ADMIN_EMAIL não configurado no .env");
        }

        await getResend().emails.send({
            from: "Salgado Salvo <naoresponda@resend.dev>",
            to: emailDestino,
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
        console.error("Erro ao processar contato:", error);
        return { success: false, error: "Falha ao enviar a mensagem. Tente novamente mais tarde." };
    }
}
