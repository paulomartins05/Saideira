"use client"
import { useState } from "react"
import { ModalAvaliacao } from "./ModalAvaliacao"

export function BotaoAvaliar({ resgateId }: { resgateId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-[11px] bg-amber text-night px-2 py-1 rounded-md font-bold hover:bg-amber-dark mt-1 inline-block transition-colors"
      >
        Avaliar Pedido
      </button>
      <ModalAvaliacao isOpen={isOpen} onClose={() => setIsOpen(false)} resgateId={resgateId} />
    </>
  )
}
