"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { Check, Info, AlertTriangle, XCircle, Loader2 } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-center"
      duration={3500}
      visibleToasts={3}
      closeButton
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-night group-[.toaster]:text-white group-[.toaster]:border-y-0 group-[.toaster]:border-r-0 group-[.toaster]:border-l-[4px] group-[.toaster]:border-l-muted group-[.toaster]:rounded-xl group-[.toaster]:shadow-2xl group-[.toaster]:p-4 group-[.toaster]:flex group-[.toaster]:items-start group-[.toaster]:gap-3.5 group-[.toaster]:font-inter",
          description: "group-[.toast]:text-muted group-[.toast]:text-[13px] group-[.toast]:mt-1.5",
          title: "group-[.toast]:text-[14px] group-[.toast]:font-bold group-[.toast]:text-white group-[.toast]:font-display",
          icon: "group-[.toast]:w-8 group-[.toast]:h-8 group-[.toast]:rounded-full group-[.toast]:flex group-[.toast]:items-center group-[.toast]:justify-center group-[.toast]:bg-night-3 group-[.toast]:text-muted group-[.toast]:shrink-0",
          success: "group-[.toaster]:border-l-success group-[.toast]:[&_[data-icon]]:bg-success-bg group-[.toast]:[&_[data-icon]]:text-success",
          error: "group-[.toaster]:border-l-coral group-[.toast]:[&_[data-icon]]:bg-[#FBE4E0] group-[.toast]:[&_[data-icon]]:text-coral",
          warning: "group-[.toaster]:border-l-amber group-[.toast]:[&_[data-icon]]:bg-[#FBF0DA] group-[.toast]:[&_[data-icon]]:text-amber-dark",
          info: "group-[.toaster]:border-l-info group-[.toast]:[&_[data-icon]]:bg-info-bg group-[.toast]:[&_[data-icon]]:text-info",
        },
      }}
      icons={{
        success: <Check className="w-4 h-4 stroke-[3]" />,
        info: <Info className="w-4 h-4 stroke-[3]" />,
        warning: <AlertTriangle className="w-4 h-4 stroke-[3]" />,
        error: <XCircle className="w-4 h-4 stroke-[3]" />,
        loading: <Loader2 className="w-4 h-4 animate-spin text-amber stroke-[3]" />,
      }}
      {...props}
    />
  )
}

export { Toaster }
