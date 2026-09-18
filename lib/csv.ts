export type ResgateParaCSV = {
    titulo: string;
    precoResgate: number;
    updatedAtStr: string;
}

export function gerarConteudoCSV(resgates: ResgateParaCSV[]): string {
    const cabecalho = "Data,Hora,Produto,Valor\n";

    const linhas = resgates.map(r => {
        const dataObj = new Date(r.updatedAtStr);
        const data = dataObj.toLocaleDateString('pt-BR');
        const hora = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const produto = `"${r.titulo}"`;

        const valor = r.precoResgate.toFixed(2).replace('.', ',');

        return `${data},${hora},${produto},${valor}`;
    }).join("\n");

    return cabecalho + linhas;
}
