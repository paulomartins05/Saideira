"use client";

import { useState } from "react";
import { aprovarParceiro, recusarParceiro, revogarParceiro } from "@/app/actions/admin";
import Button from "@/app/componentes/button";
import { CheckCircle2, Store, FileText, Phone, Mail, Check, X, MapPin, Ban } from "lucide-react";
import { appToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

interface ParceiroPendente {
    id: string;
    name: string;
    email: string;
    telefone: string;
    cnpj: string;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
}

export default function AdminMasterDetail({ parceirosPendentes, parceirosAtivos }: { parceirosPendentes: ParceiroPendente[], parceirosAtivos: ParceiroPendente[] }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'PENDENTES' | 'ATIVOS'>('PENDENTES');
    const [selectedId, setSelectedId] = useState<string | null>(parceirosPendentes[0]?.id || parceirosAtivos[0]?.id || null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    const parceirosAtuais = activeTab === 'PENDENTES' ? parceirosPendentes : parceirosAtivos;
    const selectedUser = parceirosAtuais.find(p => p.id === selectedId);

    const handleTabChange = (tab: 'PENDENTES' | 'ATIVOS') => {
        setActiveTab(tab);
        const list = tab === 'PENDENTES' ? parceirosPendentes : parceirosAtivos;
        setSelectedId(list[0]?.id || null);
    };

    const handleAprovar = async () => {
        if (!selectedUser) return;
        setIsLoading(true);
        try {
            await aprovarParceiro(selectedUser.id);
            appToast.sucesso("Parceiro Aprovado", `${selectedUser.name} agora pode publicar ofertas.`);
            router.refresh();

            const nextUser = parceirosPendentes.find(p => p.id !== selectedUser.id);
            setSelectedId(nextUser ? nextUser.id : null);
        } catch (e: any) {
            const mensagem = e?.message || "Não foi possível aprovar o parceiro.";
            appToast.erro("Atenção", mensagem);
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleRecusar = async () => {
        if (!selectedUser) return;

        setIsRejecting(true)

        try {
            await recusarParceiro(selectedUser.id);
            appToast.sucesso("Parceiro Recusado", "O pedido de parceria foi cancelado.");
            router.refresh();
            const nextUser = parceirosPendentes.find(p => p.id !== selectedUser.id);
            setSelectedId(nextUser ? nextUser.id : null);
        } catch (e: any) {
            const mensagem = e?.message || "Não foi possível recusar o parceiro.";
            appToast.erro("Atenção", mensagem);
        }
        finally {
            setIsRejecting(false);
        }
    };

    const handleRevogar = async () => {
        if (!selectedUser) return;
        setIsRejecting(true);
        try {
            await revogarParceiro(selectedUser.id);
            appToast.sucesso("Parceria Revogada", "O parceiro retornou para conta de consumidor.");
            router.refresh();
            const nextUser = parceirosAtivos.find(p => p.id !== selectedUser.id);
            setSelectedId(nextUser ? nextUser.id : null);
        } catch (e: any) {
            const mensagem = e?.message || "Não foi possível revogar o parceiro.";
            appToast.erro("Atenção", mensagem);
        } finally {
            setIsRejecting(false);
        }
    };

    const isListEmpty = parceirosPendentes.length === 0 && parceirosAtivos.length === 0;

    if (isListEmpty) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-16 h-16 bg-success-bg text-success rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-display font-bold text-night mb-2">Tudo em dia!</h2>
                <p className="text-muted text-sm">Não há parceiros cadastrados ou aguardando aprovação no momento.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex overflow-hidden">
            <div className={`w-full md:w-1/3 md:max-w-[350px] border-r border-line bg-card flex-col h-full ${selectedId ? 'hidden md:flex' : 'flex'}`}>
                <div className="flex border-b border-line shrink-0">
                    <button 
                        onClick={() => handleTabChange('PENDENTES')}
                        className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'PENDENTES' ? 'text-amber border-b-2 border-amber bg-paper' : 'text-muted hover:text-night hover:bg-paper/50'}`}
                    >
                        Fila ({parceirosPendentes.length})
                    </button>
                    <button 
                        onClick={() => handleTabChange('ATIVOS')}
                        className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'ATIVOS' ? 'text-success border-b-2 border-success bg-paper' : 'text-muted hover:text-night hover:bg-paper/50'}`}
                    >
                        Ativos ({parceirosAtivos.length})
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {parceirosAtuais.length === 0 ? (
                        <div className="p-8 text-center text-muted text-sm font-medium">Nenhum parceiro nesta lista.</div>
                    ) : (
                        parceirosAtuais.map(user => (
                            <button
                                key={user.id}
                                onClick={() => setSelectedId(user.id)}
                                className={`flex flex-col text-left p-5 border-b border-line w-full transition-colors ${selectedId === user.id ? (activeTab === 'PENDENTES' ? "bg-amber/10 border-l-4 border-l-amber" : "bg-success/10 border-l-4 border-l-success") : "hover:bg-paper border-l-4 border-l-transparent"}`}
                            >
                                <span className="font-bold text-night truncate w-full">{user.name}</span>
                                <span className="text-xs text-muted truncate w-full mt-1">CNPJ: {user.cnpj}</span>
                                <span className={`text-[10px] font-semibold uppercase tracking-wider mt-2 px-2 py-1 rounded w-fit ${activeTab === 'PENDENTES' ? 'text-amber bg-paper' : 'text-success bg-paper'}`}>
                                    {activeTab === 'PENDENTES' ? 'Aguardando' : 'Ativo'}
                                </span>
                            </button>
                        ))
                    )}
                </div>
            </div>

            <div className={`flex-1 overflow-y-auto bg-paper p-4 md:p-10 ${!selectedId ? 'hidden md:block' : 'block'}`}>
                {selectedUser ? (
                    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button
                            onClick={() => setSelectedId(null)}
                            className="md:hidden flex items-center gap-2 text-muted font-bold text-sm mb-6 hover:text-night transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            Voltar para a Fila
                        </button>

                        <div className="bg-card rounded-[2rem] border border-line p-6 md:p-8 shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 bg-night text-paper rounded-2xl flex items-center justify-center shrink-0">
                                    <Store className="w-8 h-8" />
                                </div>
                                <div>
                                    <h1 className="font-display text-2xl font-bold text-night">{selectedUser.name}</h1>
                                    <p className="text-sm text-muted">
                                        {activeTab === 'PENDENTES' ? 'Aguardando aprovação de cadastro' : 'Parceiro com cadastro ativo na plataforma'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div className="flex items-start gap-4 bg-paper p-4 rounded-2xl border border-line-dark">
                                    <FileText className="w-5 h-5 text-muted mt-1" />
                                    <div className="overflow-hidden">
                                        <p className="text-[11px] text-muted font-bold uppercase tracking-wider mb-0.5">CNPJ</p>
                                        <p className="font-mono text-night truncate">{selectedUser.cnpj}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 bg-paper p-4 rounded-2xl border border-line-dark">
                                    <Phone className="w-5 h-5 text-muted mt-1" />
                                    <div className="overflow-hidden">
                                        <p className="text-[11px] text-muted font-bold uppercase tracking-wider mb-0.5">Telefone</p>
                                        <p className="text-night truncate">{selectedUser.telefone}</p>
                                    </div>
                                </div>
                                <div className="md:col-span-2 flex items-start gap-4 bg-paper p-4 rounded-2xl border border-line-dark">
                                    <Mail className="w-5 h-5 text-muted mt-1" />
                                    <div className="overflow-hidden">
                                        <p className="text-[11px] text-muted font-bold uppercase tracking-wider mb-0.5">E-mail</p>
                                        <p className="text-night truncate">{selectedUser.email}</p>
                                    </div>
                                </div>
                                <div className="md:col-span-2 flex items-start gap-4 bg-paper p-4 rounded-2xl border border-line-dark">
                                    <MapPin className="w-5 h-5 text-muted mt-1" />
                                    <div>
                                        <p className="text-[11px] text-muted font-bold uppercase tracking-wider mb-0.5">Endereço de Localização</p>
                                        <p className="text-night font-medium">
                                            {selectedUser.rua}, {selectedUser.numero}
                                            {selectedUser.bairro ? ` - ${selectedUser.bairro}` : ''}
                                        </p>
                                        <p className="text-sm text-muted mt-0.5">
                                            {selectedUser.cidade} - {selectedUser.estado} (CEP: {selectedUser.cep})
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-line">
                                {activeTab === 'PENDENTES' ? (
                                    <>
                                        <Button
                                            variant="primary"
                                            className="flex-1 bg-success hover:bg-[#438a5f] text-white rounded-xl py-3.5 shadow-lg shadow-success/20 transition-all font-bold flex justify-center items-center gap-2"
                                            onClick={handleAprovar}
                                            disabled={isLoading || isRejecting}
                                        >
                                            {isLoading ? "Processando..." : (
                                                <>
                                                    <Check className="w-5 h-5" />
                                                    Aprovar Parceiro
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-coral text-coral hover:bg-coral/10 rounded-xl py-3.5 transition-all font-bold flex justify-center items-center gap-2"
                                            onClick={handleRecusar}
                                            disabled={isLoading || isRejecting}
                                        >
                                            {isRejecting ? "Processando..." : (
                                                <>
                                                    <X className="w-5 h-5" />
                                                    Recusar
                                                </>
                                            )}
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-coral text-coral hover:bg-coral/10 rounded-xl py-3.5 transition-all font-bold flex justify-center items-center gap-2"
                                        onClick={handleRevogar}
                                        disabled={isRejecting}
                                    >
                                        {isRejecting ? "Processando..." : (
                                            <>
                                                <Ban className="w-5 h-5" />
                                                Revogar Parceria
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted font-medium">
                        Selecione um parceiro na lista
                    </div>
                )}
            </div>
        </div>
    );
}
