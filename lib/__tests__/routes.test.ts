import { describe, it, expect } from 'vitest';
import { getHeaderRoutes } from '../routes';

describe('Motor de Rotas: getHeaderRoutes', () => {

    it('deve retornar rotas públicas quando o usuário NÃO estiver logado', () => {
        const rotas = getHeaderRoutes(null);

        expect(rotas).toHaveLength(3);

        const temOfertas = rotas.some(rota => rota.label === "Ofertas");
        expect(temOfertas).toBe(true);
    });

    it('deve retornar rotas de consumidor quando o usuário for um comprador normal', () => {
        const rotas = getHeaderRoutes("USER");

        const temOfertas = rotas.some(rota => rota.label === "Ofertas");
        expect(temOfertas).toBe(true);
    });

    it('deve bloquear a rota de Ofertas e mostrar o Painel quando for Parceiro B2B', () => {
        const rotas = getHeaderRoutes("PARCEIRO");

        const temOfertas = rotas.some(rota => rota.label === "Ofertas");
        expect(temOfertas).toBe(false);

        const temPainel = rotas.some(rota => rota.label === "Painel do Parceiro");
        expect(temPainel).toBe(true);
    });
});
