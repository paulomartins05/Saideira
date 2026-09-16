"use server"

import { prisma } from "@/lib/prisma"


export async function getMetricasParceiro(parceiroId: string) {

    const primeiroDiaDoMes = new Date();
    primeiroDiaDoMes.setDate(1)
    primeiroDiaDoMes.setUTCHours(0, 0, 0, 0)

    const resgatesDoMes = await prisma.resgate.findMany({
        where: {
            status: "RETIRADO",
            oferta: {
                vendedorId: parceiroId
            },
            updatedAt: {
                gte: primeiroDiaDoMes
            }
        },
        include: {
            oferta: true
        }
    })

    const vendasNoMes = resgatesDoMes.reduce((acc, resgate) => acc + resgate.quantidade, 0)


    const receitaNoMes = resgatesDoMes.reduce((acc, resgate) => {
        return acc + (resgate.oferta.precoResgate * resgate.quantidade)
    }, 0)

    const topOfertas = await prisma.oferta.findMany({
        where: {
            vendedorId: parceiroId
        },
        include: {
            _count: {
                select: {
                    resgates: {
                        where: {
                            status: "RETIRADO"
                        }
                    }
                }
            },
        },
        orderBy: {
            resgates: {
                _count: "desc"
            }
        },
        take: 3
    })

    return { vendasNoMes, receitaNoMes, topOfertas }

}