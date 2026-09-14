"use client";

import { useState } from "react";
import { aprovarParceiro } from "../actions/admin";
import Button from "../componentes/button";
import { CheckCircle2, Store, FileText, Phone, Mail } from "lucide-react";
import { appToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

export default function AdminMasterDetail({ parceiros }: { parceiros: any[] }) {
    const router = useRouter();
    const [selectedId, setSelectedId] = useState<string | null>(parceiros[0]?.id || null);
    const [isLoading, setIsLoading] = useState(false);

    const selectedUser = parceiros.find(p => p.id === selectedId);

    const handleAprovar = async () => {
        if (!selectedUser) return;
        setIsLoading(true);
        try {
            await aprovarParceiro(selectedUser.id);
            appToast.sucesso("Parceiro Aprovado", `${selectedUser.name} agora pode publicar ofertas.`);
            router.refresh();

            const nextUser = parceiros.find(p => p.id !== selectedUser.id);
            setSelectedId(nextUser ? nextUser.id : null);
        } catch (e) {
            appToast.erro("Erro", "Não foi possível aprovar o parceiro.");
        } finally {
            setIsLoading(false);
        }
    };

    if (parceiros.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-16 h-16 bg-success-bg text-success rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-display font-bold text-night mb-2">Tudo em dia!</h2>
                <p className="text-muted text-sm">Não há parceiros aguardando aprovação no momento.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex overflow-hidden">
            <div className={`w-full md:w-1/3 md:max-w-[350px] border-r border-line bg-card flex-col h-full ${selectedId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-5 border-b border-line shrink-0">
                    <h2 className="font-display font-bold text-lg text-night">Fila de Aprovação</h2>
                    <p className="text-xs text-muted mt-1">{parceiros.length} parceiros pendentes</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {parceiros.map(user => (
                        <button
                            key={user.id}
                            onClick={() => setSelectedId(user.id)}
                            className={`flex flex-col text-left p-5 border-b border-line w-full transition-colors ${selectedId === user.id ? "bg-amber/10 border-l-4 border-l-amber" : "hover:bg-paper border-l-4 border-l-transparent"}`}
                        >
                            <span className="font-bold text-night truncate w-full">{user.name}</span>
                            <span className="text-xs text-muted truncate w-full mt-1">CNPJ: {user.cnpj}</span>
                            <span className="text-[10px] font-semibold text-amber uppercase tracking-wider mt-2 bg-paper px-2 py-1 rounded w-fit">Aguardando</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className={`flex-1 overflow-y-auto bg-paper p-4 md:p-10 ${!selectedId ? 'hidden md:block' : 'block'}`}>
                {selectedUser ? (
                    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button 
                            onClick={() => setSelectedId(null)} 
                            className="md:hidden flex items-center gap-2 text-muted font-bold text-sm mb-6 hover:text-night transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                            Voltar para a Fila
                        </button>

                        <div className="bg-card rounded-[2rem] border border-line p-6 md:p-8 shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 bg-night text-paper rounded-2xl flex items-center justify-center shrink-0">
                                    <Store className="w-8 h-8" />
                                </div>
                                <div>
                                    <h1 className="font-display text-2xl font-bold text-night">{selectedUser.name}</h1>
                                    <p className="text-sm text-muted">Aguardando aprovação de cadastro</p>
                                </div>
                            </div>

                            <div className="grid gap-4 mb-8">
                                <div className="flex items-start gap-4 bg-paper p-4 rounded-2xl border border-line-dark">
                                    <FileText className="w-5 h-5 text-muted mt-1" />
                                    <div>
                                        <p className="text-[11px] text-muted font-bold uppercase tracking-wider mb-0.5">CNPJ</p>
                                        <p className="font-mono text-night">{selectedUser.cnpj}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 bg-paper p-4 rounded-2xl border border-line-dark">
                                    <Mail className="w-5 h-5 text-muted mt-1" />
                                    <div>
                                        <p className="text-[11px] text-muted font-bold uppercase tracking-wider mb-0.5">E-mail</p>
                                        <p className="text-night">{selectedUser.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 bg-paper p-4 rounded-2xl border border-line-dark">
                                    <Phone className="w-5 h-5 text-muted mt-1" />
                                    <div>
                                        <p className="text-[11px] text-muted font-bold uppercase tracking-wider mb-0.5">Telefone</p>
                                        <p className="text-night">{selectedUser.telefone}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-line">
                                <Button
                                    variant="primary"
                                    className="flex-1 bg-success hover:bg-[#438a5f] text-white rounded-xl py-3.5 shadow-lg shadow-success/20 transition-all font-bold flex justify-center items-center gap-2"
                                    onClick={handleAprovar}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Aprovando..." : "✅ Aprovar Parceiro"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 border-coral text-coral hover:bg-coral/10 rounded-xl py-3.5 transition-all font-bold flex justify-center items-center gap-2"
                                >
                                    ❌ Recusar
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted">
                        Selecione um parceiro na lista
                    </div>
                )}
            </div>
        </div>
    );
}
