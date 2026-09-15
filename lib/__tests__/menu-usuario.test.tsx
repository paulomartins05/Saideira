import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MenuUsuario from '@/app/componentes/menu-usuario';

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn(), refresh: vi.fn() })
}));

describe('Componente Interativo: MenuUsuario', () => {

    it('deve alternar a visibilidade do menu (abrir e fechar) ao clicar no Avatar', () => {

        const usuarioFake = {
            id: "1",
            name: "João Silva",
            email: "joao@email.com",
            role: "CONSUMIDOR",
            emailVerified: false,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        render(<MenuUsuario usuario={usuarioFake as any} />);

        expect(screen.queryByText(/SAIR DA CONTA/i)).toBeNull();

        const botaoAvatar = screen.getByTitle('Menu da Conta');
        fireEvent.click(botaoAvatar);

        const botaoSair = screen.getByText(/SAIR DA CONTA/i);
        expect(botaoSair).toBeDefined();

        fireEvent.click(botaoAvatar);

        expect(screen.queryByText(/SAIR DA CONTA/i)).toBeNull();
    });

});
