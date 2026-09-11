import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { MercadoPagoConfig, PreApproval } from "mercadopago"
import { PRECO_ASSINATURA_DESTAQUE } from "@/lib/planos"

export async function POST(req: NextRequest) {
    const reqHeaders = await headers()
    const session = await auth.api.getSession({
        headers: reqHeaders
    })

    if (!session?.user || session.user.role !== "PARCEIRO") {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || ""
    })

    const preApproval = new PreApproval(client);

    try {
        const resposta = await preApproval.create({
            body: {
                reason: "Assinatura Saidera",
                auto_recurring: {
                    frequency: 1,
                    frequency_type: "months",
                    transaction_amount: PRECO_ASSINATURA_DESTAQUE,
                    currency_id: "BRL"
                },
                back_url: process.env.NEXT_PUBLIC_SITE_URL,
                payer_email: session.user.email,
                external_reference: session.user.id,
            }
        })

        return NextResponse.redirect(resposta.init_point!);
    } catch (error) {
        console.error("Erro no Mercado Pago:", error);
        return NextResponse.json({ error: "Erro ao gerar pagamento" }, { status: 500 });

    }

}
