"use client"
import { useFormStatus } from "react-dom"
import Button from "./button"

interface SubmitButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: any;
  loadingText?: string;
}

export default function SubmitButton({ 
  children, 
  className, 
  variant = "primary",
  loadingText = "Processando..."
}: SubmitButtonProps) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" variant={variant} isLoading={pending} className={className}>
      {pending ? loadingText : children}
    </Button>
  )
}
