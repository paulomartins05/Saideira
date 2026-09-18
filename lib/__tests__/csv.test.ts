import { describe, it, expect } from 'vitest';
import { gerarConteudoCSV } from '../csv';

describe('Formatador de CSV: gerarConteudoCSV', () => {

    it('deve proteger pratos que contenham vírgula no nome colocando aspas', () => {
        const resgates = [
            {
                titulo: "Coxinha, Kibe e Pastel",
                precoResgate: 15.50,
                updatedAtStr: "2024-05-10T14:30:00Z"
            }
        ];

        const csv = gerarConteudoCSV(resgates);


        expect(csv).toContain('"Coxinha, Kibe e Pastel"');
    });

    it('deve formatar o preço corretamente para o padrão brasileiro (R$)', () => {
        const resgates = [
            {
                titulo: "Bolo de Cenoura",
                precoResgate: 8.9,
                updatedAtStr: "2024-05-10T14:30:00Z"
            }
        ];

        const csv = gerarConteudoCSV(resgates);

        expect(csv).toContain('8,90');
    });
});
