import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validarResgate } from '@/app/actions/resgate';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

vi.mock('@/lib/prisma', () => ({
    prisma: {
        resgate: {
            findUnique: vi.fn(),
            update: vi.fn(),
        }
    }
}));

vi.mock('@/lib/emails', () => ({
    notificarParceiroNovoResgate: vi.fn()
}));

vi.mock('@/lib/auth', () => ({
    auth: { api: { getSession: vi.fn() } }
}));

vi.mock('next/headers', () => ({ headers: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

describe('Action: validarResgate', () => {

    beforeEach(() => {
        vi.clearAllMocks();


        (auth.api.getSession as any).mockResolvedValue({
            user: { id: "123", role: "PARCEIRO" }
        });
    });

    it('deve bloquear a validação se o parceiro logado NÃO for o dono da oferta', async () => {


        (prisma.resgate.findUnique as any).mockResolvedValue({
            id: 'resgate-1',
            oferta: { vendedorId: "999" }
        });

        const resultado = await validarResgate('resgate-1', '0000');
        expect(resultado).toEqual({
            success: false,
            mensagem: "Você não tem permissão para validar este resgate."
        });

        expect(prisma.resgate.update).not.toHaveBeenCalled();
    });

    it('deve aceitar o PIN correto e atualizar o status para RETIRADO', async () => {


        (prisma.resgate.findUnique as any).mockResolvedValue({
            id: 'resgate-1',
            codigoPin: '1234',
            tentativasPin: 0,
            bloqueadoAte: null,
            oferta: { vendedorId: "123" }
        });

        const resultado = await validarResgate('resgate-1', '1234');

        expect(resultado.success).toBe(true);

        expect(prisma.resgate.update).toHaveBeenCalledWith({
            where: { id: 'resgate-1' },
            data: {
                status: "RETIRADO",
                tentativasPin: 0,
                bloqueadoAte: null
            }
        });
    });

});
