import { describe, it, expect } from 'vitest'
import { formatarPreco, deveDestacarOferta } from '@/lib/planos'

describe('Regras de Negócio: lib/planos.ts', () => {


    describe('formatarPreco()', () => {
        it('deve formatar um número inteiro para Reais (BRL)', () => {
            const valor = 19.9
            const resultado = formatarPreco(valor)
            expect(resultado).toContain('R$')
            expect(resultado).toContain('19,90')
        })
    })

    describe('deveDestacarOferta()', () => {
        it('DADO o plano PREMIUM, ENTÃO a oferta deve receber destaque (true)', () => {
            expect(deveDestacarOferta('PREMIUM')).toBe(true)
        })

        it('DADO um usuário sem plano (BASICO), ENTÃO a oferta não recebe destaque (false)', () => {
            expect(deveDestacarOferta('BASICO')).toBe(false)
        })
    })
})