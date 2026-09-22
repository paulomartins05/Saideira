import { Loader2 } from "lucide-react";
import Container from "@/app/componentes/container";

export default function Loading() {
    return (
        <div className="bg-paper min-h-screen flex flex-col font-inter">
            <hr className="border-line" />
            <main className="py-20 grow">
                <Container>
                    <div className="flex flex-col items-center justify-center gap-4 py-20">
                        <Loader2 className="w-10 h-10 text-amber animate-spin" />
                        <p className="text-muted font-medium">Carregando informações do perfil...</p>
                    </div>
                </Container>
            </main>
        </div>
    );
}
