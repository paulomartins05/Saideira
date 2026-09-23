"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { notificarParceiroNovoResgate } from "@/lib/emails"

export async function criarResgate(userId: string, ofertaId: string, quantidadePedida: number = 1) {

  const reqHeaders = await headers()
  const session = await auth.api.getSession({
    headers: reqHeaders
  })

  if (session?.user.role === "PARCEIRO") {
    throw new Error("Contas de Parceiro não podem realizar resgates. Use uma conta de Consumidor.");
  }




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

    notificarParceiroNovoResgate(
      result.ofertaAtual.vendedor.email,
      result.consumidor?.name || "Cliente",
      result.ofertaAtual.titulo,
      result.resgateGerado.codigoPin
    )

    revalidatePath("/perfil")
    return result.resgateGerado
  }
  catch (error: unknown) {
    if (error instanceof Error && error.message === "OFERTA_ESGOTADA") {
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
    return { success: false, mensagem: "Acesso negado. Apenas parceiros podem validar resgates." }
  }
  const resgate = await prisma.resgate.findUnique({
    where: { id: resgateId },
    include: { oferta: true }
  })
  if (!resgate) {
    return { success: false, mensagem: "Resgate não encontrado." }
  }
  if (resgate.oferta.vendedorId !== session.user.id) {
    return { success: false, mensagem: "Você não tem permissão para validar este resgate." }
  }
  const agora = new Date();
  if (resgate.bloqueadoAte && resgate.bloqueadoAte > agora) {
    const minutosRestantes = Math.ceil((resgate.bloqueadoAte.getTime() - agora.getTime()) / 60000);
    return { success: false, mensagem: `Resgate bloqueado por segurança. Tente em ${minutosRestantes} minutos.` }
  }
  if (resgate.codigoPin !== pinDigitado) {
    const tempoBloqueioExpirou = resgate.bloqueadoAte !== null && resgate.bloqueadoAte <= agora;
    const novasTentativas = tempoBloqueioExpirou ? 1 : resgate.tentativasPin + 1;

    const maxTentativas = 3;
    const tempoBloqueioMinutos = 15;

    const updateData: { tentativasPin: number; bloqueadoAte?: Date | null } = {
      tentativasPin: novasTentativas
    };

    if (novasTentativas >= maxTentativas) {
      const dataDesbloqueio = new Date(agora.getTime() + tempoBloqueioMinutos * 60000);
      updateData.bloqueadoAte = dataDesbloqueio;
    } else if (tempoBloqueioExpirou) {
      updateData.bloqueadoAte = null;
    }

    await prisma.resgate.update({
      where: { id: resgateId },
      data: updateData
    });

    if (novasTentativas >= maxTentativas) {
      return { success: false, mensagem: (`PIN incorreto. Resgate bloqueado por ${tempoBloqueioMinutos} minutos por excesso de tentativas.`) }
    } else {
      const tentativasRestantes = maxTentativas - novasTentativas;
      return { success: false, mensagem: (`PIN Incorreto. Você tem mais ${tentativasRestantes} tentativa(s).`) }
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

export async function getCartCount() {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({
    headers: reqHeaders
  })

  if (!session?.user) return 0;

  const count = await prisma.resgate.count({
    where: {
      userId: session.user.id,
      status: "PENDENTE"
    }
  });

  return count;
}


export async function getCartCountByUserId(userId: string) {
  const count = await prisma.resgate.count({
    where: {
      userId: userId,
      status: "PENDENTE"
    }
  });

  return count;
}
