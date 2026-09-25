import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appToast } from '@/lib/toast';
import { toast } from 'sonner';


vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    }
}));

describe('Notificações Globais (appToast)', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve disparar toast.success genérico corretamente', () => {
        appToast.sucesso('Deu certo!', 'Tudo ocorreu bem.');

        expect(toast.success).toHaveBeenCalledTimes(1);

        expect(toast.success).toHaveBeenCalledWith('Deu certo!', {
            description: 'Tudo ocorreu bem.',
        });
    });

    it('deve disparar toast.error genérico corretamente', () => {
        appToast.erro('Falhou', 'Ocorreu um erro.');

        expect(toast.error).toHaveBeenCalledTimes(1);
        expect(toast.error).toHaveBeenCalledWith('Falhou', {
            description: 'Ocorreu um erro.',
        });
    });

    it('deve disparar loginSuccess com o nome do usuário', () => {
        appToast.loginSuccess('Paulo');

        expect(toast.success).toHaveBeenCalledWith('Login efetuado com sucesso', {
            description: 'Bem-vindo de volta, Paulo!',
        });
    });

    it('deve disparar loginSuccess genérico se o nome não for passado', () => {
        appToast.loginSuccess();

        expect(toast.success).toHaveBeenCalledWith('Login efetuado com sucesso', {
            description: 'Bem-vindo de volta ao Saideira!',
        });
    });
});
