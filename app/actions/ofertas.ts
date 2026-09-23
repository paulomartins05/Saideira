"use server";

import { z } from "zod"
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadMultiplasImagens } from "./upload";

const ofertaSchema = z.object({
  titulo: z.string().min(3, "Precisa de 3 caracteres"),
  descricao: z.string().min(5, "Adicione uma descrição mais detalhada"),
  categoria: z.string().min(1, "Categoria é obrigatorio"),
  localizacao: z.string().min(1, "A localização é obrigatório"),
  precoOriginal: z.number().positive("O preço original deve ser maior que zero"),
  precoResgate: z.number().positive("O preço de resgate deve ser maior que zero"),
  quantidade: z.number().int().positive("A quantidade deve ser de pelo menos 1 item"),
  peso: z.number().positive("O peso deve ser maior que zero"),
  dataValidade: z.date().min(new Date(), "A data de validade deve ser no futuro"),
}).refine((dados) => dados.precoResgate < dados.precoOriginal, {
  message: "O preço de resgate deve ser obrigatoriamente menor que o preço original",
  path: ["precoResgate"]
})


export async function criarOferta(formData: FormData) {

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || session.user.role !== "PARCEIRO") {
    return {
      success: false,
      erroGeral: "Acesso negado. Apenas parceiros podem criar ofertas."
    };
  }

  const dadosBrutos = {
    titulo: formData.get("titulo") as string,
    descricao: formData.get("descricao") as string,
    categoria: formData.get("categoria") as string,
    localizacao: formData.get("localizacao") as string,
    precoOriginal: parseFloat((formData.get("precoOriginal") as string).replace(",", ".")),
    precoResgate: parseFloat((formData.get("precoResgate") as string).replace(",", ".")),
    quantidade: parseInt(formData.get("quantidade") as string),
    peso: parseFloat((formData.get("peso") as string).replace(",", ".")),
    dataValidade: new Date(formData.get("dataValidade") as string),
  }


  const validacao = ofertaSchema.safeParse(dadosBrutos)

  if (!validacao.success) {
    return {
      success: false,
      erros: validacao.error.flatten().fieldErrors
    }
  }

  const imagem = formData.getAll("imagem") as File[];
  const arquivosValidos = imagem.filter(file => file.size > 0);

  if (arquivosValidos.length > 3) {
    return {
      success: false,
      erroGeral: "Você só pode enviar no máximo 3 imagens."
    }
  }

  let urlsDasImagens: string[] = [];
  if (arquivosValidos.length > 0) {
    urlsDasImagens = await uploadMultiplasImagens(arquivosValidos);
  }

  let latitude = null;
  let longitude = null;

  try {
    const urlBusca = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(validacao.data.localizacao)}`;
    const resposta = await fetch(urlBusca);
    const dados = await resposta.json();

    if (dados && dados.length > 0) {
      latitude = parseFloat(dados[0].lat);
      longitude = parseFloat(dados[0].lon);
    } else {
      console.log("📍 API de Mapa não encontrou esse endereço:", validacao.data.localizacao);
    }
  } catch (err) {
    console.error("📍 Erro ao buscar localização no Mapa:", err);
  }



  try {
    const novaOferta = await prisma.oferta.create({
      data: {
        titulo: validacao.data.titulo,
        descricao: validacao.data.descricao,
        categoria: validacao.data.categoria,
        localizacao: validacao.data.localizacao,
        precoOriginal: validacao.data.precoOriginal,
        precoResgate: validacao.data.precoResgate,
        quantidade: validacao.data.quantidade,
        dataValidade: validacao.data.dataValidade,
        imagemUrl: urlsDasImagens,
        vendedorId: session.user.id,
        peso: validacao.data.peso,
        latitude: latitude,
        longitude: longitude,
      }
    })

    revalidatePath("/")

    return { success: true, oferta: novaOferta }

  } catch (error) {
    console.error("Erro no Prisma:", error);
    return { success: false, erroGeral: "Erro interno ao salvar a oferta no banco de dados." };
  }
}

export async function alterarStatusOferta(ofertaId: string, novoStatus: boolean) {
  try {


    const reqHeaders = await headers()
    const session = await auth.api.getSession({
      headers: reqHeaders
    })

    if (!session || session.user.role !== "PARCEIRO") {
      throw new Error("Acesso negado. apenas parceiros podem alterar status")
    }

    const ofertaExistente = await prisma.oferta.findUnique({
      where: {
        id: ofertaId,
      }
    })

    if (!ofertaExistente) {
      throw new Error("Oferta não encontrada")
    }

    if (ofertaExistente.vendedorId !== session.user.id) {
      throw new Error("Você não tem permissão para alterar o status desta oferta.");
    }

    await prisma.oferta.update({
      where: {
        id: ofertaId,
      },
      data: {
        ativo: novoStatus,
      }
    })

    revalidatePath("/parceiro/perfil")

    return { success: true };


  } catch (error) {
    console.error("Erro ao alterar status", error)
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Não foi possivel alterar o status da oferta")
  }

}

export async function editarOferta(formData: FormData) {

  const reqHeaders = await headers()
  const session = await auth.api.getSession({
    headers: reqHeaders,
  })

  if (!session || session.user.role !== "PARCEIRO") {
    throw new Error("Acesso negado. apenas parceiros podem editar")
  }

  const id = formData.get("id") as string

  const ofertaExistente = await prisma.oferta.findUnique({
    where: {
      id: id
    }
  })

  if (!ofertaExistente || ofertaExistente.vendedorId !== session.user.id) {
    throw new Error("Oferta não encontrada ou sem permissão.")
  }

  const dadosBrutos = {
    titulo: formData.get("titulo") as string,
    descricao: formData.get("descricao") as string,
    categoria: formData.get("categoria") as string,
    localizacao: formData.get("localizacao") as string,
    precoOriginal: parseFloat((formData.get("precoOriginal") as string).replace(",", ".")),
    precoResgate: parseFloat((formData.get("precoResgate") as string).replace(",", ".")),
    quantidade: parseInt(formData.get("quantidade") as string, 10),
    peso: parseFloat((formData.get("peso") as string).replace(",", ".")),
    dataValidade: new Date(formData.get("dataValidade") as string),
  }

  const validacao = ofertaSchema.safeParse(dadosBrutos)

  if (!validacao.success) {
    return {
      success: false,
      erros: validacao.error.flatten().fieldErrors
    }
  }

  const imagens = formData.getAll("imagem") as File[];
  const arquivosValidos = imagens.filter(file => file.size > 0);

  let urlsFinais = ofertaExistente.imagemUrl;


  if (arquivosValidos.length > 0) {
    if ((arquivosValidos.length) > 3) {
      return {
        success: false,
        erroGeral: "Você só pode enviar no máximo 3 imagens"
      }
    }
    const novasUrls = await uploadMultiplasImagens(arquivosValidos);

    urlsFinais = novasUrls
  }

  await prisma.oferta.update({
    where: {
      id: id
    },
    data: {
      titulo: validacao.data.titulo,
      descricao: validacao.data.descricao,
      categoria: validacao.data.categoria,
      precoOriginal: validacao.data.precoOriginal,
      precoResgate: validacao.data.precoResgate,
      quantidade: validacao.data.quantidade,
      peso: validacao.data.peso,
      dataValidade: validacao.data.dataValidade,
      imagemUrl: urlsFinais,
    }
  })


  revalidatePath("/parceiro/perfil")
  return { success: true }
}

export async function excluirOferta(id: string) {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({
    headers: reqHeaders,
  })

  if (!session || session.user.role !== "PARCEIRO") {
    throw new Error("Acesso negado.")
  }

  const ofertaExistente = await prisma.oferta.findUnique({
    where: { id }
  })

  if (!ofertaExistente || ofertaExistente.vendedorId !== session.user.id) {
    throw new Error("Oferta não encontrada ou sem permissão.")
  }

  await prisma.oferta.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      ativo: false
    }
  })

  revalidatePath("/parceiro/perfil")
  redirect("/parceiro/perfil?aba=produtos")
}