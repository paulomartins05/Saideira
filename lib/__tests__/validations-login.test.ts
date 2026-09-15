import { describe, it, expect } from 'vitest';
import { loginSchema } from '@/lib/validations/login';

describe('Schema de Login', () => {
    it('deve aprovar um email e senha válidos', () => {
        const resultado = loginSchema.safeParse({
            email: 'teste@salgadosalvo.com',
            senha: 'senha-segura-123',
            lembrarMe: true
        });
        expect(resultado.success).toBe(true);
    });

    it('deve reprovar um email em formato incorreto', () => {
        const resultado = loginSchema.safeParse({
            email: 'email.sem.arroba.com',
            senha: 'senha-segura'
        });
        expect(resultado.success).toBe(false);
    });

    it('deve reprovar uma senha com menos de 6 caracteres', () => {
        const resultado = loginSchema.safeParse({
            email: 'teste@email.com',
            senha: '123'
        });
        expect(resultado.success).toBe(false);
    });
});
