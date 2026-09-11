import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { MercadoPagoConfig, PreApproval } from "mercadopago"
import crypto from "crypto"

export async function POST(req: NextRequest) {

    try {
        const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
        if (!secret) {
            console.error("MERCADOPAGO_WEBHOOK_SECRET não configurado.");
            return NextResponse.json({ error: "Configuração do servidor incorreta" }, { status: 500 });
        }

        const xSignature = req.headers.get("x-signature");
        const xRequestId = req.headers.get("x-request-id");
        if (!xSignature || !xRequestId) {
            return NextResponse.json({ error: "Assinatura ausente" }, { status: 400 });
        }
        const parts = xSignature.split(',');
        let ts = "", v1 = "";
        parts.forEach(part => {
            const [key, value] = part.split('=');
            if (key === 'ts') ts = value;
            if (key === 'v1') v1 = value;
        });


        const body = await req.json();
        const dataId = req.nextUrl.searchParams.get("data.id") || body?.data?.id;

        if (!dataId) {
            return NextResponse.json({ error: "ID não encontrado" }, { status: 400 });
        }
        const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(manifest);
        const calculatedSignature = hmac.digest("hex");
        if (calculatedSignature !== v1) {
            console.error("Assinatura do Mercado Pago inválida. Tentativa de fraude?");
            return NextResponse.json({ error: "Assinatura inválida" }, { status: 403 });
        }


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