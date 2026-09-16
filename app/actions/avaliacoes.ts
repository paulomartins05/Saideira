"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { success } from "zod"

export async function criarAvaliação(resgateId: string, nota: number, comentario?: string) {
    const reqHeaders = await headers()

    const session = await auth.api.getSession({
        headers: reqHeaders
    })


    if (!session || session.user.role !== "CONSUMIDOR") {
        throw new Error("Acesso negado. Apenas consumidores podem avaliar.")
    }

    if (nota < 1 || nota > 5) {
        throw new Error("A nota deve ser entre 1 e 5")
    }

    const resgate = await prisma.resgate.findUnique({
        where: {
            id: resgateId
        },
        include: {
            oferta: true,
            avaliacao: true
        }
    })

    if (!resgate) {
        throw new Error("Resgate não encontrado")
    }

    if (resgate.userId !== session.user.id) {
        throw new Error("Você não pode avaliar este resgate.")
    }

    if (resgate.avaliacao) {
        throw new Error("Você já avaliou este resgate.")
    }

    if (resgate.status !== "RETIRADO") {
        throw new Error("Você só pode avaliar um resgate após retirar o item")
    }

    await prisma.avaliacao.create({
        data: {
            nota,
            userId: session.user.id,
            parceiroId: resgate.oferta.vendedorId,
            resgateId: resgate.id
        }
    })

    revalidatePath("/resgate")
    return {
        success: true
    }
}

export async function getMediaParceiro(parceiroId: string) {
    const stats = await prisma.avaliacao.aggregate({
        where: { parceiroId },
        _count: { id: true },
        _avg: { nota: true }
    })
    const quantidade = stats._count.id;

    if (quantidade < 10) {
        return {
            visivel: false,
            mensagem: "Novo na plataforma",
            media: null,
            quantidade
        }
    }
    return {
        visivel: true,
        media: stats._avg.nota ? Number(stats._avg.nota.toFixed(1)) : 0,
        quantidade
    }
}

