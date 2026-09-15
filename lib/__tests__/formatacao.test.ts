import { describe, it, expect } from 'vitest';
import { formatCoinInput } from '@/lib/formatacao';

describe('Utilitário de Formatação: formatCoinInput', () => {
    it('deve formatar número inteiro para decimal (1200 -> 12,00)', () => {
        expect(formatCoinInput('1200')).toBe('12,00');
    });

    it('deve formatar número único como centavo (5 -> 0,05)', () => {
        expect(formatCoinInput('5')).toBe('0,05');
    });

    it('deve retornar vazio se a string não tiver números', () => {
        expect(formatCoinInput('abc')).toBe('');
        expect(formatCoinInput('')).toBe('');
    });

    it('deve sobreviver a uma string que já está formatada (re-formatar)', () => {
        expect(formatCoinInput('R$ 15,50')).toBe('15,50');
    });
});
