"use client"
import { useState } from "react"
import { Star, X } from "lucide-react"
import { criarAvaliação } from "@/app/actions/avaliacoes"
import { appToast } from "@/lib/toast"

interface ModalAvaliacaoProps {
    isOpen: boolean;
    onClose: () => void;
    resgateId: string;
}

export function ModalAvaliacao({ isOpen, onClose, resgateId }: ModalAvaliacaoProps) {
    const [nota, setNota] = useState(0)
    const [comentario, setComentario] = useState("")
    const [enviando, setEnviando] = useState(false)
    const [sucesso, setSucesso] = useState(false)

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (nota === 0) {
            return appToast.aviso("Faltou a nota!", "Por favor, selecione quantas estrelas o parceiro merece.")
        }

        setEnviando(true)
        try {
            await criarAvaliação(resgateId, nota, comentario)
            setSucesso(true)
            setTimeout(() => {
                onClose()
            }, 2000)
        } catch (error: any) {
            appToast.erro("Ops, deu um problema", error.message)
        } finally {
            setEnviando(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-card border border-line rounded-[24px] p-6 max-w-sm w-full relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted hover:text-coral transition-colors"
                >
                    <X size={20} />
                </button>

                {sucesso ? (
                    <div className="text-center py-6">
                        <h3 className="text-xl font-display font-bold text-green-600 mb-2">Avaliação Enviada!</h3>
                        <p className="text-muted text-[14px]">Muito obrigado por ajudar a manter a qualidade da comunidade.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl font-display font-bold text-night">Como foi a sua experiência?</h3>
                        <p className="text-[14px] text-muted">Deixe uma nota para o parceiro que preparou este lanche.</p>

                        <div className="flex gap-2 justify-center py-3">
                            {[1, 2, 3, 4, 5].map((valor) => (
                                <Star
                                    key={valor}
                                    onClick={() => setNota(valor)}
                                    className={`w-9 h-9 cursor-pointer transition-all hover:scale-110 ${nota >= valor ? "fill-amber text-amber" : "text-line hover:text-amber/50"
                                        }`}
                                />
                            ))}
                        </div>

                        <textarea
                            className="bg-paper border border-line p-4 rounded-xl w-full text-[14px] text-night placeholder:text-muted outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-colors resize-none"
                            placeholder="Deixe um comentário (opcional)"
                            rows={3}
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                        />

                        <button
                            onClick={handleSubmit}
                            disabled={enviando || nota === 0}
                            className={`bg-amber text-night py-3.5 mt-2 rounded-xl font-bold transition-all hover:bg-amber-dark ${(enviando || nota === 0) ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            {enviando ? "ENVIANDO..." : "Enviar Avaliação"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
