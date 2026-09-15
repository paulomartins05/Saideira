import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardProduto from '@/app/componentes/CardProduto';

describe('Componente de Interface: CardProduto', () => {

    const propsPadrao = {
        id: '123',
        nome: 'Bolo de Pote de Chocolate',
        descricao: 'Bolo super recheado',
        preco: 10.5,
        tempoPostagem: '2h',
        imagemUrl: '/bolo.jpg',
    };

    it('deve renderizar normalmente quando o produto tem estoque (quantidade não é 0)', () => {
        render(<CardProduto {...propsPadrao} quantidade={5} />);

        expect(screen.getByText('Bolo de Pote de Chocolate')).toBeDefined();

        const seloEsgotado = screen.queryByText('ESGOTADO');
        expect(seloEsgotado).toBeNull();
    });

    it('deve exibir o selo de ESGOTADO e bloquear o card quando a quantidade for 0', () => {
        const { container } = render(<CardProduto {...propsPadrao} quantidade={0} />);

        const seloEsgotado = screen.getByText('ESGOTADO');
        expect(seloEsgotado).toBeDefined();


        const divCard = container.querySelector('.grayscale');
        expect(divCard).toBeDefined();

        const link = screen.getByRole('link');
        expect(link.className).toContain('pointer-events-none');
    });

});
