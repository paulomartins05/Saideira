import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {

    const reqHeaders = await headers()
    const session = await auth.api.getSession({
        headers: reqHeaders
    })

    if (!session?.user) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const assinatura = await prisma.assinatura.findUnique({
        where: { parceiroId: session.user.id }
    });

    if (!assinatura?.provedorPagamentoId) {
        return NextResponse.redirect(new URL("/parceiro/assinatura", req.url));
    }

    const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' })
    const preApproval = new PreApproval(client)

    try {

        await preApproval.update({
            id: assinatura.provedorPagamentoId,
            body: {
                status: "cancelled"
            }
        })

    } catch (error) {
        console.error("Erro ao cancelar no MP:", error);
        return NextResponse.redirect(new URL("/parceiro/assinatura?erro=cancelamento", req.url));
    }

    await prisma.assinatura.update({
        where: { parceiroId: session.user.id },
        data: { status: "CANCELADA", canceladaEm: new Date() }
    })

    return NextResponse.redirect(new URL("/parceiro/assinatura?sucesso=cancelado", req.url));
}