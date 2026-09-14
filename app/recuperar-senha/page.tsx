"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import Button from "../componentes/button";

export default function EsqueciSenha() {
    const [email, setEmail] = useState("");
    const [enviado, setEnviado] = useState(false);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCarregando(true);
        setErro("");

        const { error } = await authClient.requestPasswordReset({
            email: email,
            redirectTo: "/nova-senha"
        });

        if (error) {
            setErro(error.message || "Erro ao solicitar recuperação de senha.");
        } else {
            setEnviado(true);
        }
        setCarregando(false);
    };

    const inputClass = "w-full bg-paper border border-line rounded-lg px-4 py-3 text-[13.5px] text-night focus:outline-none focus:border-night transition-colors placeholder:text-muted";

    return (
        <div className="bg-paper min-h-screen flex flex-col items-center justify-center font-inter px-6">
            <div className="max-w-[440px] w-full bg-card p-8 md:p-10 rounded-2xl shadow-sm border border-line">
                
                <Link href="/" className="inline-flex items-center gap-2 font-display font-extrabold text-[22px] text-night mb-8 justify-center w-full">
                    <span className="w-8 h-8 rounded-lg bg-amber text-night flex items-center justify-center font-display font-extrabold text-base">S</span>
                    Saidera
                </Link>

                <h1 className="text-2xl md:text-[28px] font-display font-extrabold text-night text-center mb-2">Recuperar Senha</h1>
                
                {enviado ? (
                    <div className="text-center mt-6">
                        <div className="w-16 h-16 bg-success-bg text-success rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-[13.5px] text-muted mb-6 leading-relaxed">
                            Se o e-mail existir no nosso sistema, enviamos um link de recuperação para <strong className="text-night">{email}</strong>.
                        </p>
                        <Link href="/login" className="inline-block w-full text-center bg-night text-amber font-bold text-[14.5px] py-3.5 rounded-lg hover:bg-night-3 transition-colors">
                            Voltar para o Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6">
                        <p className="text-[13.5px] text-muted text-center mb-2">
                            Digite seu e-mail cadastrado e enviaremos um link para você redefinir sua senha.
                        </p>
                        <div>
                            <label className="block text-[13px] font-bold text-night mb-1.5">Seu E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={inputClass}
                                placeholder="exemplo@email.com"
                            />
                        </div>
                        
                        {erro && <p className="text-coral text-xs font-medium text-center">{erro}</p>}

                        <Button type="submit" disabled={carregando} className="w-full mt-2 bg-night text-amber font-bold text-[14.5px] py-3.5 rounded-lg hover:bg-night-3 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                            {carregando ? "Enviando..." : "Enviar Link de Recuperação"}
                        </Button>
                        
                        <div className="mt-4 text-center">
                            <Link href="/login" className="text-[13px] font-bold text-muted hover:text-night transition-colors">
                                Voltar para o Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}