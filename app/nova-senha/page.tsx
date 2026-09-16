"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { CheckCircle2 } from "lucide-react"

function FormularioNovaSenha() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro("")

    if (!token) {
      setErro("Link inválido ou expirado. Solicite a recuperação novamente.")
      return
    }

    if (password !== confirmPassword) {
      setErro("As senhas não coincidem.")
      return
    }

    if (password.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.")
      return
    }

    setLoading(true)

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token: token,
      })

      if (error) {
        setErro(error.message || "Erro ao redefinir a senha.")
      } else {
        setSucesso(true)
        setTimeout(() => router.push("/login"), 3000)
      }
    } catch (err) {
      setErro("Ocorreu um erro. Verifique sua conexão e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (sucesso) {
    return (
      <div className="text-center py-6">
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-bold text-night mb-1.5">Nova Senha</label>
        <input 
          type="password" 
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minímo 8 caracteres"
          className="w-full px-4 py-3 rounded-xl border border-line bg-white focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-night mb-1.5">Confirmar Nova Senha</label>
        <input 
          type="password" 
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Digite a mesma senha"
          className="w-full px-4 py-3 rounded-xl border border-line bg-white focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber"
        />
      </div>
      
      {erro && <p className="text-coral text-xs font-bold">{erro}</p>}

      <button 
        type="submit" 
        disabled={loading || !password || !confirmPassword}
        className="w-full bg-night hover:bg-night-3 text-amber font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 mt-2"
      >
        {loading ? "Salvando..." : "Salvar Nova Senha"}
      </button>
    </form>
  )
}

export default function NovaSenha() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
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
