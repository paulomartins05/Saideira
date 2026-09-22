import { expect, test, vi, describe } from 'vitest';
import { POST } from '@/app/api/webhooks/mercadopago/route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as mercadopagoSignature from '@/lib/mercadopago-signature';
import { PreApproval } from 'mercadopago';

vi.mock('@/lib/prisma', () => ({
    prisma: {
        assinatura: {
            upsert: vi.fn(),
        },
    },
}));

vi.mock('@/lib/mercadopago-signature', () => ({
    verificarAssinaturaMercadoPago: vi.fn(),
}));

vi.mock('mercadopago', () => {
    return {
        MercadoPagoConfig: class { },
        PreApproval: class {
            get = vi.fn().mockResolvedValue({
                id: '12345',
                external_reference: 'parceiro_id_123',
                status: 'authorized'
            })
        }
    };
});

describe('Webhook Mercado Pago', () => {
    test('Deve atualizar a assinatura para ATIVA quando status for authorized', async () => {
        vi.spyOn(mercadopagoSignature, 'verificarAssinaturaMercadoPago').mockReturnValue(true);
        process.env.MERCADOPAGO_WEBHOOK_SECRET = 'secret_test';

        const payload = {
            type: "subscription_created",
            action: "created",
            data: { id: "12345" }
        };

        const req = new NextRequest('http://localhost/api/webhooks/mercadopago', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'x-signature': 'assinatura_valida',
                'x-request-id': 'req_123'
            }
        });

        const res = await POST(req);

        expect(res.status).toBe(200);
        expect(prisma.assinatura.upsert).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { parceiroId: 'parceiro_id_123' },
                update: expect.objectContaining({ status: 'ATIVA' }),
                create: expect.objectContaining({ status: 'ATIVA' })
            })
        );
    });

    test('Deve retornar erro 403 se a assinatura for inválida', async () => {
        vi.spyOn(mercadopagoSignature, 'verificarAssinaturaMercadoPago').mockReturnValue(false);

        const payload = { data: { id: "12345" } };

        const req = new NextRequest('http://localhost/api/webhooks/mercadopago', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'x-signature': 'assinatura_falsa',
                'x-request-id': 'req_123'
            }
        });

        const res = await POST(req);

        expect(res.status).toBe(403);
    });
});
