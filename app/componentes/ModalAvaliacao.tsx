"use client"
import { useState } from "react"
import { Star, X } from "lucide-react"
import { criarAvaliação } from "@/app/actions/avaliacoes"

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
        if (nota === 0) return alert("Por favor, selecione uma nota nas estrelas.")

        setEnviando(true)
        try {
            await criarAvaliação(resgateId, nota, comentario)
            setSucesso(true)
            setTimeout(() => {
                onClose()
            }, 2000)
        } catch (error: any) {
            alert(error.message)
        } finally {
            setEnviando(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full relative shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                    <X size={20} />
                </button>

                {sucesso ? (
                    <div className="text-center py-6">
                        <h3 className="text-lg font-bold text-green-600 mb-2">Avaliação Enviada!</h3>
                        <p className="text-gray-600 text-sm">Muito obrigado por ajudar a manter a qualidade da comunidade.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-gray-900">Como foi a sua experiência?</h3>
                        <p className="text-sm text-gray-500">Deixe uma nota para o parceiro que preparou este lanche.</p>

                        <div className="flex gap-2 justify-center py-2">
                            {[1, 2, 3, 4, 5].map((valor) => (
                                <Star
                                    key={valor}
                                    onClick={() => setNota(valor)}
                                    className={`w-8 h-8 cursor-pointer transition-colors ${nota >= valor ? "fill-yellow-400 text-yellow-400" : "text-gray-200 hover:text-yellow-200"
                                        }`}
                                />
                            ))}
                        </div>

                        <textarea
                            className="border p-3 rounded-md w-full text-sm outline-none focus:border-primary"
                            placeholder="Deixe um comentário (opcional)"
                            rows={3}
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                        />

                        <button
                            onClick={handleSubmit}
                            disabled={enviando || nota === 0}
                            className="bg-primary text-primary-foreground py-2 mt-2 rounded-md font-semibold transition-opacity disabled:opacity-50"
                        >
                            {enviando ? "Enviando..." : "Enviar Avaliação"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
