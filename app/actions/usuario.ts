"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImagemProduto } from "./upload";

export async function atualizarPerfilUsuario(formData: FormData) {
    const reqHeaders = await headers()
    const session = await auth.api.getSession({
        headers: reqHeaders
    })

    if (!session) {
        throw new Error("Você precisa estar logado para realizar essa ação")
    }

    const nome = formData.get("nome") as string;
    const email = formData.get("email") as string;
    const telefone = formData.get("telefone") as string;
    const cnpj = formData.get("cnpj") as string | null;
    const localizacao = formData.get("localizacao") as string | null;
    const imagem = formData.get("imagem") as File | null;


    const rua = formData.get("rua") as string | null;
    const numero = formData.get("numero") as string | null;
    const cep = formData.get("cep") as string | null;
    const bairro = formData.get("bairro") as string | null;
    const cidade = formData.get("cidade") as string | null;
    const estado = formData.get("estado") as string | null;
    const tipoNegocio = formData.get("tipoNegocio") as "RESTAURANTE" | "PADARIA" | "MERCADO" | "DOCERIA" | "OUTRO" | null;

    let novaImagemUrl = undefined
    if (imagem && imagem.size > 0) {
        const url = await uploadImagemProduto(imagem)

        if (url) {
            novaImagemUrl = url
        }
    }

    await auth.api.updateUser({
        headers: reqHeaders,

        body: {
            name: nome,
            ...(novaImagemUrl && { image: novaImagemUrl })
        }
    })

    if (email && email != session.user.email) {

        const emailExistente = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (emailExistente) {
            throw new Error("Email já cadastrado")
        }

        await auth.api.changeEmail({
            headers: reqHeaders,
            body: {
                newEmail: email,
            }
        })
    }

    await prisma.user.update({
        where: {
            id: session.user.id
        },
        data: {
            telefone: telefone,
            ...(cnpj && { cnpj }),
            ...(localizacao && { localizacao }),
            ...(rua && { rua }),
            ...(numero && { numero }),
            ...(cep && { cep }),
            ...(bairro && { bairro }),
            ...(cidade && { cidade }),
            ...(estado && { estado }),
            ...(tipoNegocio && { tipoNegocio })
        }
    })

    const isParceiro = session.user.role === "PARCEIRO"

    revalidatePath(isParceiro ? "/parceiro/perfil" : "/perfil")
}


export async function alterarSenha(formData: FormData) {

    const reqHeaders = await headers()
    const session = await auth.api.getSession({
        headers: reqHeaders
    })

    if (!session) {
        throw new Error("Você precisa estar logado para realizar essa ação")
    }

    const senhaAtual = formData.get("senhaAtual") as string
    const novaSenha = formData.get("novaSenha") as string
    const confirmarNovaSenha = formData.get("confirmarSenha") as string

    if (novaSenha !== confirmarNovaSenha) {
        throw new Error("As senhas não coincidem")
    }

    try {
        await auth.api.changePassword({
            headers: reqHeaders,
            body: {
                newPassword: novaSenha,
                currentPassword: senhaAtual,
                revokeOtherSessions: true
            }
        })
    } catch (error) {
        console.error("Erro ao trocar senha")
        throw new Error("Não conseguimos alterar sua senha. Verifique se a senha atual está correta e tente de novo!")
    }

    revalidatePath("/perfil")
}