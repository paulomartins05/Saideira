import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calcularTempoPostagem(dataCriacao: Date): string {
  const agora = new Date();
  const diferencaEmMilissegundos = agora.getTime() - dataCriacao.getTime();
  const diferencaEmMinutos = Math.floor(diferencaEmMilissegundos / (1000 * 60));
  const diferencaEmHoras = Math.floor(diferencaEmMinutos / 60);

  if (diferencaEmMinutos < 60) {
    return diferencaEmMinutos <= 0 ? "agora mesmo" : `${diferencaEmMinutos} min`;
  }

  if (diferencaEmHoras < 24) {
    return `${diferencaEmHoras} h`;
  }

  return `${Math.floor(diferencaEmHoras / 24)} d`;
}

export function juntarEndereco(dados: { rua: string, numero: string, bairro: string, cidade: string, estado: string, cep: string }) {
  return `${dados.rua}, ${dados.numero} - ${dados.bairro}, ${dados.cidade} - ${dados.estado}, CEP: ${dados.cep}`;
}