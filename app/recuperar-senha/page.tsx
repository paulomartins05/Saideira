"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Send } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import FormGroup from "../componentes/FormGroup"

const recuperarSchema = z.object({
  email: z.string().email("Digite um e-mail válido"),
})
type RecuperarFormInputs = z.infer<typeof recuperarSchema>

export default function RecuperarSenhaPage() {
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState("")

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RecuperarFormInputs>({
    resolver: zodResolver(recuperarSchema)
  })

  const onSubmit = async (data: RecuperarFormInputs) => {
    setErro("")
    try {
      // @ts-expect-error: Better-Auth types are sometimes incomplete for forgetPassword, but it exists at runtime.
      const { error } = await authClient.forgetPassword({
        email: data.email,
        redirectTo: "/nova-senha"
      })

      if (error) {
        setErro(error.message || "Erro ao solicitar recuperação.")
      } else {
        setSucesso(true)
      }
    } catch (err) {
      setErro("Ocorreu um erro inesperado. Tente novamente.")
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-line bg-white focus:outline-none focus:border-amber transition-all"

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4 font-inter">
      <div className="max-w-md w-full bg-card p-8 rounded-[20px] shadow-sm border border-line">

        <Link href="/login" className="inline-flex items-center text-sm text-muted hover:text-night transition-colors mb-6 font-medium">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para o Login
        </Link>

        <h1 className="font-display font-extrabold text-[28px] text-night mb-2">Esqueceu a senha?</h1>
        <p className="text-muted text-[14px] mb-8">
          Não se preocupe. Digite o e-mail associado à sua conta e enviaremos um link para redefinir sua senha.
        </p>

        {sucesso ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-start gap-3">
            <Mail className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">E-mail enviado!</p>
              <p className="text-xs mt-1">Se existir uma conta cadastrada, você receberá as instruções em instantes. Cheque o SPAM.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            <FormGroup label="Seu E-mail" error={errors.email?.message}>
              <input
                type="email"
                placeholder="nome@email.com.br"
                className={inputClass}
                {...register("email")}
              />
            </FormGroup>

            {erro && <p className="text-coral text-xs font-bold">{erro}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-night hover:bg-night-3 text-amber font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 mt-2"
            >
              {isSubmitting ? "Processando..." : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar link
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
