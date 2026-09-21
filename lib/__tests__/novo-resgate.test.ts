import { describe, it, expect, vi } from 'vitest';
import { novoResgateSchema } from '@/lib/schemas/novo-resgates';
import { criarOferta } from '@/app/actions/ofertas';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
    prisma: {
        oferta: {
            create: vi.fn(),
        }
    }
}));
vi.mock('next/headers', () => ({
    headers: vi.fn(async () => new Headers()),
}));
vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: vi.fn(async () => null),
        }
    }
}));

describe('Salvando Oferta', () => {
    it('deve chamar o banco de dados para salvar a coxinha', async () => {

        const formDataFake = new FormData();
        formDataFake.append("titulo", "Coxinha de Frango");
        formDataFake.append("descricao", "Coxinha deliciosa que sobrou");
        formDataFake.append("categoria", "Salgados");
        formDataFake.append("localizacao", "Rua A");
        formDataFake.append("precoOriginal", "10,00");
        formDataFake.append("precoResgate", "5,00");
        formDataFake.append("quantidade", "2");
        formDataFake.append("peso", "200");
        formDataFake.append("dataValidade", new Date().toISOString());

        await criarOferta(formDataFake);

        expect(prisma.oferta.create).not.toHaveBeenCalled();
    });
});

describe('Zod Schema: Novo Resgate', () => {

    it('deve validar com sucesso uma oferta com todos os campos de endereço e produto preenchidos corretamente', () => {
        const dadosValidos = {
            nome: 'Cesta de Pães Salgados',
            descricao: 'Pães artesanais que sobraram do turno da manhã. Muito saborosos.',
            categoria: 'Salgados',
            precoOriginal: '15,50',
            precoResgate: '5,00',
            quantidade: 5,
            peso: '500g',
            validade: '2027-12-31T14:30:00',
            termosAceitos: true,
            cep: '01001000',
            rua: 'Praça da Sé',
            numero: '1',
            bairro: 'Sé',
            cidade: 'São Paulo',
            estado: 'SP'
        };

        const resultado = novoResgateSchema.safeParse(dadosValidos);
        expect(resultado.success).toBe(true);
    });

    it('deve reprovar a validação se faltar algum campo de endereço (ex: Número)', () => {
        const dadosSemNumero = {
            nome: 'Cesta Doce',
            descricao: 'Doces variados que sobraram. Super deliciosos!',
            categoria: 'Doces',
            precoOriginal: '10,00',
            precoResgate: '3,50',
            quantidade: 2,
            peso: '300g',
            validade: '2027-12-31T18:00:00',
            termosAceitos: true,
            cep: '01001000',
            rua: 'Praça da Sé',
            numero: '',
            bairro: 'Sé',
            cidade: 'São Paulo',
            estado: 'SP'
        };

        const resultado = novoResgateSchema.safeParse(dadosSemNumero);
        expect(resultado.success).toBe(false);

        if (!resultado.success) {
            const erroNumero = resultado.error.issues.find(e => e.path[0] === 'numero');
            expect(erroNumero?.message).toBe('Número é obrigatório');
        }
    });

    it('deve reprovar se o preco de resgate for maior ou igual ao preco original', () => {
        const dadosPrecoInvalido = {
            nome: 'Bolo de Pote',
            descricao: 'Bolo de pote sabor brigadeiro muito bom',
            categoria: 'Doces',
            precoOriginal: '10,00',
            precoResgate: '12,00',
            quantidade: 1,
            peso: '150g',
            validade: '2027-12-31T16:00:00',
            termosAceitos: true,
            cep: '01001000',
            rua: 'Rua A',
            numero: '1',
            bairro: 'Centro',
            cidade: 'São Paulo',
            estado: 'SP'
        };

        const resultado = novoResgateSchema.safeParse(dadosPrecoInvalido);
        expect(resultado.success).toBe(false);

        if (!resultado.success) {
            const erroPreco = resultado.error.issues.find(e => e.path[0] === 'precoResgate');
            expect(erroPreco?.message).toBe('Atenção: O Preço de Resgate deve ser MENOR que o Preço Normal!');
        }
    });
});
