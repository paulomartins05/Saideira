"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, LogIn, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { appToast } from "@/lib/toast";
import FormGroup from "@/app/componentes/FormGroup";
import { loginSchema, type LoginFormInputs } from "@/lib/validations/login";

export default function FormularioLogin() {
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
        defaultValues: { lembrarMe: false }
    });

    const onSubmit = async (data: LoginFormInputs) => {
        const { error } = await authClient.signIn.email({
            email: data.email,
            password: data.senha,
            rememberMe: data.lembrarMe,
        });
        if (error) {
            appToast.loginError(error.message);
            return;
        }
        appToast.loginSuccess();
        router.push(callbackUrl);
    };

    const inputClass = "w-full bg-paper border border-line rounded-lg px-4 py-3 text-[13.5px] text-night focus:outline-none focus:border-night transition-colors placeholder:text-muted";

    const PasswordLabel = (
        <span className="flex justify-between items-center w-full">
            <span>Senha</span>
            <Link href="/recuperar-senha" className="text-[12px] font-bold text-muted hover:text-night transition-colors">
                Esqueceu a senha?
            </Link>
        </span>
    );

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <FormGroup label="Email" error={errors.email?.message}>
                    <input type="email" placeholder="seu@email.com" className={inputClass} {...register("email")} />
                </FormGroup>

                <FormGroup label={PasswordLabel} error={errors.senha?.message}>
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
                </FormGroup>

                <div className="flex items-center gap-2 mt-1 mb-2">
                    <input type="checkbox" id="lembrarMe" className="w-[18px] h-[18px] rounded-[4px] border-line text-night focus:ring-night cursor-pointer" {...register("lembrarMe")} />
                    <label htmlFor="lembrarMe" className="text-[13px] font-semibold text-night cursor-pointer">Lembrar de mim</label>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-night text-amber font-bold text-[14.5px] py-3.5 rounded-lg hover:bg-night-3 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Entrando...
                        </>
                    ) : (
                        <>
                            <LogIn className="w-4 h-4" />
                            Entrar na Conta
                        </>
                    )}
                </button>
            </form>

            <p className="mt-8 text-center text-[13px] text-muted font-medium">
                Não tem uma conta? <Link href="/cadastro" className="text-night font-bold hover:underline">Cadastre-se</Link>
            </p>
        </>
    );
}
