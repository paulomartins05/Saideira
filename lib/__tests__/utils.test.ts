import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calcularTempoPostagem } from '@/lib/utils';

describe("calcularTempoPostagem()", () => {

    const DATA_FALSA_AGORA = new Date('2026-01-01T12:00:00.000Z');

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(DATA_FALSA_AGORA);
    })

    afterEach(() => {
        vi.useRealTimers();
    });

    it('deve retornar "agora mesmo" se a diferença for 0 minutos', () => {
        const dataCriacao = new Date('2026-01-01T12:00:00.000Z');
        const resultado = calcularTempoPostagem(dataCriacao);
        expect(resultado).toBe('agora mesmo');
    });

    it('deve retornar "agora mesmo" se a data vier um pouquinho do futuro', () => {
        const dataCriacao = new Date('2026-01-01T12:00:10.000Z');
        expect(calcularTempoPostagem(dataCriacao)).toBe('agora mesmo');
    });

    it('deve retornar "X min" para diferenças menores que 60 minutos', () => {
        const dataCriacao = new Date('2026-01-01T11:15:00.000Z');

        expect(calcularTempoPostagem(dataCriacao)).toBe('45 min');
    });
    it('deve retornar "1 h" exata quando bater 60 minutos (Edge Case)', () => {
        const dataCriacao = new Date('2026-01-01T11:00:00.000Z');
        expect(calcularTempoPostagem(dataCriacao)).toBe('1 h');
    });
    it('deve retornar "X h" para diferenças até quase 24h', () => {
        const dataCriacao = new Date('2025-12-31T13:00:00.000Z');
        expect(calcularTempoPostagem(dataCriacao)).toBe('23 h');
    });
    it('deve retornar "X d" quando passar de 24 horas', () => {
        const dataCriacao = new Date('2025-12-31T12:00:00.000Z');
        expect(calcularTempoPostagem(dataCriacao)).toBe('1 d');
    });
    it('deve lidar corretamente com vários dias', () => {
        const dataCriacao = new Date('2025-12-27T08:00:00.000Z');
        expect(calcularTempoPostagem(dataCriacao)).toBe('5 d');
    });
});
