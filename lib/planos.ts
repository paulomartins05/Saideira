export const PRECO_ASSINATURA_DESTAQUE = 19.90;

export function formatarPreco(valor: number): string {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

export function deveDestacarOferta(plano: string): boolean {
    return plano.toUpperCase() === 'PREMIUM'
}
