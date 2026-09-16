"use server"

import { prisma } from "@/lib/prisma"

export async function getMetricasAdmin() {

    const VALOR_ASSINATURA = 19.90;

    const assinaturasAtivas = await prisma.assinatura.count({
        where: { status: "ATIVA" }
    });

    const mrr = assinaturasAtivas * VALOR_ASSINATURA;

    const totalParceiros = await prisma.user.count({
        where: { role: "PARCEIRO" }
    });

    const parceirosInativos = totalParceiros - assinaturasAtivas;

    const primeiroDiaDoMes = new Date();
    primeiroDiaDoMes.setDate(1);
    primeiroDiaDoMes.setHours(0, 0, 0, 0);

    const resgatesDoMes = await prisma.resgate.findMany({
        where: {
            status: "RETIRADO",
            updatedAt: { gte: primeiroDiaDoMes }
        },
        include: { oferta: true }
    });

    const gmv = resgatesDoMes.reduce((acc, resgate) => {
        return acc + (resgate.oferta.precoResgate * resgate.quantidade);
    }, 0);

    const clientesUnicosDoMes = new Set(resgatesDoMes.map(r => r.userId)).size;

    return {
        assinaturasAtivas,
        parceirosInativos,
        totalParceiros,
        mrr,
        gmv,
        clientesUnicosDoMes
    }
}
