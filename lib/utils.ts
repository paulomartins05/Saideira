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

export function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}