import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { MercadoPagoConfig, PreApproval } from "mercadopago"

export async function POST(req: NextRequest) {

    try {
        const body = await req.json();
        if (body.type === "subscription_created") {
            const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' })
            const preApproval = new PreApproval(client)

            const assinaturaMP = await preApproval.get({ id: body.data.id })

            const parceiroId = assinaturaMP.external_reference
            const statusMP = assinaturaMP.status

            if (parceiroId) {
                await prisma.assinatura.upsert({
                    where: { parceiroId: parceiroId },
                    update: {
                        status: statusMP === 'authorized' ? 'ATIVA' : 'CANCELADA',
                        provedorPagamentoId: assinaturaMP.id,
                    },
                    create: {
                        parceiroId: parceiroId,
                        status: statusMP === 'authorized' ? 'ATIVA' : 'CANCELADA',
                        provedorPagamentoId: assinaturaMP.id,
                    }
                });
            }
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error("Erro no Webhook:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}