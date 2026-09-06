import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notificarConsumidorExpirando } from "@/lib/emails";

export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const agora = new Date()
    const amanha = new Date(agora.getTime() + 24 * 60 * 60 * 1000)

    try {
        const resgatesExpirando = await prisma.resgate.findMany({
            where: {
                status: "PENDENTE",
                oferta: {
                    dataValidade: {
                        gt: agora,
                        lte: amanha
                    }
                }
            },

            include: {
                user: true,
                oferta: {
                    include: {
                        vendedor: true
                    }
                }
            }
        })

        for (const resgate of resgatesExpirando) {
            if (resgate.user.email) {
                await notificarConsumidorExpirando(
                    resgate.user.email,
                    resgate.oferta.titulo,
                    resgate.oferta.vendedor.name
                );
            }
        }
        return NextResponse.json({ success: true, notificados: resgatesExpirando.length });

    } catch (error) {
        return NextResponse.json({ success: false, error: "Erro ao executar cron" }, { status: 500 });
    }
}