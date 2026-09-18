import { betterAuth } from "better-auth";
import { prisma } from "./prisma"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Resend } from "resend";


const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,

    sendResetPassword: async ({ user, url }) => {
      try {
        await resend.emails.send({
          from: "Salgado Salvo <naoresponda@resend.dev>",
          to: user.email,
          subject: "Redefinir sua senha - Salgado Salvo",
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h1 style="color: #D9774A;">Olá, ${user.name || "Usuário"}!</h1>
              <p>Você solicitou a redefinição da sua senha no Salgado Salvo.</p>
              <p>Clique no botão abaixo para criar uma nova senha:</p>
              <a href="${url}" style="background-color: #D9774A; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
                Redefinir Senha
              </a>
              <p style="margin-top: 20px; font-size: 12px; color: #888;">Se você não solicitou isso, pode ignorar este e-mail.</p>
            </div>
          `
        })
        console.log(`E-mail de recuperação enviado com sucesso para ${user.email}`);
      } catch (error) {
        console.log("ERRO AO ENVIAR E-MAIL", error)
      }
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "CONSUMIDOR",
        input: false
      },
      telefone: {
        type: "string",
        required: false,
        input: true
      },
      cnpj: {
        type: "string",
        required: false,
        input: true
      },
      localizacao: {
        type: "string",
        required: false,
        input: true
      },
      cep: { type: "string", required: false, input: true },
      rua: { type: "string", required: false, input: true },
      numero: { type: "string", required: false, input: true },
      bairro: { type: "string", required: false, input: true },
      cidade: { type: "string", required: false, input: true },
      estado: { type: "string", required: false, input: true },
      latitude: { type: "number", required: false, input: true },
      longitude: { type: "number", required: false, input: true },
    }
  }
});