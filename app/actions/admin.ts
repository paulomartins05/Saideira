"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

export async function buscarParceirosPendentes() {

    const reqHeaders = await headers()
    const session = await auth.api.getSession({
        headers: reqHeaders
    })

    if (!session || session.user.role !== "ADMIN") {
        throw new Error("Acesso negado: apenas administradores podem aprovar")
    }

    const usuarios = await prisma.user.findMany({
        where: {
            cnpj: { not: null },
            role: "CONSUMIDOR"
        },
        select: {
            id: true,
            name: true,
            email: true,
            telefone: true,
            cnpj: true,
        }
    })

    return usuarios
}

export async function aprovarParceiro(usuarioId: string) {

    const reqHeaders = await headers()
    const session = await auth.api.getSession({
        headers: reqHeaders
    })

    if (!session || session.user.role !== "ADMIN") {
        throw new Error("Acesso negado: apenas administradores podem aprovar")
    }

    const usuario = await prisma.user.findUnique({
        where: { id: usuarioId },
    })

    if (!usuario || !usuario.cnpj) {
        throw new Error("Usuário não encontrado ou sem CNPJ para aprovação")
    }

    const cnpjLimpo = usuario.cnpj.replace(/\D/g, '');

    const respostaApi = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`)

    if (!respostaApi.ok) {
        throw new Error("CNPJ inválido ou não encontrado na Receita Federal.");
    }

    const dadosCnpj = await respostaApi.json()

    if (dadosCnpj.descricao_situacao_cadastral !== "ATIVA") {
        throw new Error("A empresa deve estar ativa na Receita Federal para aprovação.")
    }

    await prisma.user.update({
        where: { id: usuarioId },
        data: {
            role: "PARCEIRO"
        }
    })

    revalidatePath('/admin')
}

export async function recusarParceiro(usuarioId: string) {
    const reqHeaders = await headers()
    const session = await auth.api.getSession({
        headers: reqHeaders
    })

    if (!session || session.user.role != "ADMIN") {
        throw new Error("Acesso negado: Apenas administradores podem recusar")
    }

    await prisma.user.update({
        where: { id: usuarioId },
        data: {
            cnpj: null
        }
    })
    revalidatePath('/admin')

}