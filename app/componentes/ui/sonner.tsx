"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { Check, Info, AlertTriangle, XCircle, Loader2 } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          // Base do Toast (Igual ao HTML: fundo escuro, borda lateral)
          toast: "group toast group-[.toaster]:bg-night group-[.toaster]:text-white group-[.toaster]:border-y-0 group-[.toaster]:border-r-0 group-[.toaster]:border-l-[3px] group-[.toaster]:border-l-muted group-[.toaster]:rounded-xl group-[.toaster]:shadow-[0_14px_30px_-12px_rgba(0,0,0,0.45)] group-[.toaster]:p-3.5 group-[.toaster]:pl-3",
          description: "group-[.toast]:text-[#9CA1AE] group-[.toast]:text-xs group-[.toast]:mt-1",
          title: "group-[.toast]:text-[13px] group-[.toast]:font-bold group-[.toast]:text-white",

          // Estilo base do ícone bolinha
          icon: "group-[.toast]:w-[26px] group-[.toast]:h-[26px] group-[.toast]:rounded-full group-[.toast]:flex group-[.toast]:items-center group-[.toast]:justify-center group-[.toast]:bg-night-3 group-[.toast]:text-[#C6CAD3]",

          // Botão de fechar
          closeButton: "group-[.toast]:bg-transparent group-[.toast]:text-[#6B7080] group-[.toast]:hover:text-white group-[.toast]:border-0",

          // Variações de Cor e Ícone dependendo do Tipo (Sucesso, Erro, etc)
          success: "group-[.toaster]:border-l-success group-[.toast]:[&_[data-icon]]:bg-success-bg group-[.toast]:[&_[data-icon]]:text-success",
          error: "group-[.toaster]:border-l-coral group-[.toast]:[&_[data-icon]]:bg-[#FBE4E0] group-[.toast]:[&_[data-icon]]:text-coral",
          warning: "group-[.toaster]:border-l-amber group-[.toast]:[&_[data-icon]]:bg-[#FBF0DA] group-[.toast]:[&_[data-icon]]:text-[#D68F1F]",
          info: "group-[.toaster]:border-l-info group-[.toast]:[&_[data-icon]]:bg-info-bg group-[.toast]:[&_[data-icon]]:text-info",
        },
      }}
      icons={{
        success: <Check className="w-3.5 h-3.5" />,
        info: <Info className="w-3.5 h-3.5" />,
        warning: <AlertTriangle className="w-3.5 h-3.5" />,
        error: <XCircle className="w-3.5 h-3.5" />,
        loading: <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-dark" />,
      }}
      {...props}
    />
  )
}

export { Toaster }
