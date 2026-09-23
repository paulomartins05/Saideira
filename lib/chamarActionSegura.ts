import { appToast } from "@/lib/toast";

export async function chamarActionSegura<T>(
    actionPromise: Promise<T>
): Promise<T | null> {
    try {
        const resultado = await actionPromise;
        return resultado;

    } catch (error: any) {

        const isRedirect = error.message?.includes("NEXT_REDIRECT") || error.digest?.includes("NEXT_REDIRECT");
        if (isRedirect) {
            throw error;
        }

        appToast.erro("Atenção", error.message || "Ocorreu um erro inesperado no servidor.");

        return null;
    }
}
