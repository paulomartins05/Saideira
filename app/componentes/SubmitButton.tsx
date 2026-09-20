"use client"
import { useFormStatus } from "react-dom"
import Button from "./button"

export default function SubmitButton({ children, className, variant = "primary" }: { children: React.ReactNode, className?: string, variant?: any }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" variant={variant} isLoading={pending} className={className}>
      {pending ? "Processando..." : children}
    </Button>
  )
}
