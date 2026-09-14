"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { appToast } from "@/lib/toast";

const loginSchema = z.object({
  email: z.string().min(1, "O Email é obrigatório").email("Digite um email válido"),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  lembrarMe: z.boolean().optional(),
});
type loginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<loginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { lembrarMe: false }
  });

  const onSubmit = async (data: loginFormInputs) => {
    await authClient.signIn.email({
      email: data.email,
      password: data.senha,
      rememberMe: data.lembrarMe,
      callbackURL: "/"
    }, {
      onSuccess: () => appToast.loginSuccess(),
      onError: (ctx) => appToast.loginError(ctx.error.message)
    });
  };

  const inputClass = "w-full bg-paper border border-line rounded-lg px-4 py-3 text-[13.5px] text-night focus:outline-none focus:border-night transition-colors placeholder:text-muted";
  const labelClass = "block text-[13px] font-bold text-night mb-1.5";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-paper font-inter">
      
      {/* Showcase (Esquerda) */}
      <div className="hidden md:flex flex-1 bg-night flex-col items-center justify-center p-10 relative overflow-hidden">
        {/* Glow de fundo opcional */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-amber/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 bg-night border border-line p-6 rounded-[20px] w-full max-w-[340px] shadow-2xl">
          <div className="text-[11px] font-bold tracking-widest uppercase text-amber mb-3">Oferta em Destaque</div>
          <div className="aspect-video bg-line rounded-lg mb-4 flex items-center justify-center text-muted text-sm overflow-hidden">
             <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600&auto=format&fit=crop" alt="Hambúrguer" className="w-full h-full object-cover" />
          </div>
          <h3 className="font-display font-extrabold text-[22px] text-white leading-tight mb-2">Hambúrguer Artesanal + Fritas</h3>
          <p className="text-[13px] text-muted mb-4 line-clamp-2">Combo completo que sobrou do turno da tarde. Pão fresquinho e carne no ponto.</p>
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[11px] text-muted line-through block mb-0.5">R$ 45,90</span>
              <span className="font-display font-bold text-lg text-amber">R$ 15,90</span>
            </div>
            <div className="bg-coral text-white text-[11px] font-bold px-2 py-1 rounded-md">10 min</div>
          </div>
        </div>
      </div>

      {/* Formulário (Direita) */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-[400px]">
          
          <Link href="/" className="inline-flex items-center gap-2 font-display font-extrabold text-[22px] text-night mb-10">
            <span className="w-8 h-8 rounded-lg bg-amber text-night flex items-center justify-center font-display font-extrabold text-base">S</span>
            Saidera
          </Link>

          <h1 className="font-display font-extrabold text-[28px] text-night mb-2">Bem-vindo de volta</h1>
          <p className="text-[13.5px] text-muted mb-8">Entre para continuar salvando comida e dinheiro.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" placeholder="seu@email.com" className={inputClass} {...register("email")} />
              {errors.email && <span className="text-coral text-xs mt-1 block font-medium">{errors.email.message}</span>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[13px] font-bold text-night">Senha</label>
                <Link href="/recuperar-senha" className="text-[12px] font-bold text-muted hover:text-night transition-colors">Esqueceu a senha?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-[18px] h-[18px] text-muted" />
                </div>
                <input 
                  type={mostrarSenha ? "text" : "password"} 
                  placeholder="Sua senha secreta" 
                  className={`${inputClass} pl-[42px] pr-10`} 
                  {...register("senha")} 
                />
                <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-night">
                  {mostrarSenha ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
              {errors.senha && <span className="text-coral text-xs mt-1 block font-medium">{errors.senha.message}</span>}
            </div>

            <div className="flex items-center gap-2 mt-1 mb-2">
              <input type="checkbox" id="lembrarMe" className="w-[18px] h-[18px] rounded-[4px] border-line text-night focus:ring-night cursor-pointer" {...register("lembrarMe")} />
              <label htmlFor="lembrarMe" className="text-[13px] font-semibold text-night cursor-pointer">Lembrar de mim</label>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-night text-amber font-bold text-[14.5px] py-3.5 rounded-lg hover:bg-night-3 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? "Entrando..." : "Entrar na Conta"}
            </button>

          </form>

          <p className="mt-8 text-center text-[13px] text-muted font-medium">
            Não tem uma conta? <Link href="/cadastro" className="text-night font-bold hover:underline">Cadastre-se</Link>
          </p>

        </div>
      </div>

    </div>
  );
}