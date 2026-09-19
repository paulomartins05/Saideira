"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { CheckCircle2, Save, Loader2, Eye, EyeOff } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import FormGroup from "../componentes/FormGroup"

const novaSenhaSchema = z.object({
  senha: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  confirmarSenha: z.string()
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
})

type NovaSenhaFormInputs = z.infer<typeof novaSenhaSchema>

function FormularioNovaSenha() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NovaSenhaFormInputs>({
    resolver: zodResolver(novaSenhaSchema)
  })

  const onSubmit = async (data: NovaSenhaFormInputs) => {
    setErro("")

    if (!token) {
      setErro("Link inválido ou expirado. Solicite a recuperação novamente.")
      return
    }

    try {
      const { error } = await authClient.resetPassword({
        newPassword: data.senha,
        token: token,
      })

      if (error) {
        setErro(error.message || "Erro ao redefinir a senha.")
      } else {
        setSucesso(true)
        setTimeout(() => router.push("/login"), 3000)
      }
    } catch (err) {
      setErro("Ocorreu um erro inesperado.")
    }
  }

  if (sucesso) {
    return (
      <div className="text-center py-6 animate-in fade-in">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="font-display font-extrabold text-[24px] text-night mb-2">Senha alterada!</h2>
        <p className="text-muted text-[14px]">Sua senha foi redefinida com sucesso. Redirecionando para o login...</p>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="text-center py-6">
        <h2 className="font-display font-bold text-coral text-lg mb-2">Link Inválido</h2>
        <p className="text-sm text-muted">Este link está quebrado ou já expirou. Por favor, volte e peça a recuperação novamente.</p>
      </div>
    )
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-line bg-white focus:outline-none focus:border-amber transition-all"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

      <FormGroup label="Nova Senha" error={errors.senha?.message}>
        <div className="relative">
          <input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            className={`${inputClass} pr-10`}
            {...register("senha")}
          />
          <button
            type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-night"
          >
            {mostrarSenha ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
          </button>
        </div>
      </FormGroup>
      <FormGroup label="Confirmar Nova Senha" error={errors.confirmarSenha?.message}>
        <div className="relative">
          <input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Digite a mesma senha"
            className={`${inputClass} pr-10`}
            {...register("confirmarSenha")}
          />
          <button
            type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-night"
          >
            {mostrarSenha ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
          </button>
        </div>
      </FormGroup>


      {erro && <p className="text-coral text-xs font-bold">{erro}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-night hover:bg-night-3 text-amber font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 mt-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Salvar Nova Senha
          </>
        )}
      </button>

    </form>
  )
}

export default function NovaSenhaPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4 font-inter">
      <div className="max-w-md w-full bg-card p-8 rounded-[20px] shadow-sm border border-line">
        <h1 className="font-display font-extrabold text-[28px] text-night mb-2">Criar nova senha</h1>
        <p className="text-muted text-[14px] mb-8">
          Digite a sua nova senha abaixo. Certifique-se de usar uma senha forte.
        </p>

        <Suspense fallback={<p className="text-center text-sm text-muted">Carregando formulário...</p>}>
          <FormularioNovaSenha />
        </Suspense>
      </div>
    </div>
  )
}
