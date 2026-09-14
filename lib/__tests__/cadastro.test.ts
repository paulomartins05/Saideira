import { describe, it, expect } from 'vitest';
import { cadastroSchema } from '@/lib/schemas/cadastro';

describe('Zod Schema: Cadastro', () => {

    it('deve validar com sucesso um consumidor com dados corretos', () => {
        const dadosValidos = {
            tipoConta: 'consumidor',
            nome: 'João da Silva',
            email: 'joao@email.com',
            senha: 'senha-super-forte-123',
            confirmarSenha: 'senha-super-forte-123',
            telefone: '11999999999',
            cep: '00000000',
            rua: 'Rua das Flores',
            numero: '100',
            bairro: 'Centro',
            cidade: 'São Paulo',
            estado: 'SP'
        };

        const resultado = cadastroSchema.safeParse(dadosValidos);

        expect(resultado.success).toBe(true);
    });

    it('deve reprovar quando as senhas não coincidirem', () => {
        const dadosInvalidos = {
            tipoConta: 'consumidor',
            nome: 'João',
            email: 'joao@email.com',
            senha: 'senha-secreta',
            confirmarSenha: 'senha-diferente',
            telefone: '11999999999',
            cep: '00000000',
            rua: 'Rua',
            numero: '100',
            bairro: 'Centro',
            cidade: 'SP',
            estado: 'SP'
        };

        const resultado = cadastroSchema.safeParse(dadosInvalidos);

        expect(resultado.success).toBe(false);

        if (!resultado.success) {
            const erroMensagem = resultado.error.issues[0].message;
            expect(erroMensagem).toBe('As senhas não coincidem');
        }
    });

    it('deve reprovar se for PARCEIRO mas não informar o CNPJ', () => {
        const dadosParceiroSemCNPJ = {
            tipoConta: 'parceiro',
            nome: 'Padaria do Zé',
            email: 'ze@padaria.com',
            senha: 'senha-secreta',
            confirmarSenha: 'senha-secreta',
            telefone: '11999999999',
            cep: '00000000',
            rua: 'Rua',
            numero: '100',
            bairro: 'Centro',
            cidade: 'SP',
            estado: 'SP',
            tipoNegocio: 'PADARIA'
        };

        const resultado = cadastroSchema.safeParse(dadosParceiroSemCNPJ);

        expect(resultado.success).toBe(false);
        if (!resultado.success) {
            const erroCNPJ = resultado.error.issues.find(e => e.path[0] === 'cnpj');
            expect(erroCNPJ?.message).toBe('CNPJ é obrigatório');
        }
    });

    it('deve reprovar se a senha tiver menos de 6 caracteres', () => {
        const dadosSenhaFraca = {
            tipoConta: 'consumidor',
            nome: 'João',
            email: 'joao@email.com',
            senha: '123',
            confirmarSenha: '123',
            telefone: '11999999999',
            cep: '00000000',
            rua: 'Rua',
            numero: '100',
            bairro: 'Bairro',
            cidade: 'Cidade',
            estado: 'SP'
        };

        const resultado = cadastroSchema.safeParse(dadosSenhaFraca);

        expect(resultado.success).toBe(false);
    });
});
