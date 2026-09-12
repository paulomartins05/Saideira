"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { notificarParceiroNovoResgate } from "@/lib/emails"

export async function criarResgate(userId: string, ofertaId: string, quantidadePedida: number = 1) {

  if (quantidadePedida <= 0) {
    throw new Error("A quantidade pedioda deve ser de pelo menos 1 item")
  }

  let redirecionarEsgotado = false

  try {
    const codigoPinGerado = Math.floor(1000 + Math.random() * 9000).toString()

    const result = await prisma.$transaction(async (tx) => {

      const ofertaAtual = await tx.oferta.findUnique({
        where: {
          id: ofertaId
        },
        select: {
          quantidade: true,
          titulo: true,
          vendedor: {
            select: { email: true }
          }
        }
      })

      const consumidor = await tx.user.findUnique({
        where: { id: userId },
        select: { name: true }
      })

      if (!ofertaAtual) {
        throw new Error("A oferta não existe mais")
      }

      if (ofertaAtual.quantidade < quantidadePedida) {
        throw new Error("Estoque insuficiente")
      }


      const ofertaAtualizada = await tx.oferta.update({
        where: {
          id: ofertaId,
          quantidade: { gte: quantidadePedida }
        },
        data: {
          quantidade: { decrement: quantidadePedida }
        }
      }).catch(() => null)


      if (!ofertaAtualizada) {
        throw new Error("OFERTA_ESGOTADA")
      }

      const resgateGerado = await tx.resgate.create({
        data: {
          userId: userId,
          ofertaId: ofertaId,
          codigoPin: codigoPinGerado,
          quantidade: quantidadePedida,
          status: "PENDENTE"
        }
      })

      return { resgateGerado, ofertaAtual, consumidor }
    })

    // Dispara a notificação de forma assíncrona (fire-and-forget)
    notificarParceiroNovoResgate(
      result.ofertaAtual.vendedor.email,
      result.consumidor?.name || "Cliente",
      result.ofertaAtual.titulo,
      result.resgateGerado.codigoPin
    )

    revalidatePath("/perfil")
    return result.resgateGerado
  }
  catch (error: any) {
    if (error.message === "OFERTA_ESGOTADA") {
      redirecionarEsgotado = true;
    } else {
      throw error;
    }
  }
  if (redirecionarEsgotado) {
    redirect("/resgates?erro=esgotado");
  }
}

export async function validarResgate(resgateId: string, pinDigitado: string) {

  const reqHeaders = await headers()
  const session = await auth.api.getSession({
    headers: reqHeaders
  })

  if (!session || session.user.role !== "PARCEIRO") {
    throw new Error("Acesso negado. apenas parceiros podem validar resgates")
  }

  const resgate = await prisma.resgate.findUnique({
    where: {
      id: resgateId
    },
    include: {
      oferta: true
    }
  })

  if (!resgate) {
    throw new Error("Resgate não Encontrado")
  }

  if (resgate.oferta.vendedorId !== session.user.id) {
    throw new Error("Você não pode validar esse resgate")
  }


  const agora = new Date();

  // 1. Trava de tempo: Se está bloqueado e a data de bloqueio AINDA NÃO passou
  if (resgate.bloqueadoAte && resgate.bloqueadoAte > agora) {
    const minutosRestantes = Math.ceil((resgate.bloqueadoAte.getTime() - agora.getTime()) / 60000);
    throw new Error(`Este resgate foi bloqueado por segurança. Tente novamente em ${minutosRestantes} minutos. `)
  }

  if (resgate.codigoPin !== pinDigitado) {
    // 2. O tempo expirou? Se sim, ele ganha uma nova chance (reseta pra 1)
    const tempoBloqueioExpirou = resgate.bloqueadoAte !== null && resgate.bloqueadoAte <= agora;
    const novasTentativas = tempoBloqueioExpirou ? 1 : resgate.tentativasPin + 1;

    const maxTentativas = 3;
    const tempoBloqueioMinutos = 15;

    let updateData: any = {
      tentativasPin: novasTentativas
    };

    // 3. Aplica o castigo novamente se estourar as 3 tentativas
    if (novasTentativas >= maxTentativas) {
      const dataDesbloqueio = new Date(agora.getTime() + tempoBloqueioMinutos * 60000);
      updateData.bloqueadoAte = dataDesbloqueio;
    } else if (tempoBloqueioExpirou) {
      // Libera o bloqueio antigo do banco para não dar conflito futuro
      updateData.bloqueadoAte = null;
    }

    await prisma.resgate.update({
      where: { id: resgateId },
      data: updateData
    });

    if (novasTentativas >= maxTentativas) {
      throw new Error(`PIN incorreto. Resgate bloqueado por ${tempoBloqueioMinutos} minutos por excesso de tentativas.`);
    } else {
      const tentativasRestantes = maxTentativas - novasTentativas;
      throw new Error(`PIN Incorreto. Você tem mais ${tentativasRestantes} tentativa(s).`);
    }
  }
  await prisma.resgate.update({
    where: { id: resgateId },
    data: {
      status: "RETIRADO",
      tentativasPin: 0,
      bloqueadoAte: null
    }
  })
  revalidatePath("/parceiro/perfil")
  return {
    success: true
  }
}

