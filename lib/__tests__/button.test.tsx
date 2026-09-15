import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/app/componentes/button';

describe('Dumb Component: Button', () => {

    it('deve renderizar perfeitamente o texto passado para dentro dele', () => {
        render(<Button>Comprar Agora</Button>);

        const botaoEncontrado = screen.getByText('Comprar Agora');

        expect(botaoEncontrado).toBeDefined();

        expect(botaoEncontrado.tagName).toBe('BUTTON');
    });

    it('NÃO deve permitir o clique quando estiver desabilitado (disabled={true})', () => {
        const funcaoCliqueFake = vi.fn();

        render(<Button disabled={true} onClick={funcaoCliqueFake}>Me Clique</Button>);
        const botao = screen.getByText('Me Clique') as HTMLButtonElement;

        fireEvent.click(botao);

        expect(funcaoCliqueFake).not.toHaveBeenCalled();
        expect(botao.disabled).toBe(true);
    });

    it('deve aplicar a classe vermelha quando receber a variante "destructive"', () => {
        render(<Button variant="destructive">Deletar Conta</Button>);
        const botao = screen.getByText('Deletar Conta');

        expect(botao.className).toContain('bg-red-600');
    });

});
