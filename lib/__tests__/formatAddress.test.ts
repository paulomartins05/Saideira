import { describe, it, expect } from 'vitest';
import { juntarEndereco } from '@/lib/utils';

describe('Utilitário: Juntar Endereço', () => {

    it('deve formatar o endereço em uma string única no formato correto', () => {
        const dadosDoFormulario = {
            cep: '12345-678',
            rua: 'Rua das Flores',
            numero: '100',
            bairro: 'Jardim Primavera',
            cidade: 'Campinas',
            estado: 'SP'
        };

        const stringUnica = juntarEndereco(dadosDoFormulario);

        expect(stringUnica).toBe('Rua das Flores, 100 - Jardim Primavera, Campinas - SP, CEP: 12345-678');
    });

});
