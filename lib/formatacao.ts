export const formatCoinInput = (valorAtual: string): string => {
    const apenasNumeros = valorAtual.replace(/\D/g, "");

    if (!apenasNumeros) return "";

    const centavos = Number(apenasNumeros) / 100;

    return centavos.toLocaleString("PT-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};
