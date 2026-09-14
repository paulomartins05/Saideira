"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Button from "../componentes/button";

export default function NovaSenha() {
    const router = useRouter();
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (novaSenha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        if (novaSenha.length < 8) {
            setErro("A senha deve ter no mínimo 8 caracteres.");
            return;
        }

        setCarregando(true);
        setErro("");

        const { error } = await authClient.resetPassword({
            newPassword: novaSenha
        });

        if (error) {
            setErro("Link inválido ou expirado. Tente solicitar a recuperação novamente.");
        } else {
            setSucesso(true);
            setTimeout(() => {
                router.push("/login");
            }, 3000);
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

                <h1 className="text-2xl md:text-[28px] font-display font-extrabold text-night text-center mb-2">Criar Nova Senha</h1>
                
                {sucesso ? (
                    <div className="text-center mt-6">
                        <div className="w-16 h-16 bg-success-bg text-success rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-night font-bold text-lg mb-2">
                            Senha alterada com sucesso!
                        </p>
                        <p className="text-muted text-[13.5px] mb-6">
                            Redirecionando para o login...
                        </p>
                        <Link href="/login" className="inline-block w-full text-center bg-night text-amber font-bold text-[14.5px] py-3.5 rounded-lg hover:bg-night-3 transition-colors">
                            Ir para o Login agora
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6">
                        <div>
                            <label className="block text-[13px] font-bold text-night mb-1.5">Nova Senha</label>
                            <input
                                type="password"
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                required
                                className={inputClass}
                                placeholder="Mínimo 8 caracteres"
                            />
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-night mb-1.5">Confirmar Nova Senha</label>
                            <input
                                type="password"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                required
                                className={inputClass}
                                placeholder="Repita a nova senha"
                            />
                        </div>
                        
                        {erro && <p className="text-coral text-xs font-medium text-center">{erro}</p>}

                        <Button type="submit" disabled={carregando} className="w-full mt-2 bg-night text-amber font-bold text-[14.5px] py-3.5 rounded-lg hover:bg-night-3 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                            {carregando ? "Salvando..." : "Redefinir Senha"}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
