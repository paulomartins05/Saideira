import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CadastroPage from '@/app/cadastro/page';

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn() })
}));

describe('Página Interativa: Formulário de Cadastro', () => {

    it('deve revelar os campos de CNPJ apenas ao clicar em "Tenho um negócio"', () => {

        render(<CadastroPage />);


        expect(screen.queryByLabelText(/CNPJ/i)).toBeNull();

        const botaoAbaParceiro = screen.getByText(/Sou Parceiro/i);
        fireEvent.click(botaoAbaParceiro);

        const campoCnpj = screen.getByLabelText(/CNPJ/i);
        expect(campoCnpj).toBeDefined();

        const botaoAbaConsumidor = screen.getByText(/Sou Consumidor/i);
        fireEvent.click(botaoAbaConsumidor);
        expect(screen.queryByLabelText(/CNPJ/i)).toBeNull();
    });

});
