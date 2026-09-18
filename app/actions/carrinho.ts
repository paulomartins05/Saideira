"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function cancelarResgate(resgateId: string) {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });

    if (!session?.user) {
        return { success: false, error: "Usuário não autenticado." };
    }

    try {
        const resgate = await prisma.resgate.findUnique({
            where: { id: resgateId, userId: session.user.id },
            include: { oferta: true }
        });

        if (!resgate) {
            return { success: false, error: "Resgate não encontrado." };
        }

        if (resgate.status !== "PENDENTE") {
            return { success: false, error: "Apenas resgates pendentes podem ser cancelados." };
        }

        const agora = new Date();
        const validade = new Date(resgate.oferta.dataValidade);
        const tempoRestanteMs = validade.getTime() - agora.getTime();
        const horasRestantes = tempoRestanteMs / (1000 * 60 * 60);

        if (horasRestantes < 1.5) {
            return { success: false, error: "Você só pode cancelar até 1h 30m antes do vencimento." };
        }

        await prisma.$transaction([
            prisma.resgate.update({
                where: { id: resgate.id },
                data: { status: "CANCELADO" }
            }),
            prisma.oferta.update({
                where: { id: resgate.ofertaId },
                data: { quantidade: { increment: resgate.quantidade } }
            })
        ]);

        revalidatePath("/carrinho");
        return { success: true };
    } catch (error) {
        console.error("Erro ao cancelar resgate:", error);
        return { success: false, error: "Erro interno ao cancelar resgate." };
    }
}
