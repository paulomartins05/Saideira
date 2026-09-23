"use client";

import { Utensils, MapPin, Clock, X, Store, Star, Phone, CheckCircle2, XCircle, Clock3, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { ModalAvaliacao } from "../ModalAvaliacao";


export interface TicketProps {
    id: string;
    titulo: string;
    loja: string;
    codigoPin: string;
    status: string;
    imageUrl?: string;
    endereco?: string;
    bairro?: string;
    dataValidade?: Date;
    telefone?: string;
}

export function Ticket({ id, titulo, loja, codigoPin, status, imageUrl, endereco, bairro, dataValidade, telefone }: TicketProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelError, setCancelError] = useState("");
    const [isAvaliacaoOpen, setIsAvaliacaoOpen] = useState(false);

    const isPendente = status === "PENDENTE";
    const isRetirado = status === "RETIRADO";

    const dataFormatada = dataValidade
        ? new Date(dataValidade).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
        : null;

    let podeCancelar = false;
    if (isPendente && dataValidade) {
        const agora = new Date();
        const validade = new Date(dataValidade);
        const diffMs = validade.getTime() - agora.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        if (diffHours >= 1.5) {
            podeCancelar = true;
        }
    }

    const handleCancelar = async () => {
        if (!confirm("Tem certeza que deseja cancelar este resgate?")) return;

        setIsCancelling(true);
        setCancelError("");

        try {
            const { cancelarResgate } = await import("@/app/actions/carrinho");
            const result = await cancelarResgate(id);

            if (result.success) {
                toast.success("Pedido cancelado com sucesso. Os salgados voltaram para a loja!");
                setIsModalOpen(false);
            } else {
                toast.error(result.error || "Erro ao cancelar o pedido.");
                setCancelError(result.error || "Erro ao cancelar.");
            }
        } catch (error) {
            toast.error("Falha na conexão de internet.");
        } finally {
            setIsCancelling(false);
        }
    };

    const mapsUrl = endereco ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${endereco}${bairro ? `, ${bairro}` : ''}, ${loja}`)}` : "#";

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className={`flex items-stretch border rounded-2xl mb-4 relative overflow-hidden transition-all duration-300 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-amber ${isPendente ? "bg-card border-line shadow-sm hover:shadow-md hover:border-amber/50" : "bg-card border-line shadow-sm opacity-60 hover:opacity-80 hover:border-amber/50"}`}
            >
                <div className="flex-1 flex items-center gap-4 p-5 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-paper border border-line flex items-center justify-center shrink-0 overflow-hidden relative">
                        {imageUrl ? (
                            <Image src={imageUrl} alt={titulo} fill className="object-cover" />
                        ) : (
                            <Utensils className="w-6 h-6 text-muted" />
                        )}
                    </div>
                    <div className="flex flex-col justify-center min-w-0 flex-1">
                        <h4 className="m-0 font-display font-bold text-base text-night truncate leading-tight mb-1">{titulo}</h4>
                        <p className="m-0 text-xs text-muted flex items-center gap-1.5 truncate">
                            <span className="truncate max-w-[120px] md:max-w-[200px]">{loja}</span>
                            <span className="shrink-0">·</span>
                            <span className={`shrink-0 ${isPendente ? "text-amber-dark font-bold tracking-wide" : "text-success font-bold tracking-wide"}`}>{status}</span>
                        </p>
                    </div>
                </div>

                <div className="relative border-l-[3px] border-dashed border-line/40">
                    <div className="absolute top-0 -left-[12px] w-6 h-6 bg-paper rounded-full -translate-y-1/2 shadow-inner"></div>
                    <div className="absolute bottom-0 -left-[12px] w-6 h-6 bg-paper rounded-full translate-y-1/2 shadow-inner"></div>
                </div>

                <div className="flex flex-col items-center justify-center py-4 px-6 min-w-[120px] md:min-w-[140px] shrink-0 bg-night text-amber">
                    <span className="text-[9px] md:text-[10px] tracking-widest mb-1.5 opacity-80 font-semibold uppercase">
                        Código PIN
                    </span>

                    <div className="flex gap-[2px] items-end justify-center w-full h-6 mb-2.5 opacity-90">
                        <div className="w-1 h-full bg-current"></div>
                        <div className="w-[2px] h-full bg-current"></div>
                        <div className="w-1.5 h-full bg-current"></div>
                        <div className="w-[2px] h-4 bg-current"></div>
                        <div className="w-1 h-full bg-current"></div>
                        <div className="w-[2px] h-5 bg-current"></div>
                        <div className="w-2 h-full bg-current"></div>
                        <div className="w-[2px] h-full bg-current"></div>
                        <div className="w-1.5 h-4 bg-current"></div>
                        <div className="w-1 h-full bg-current"></div>
                    </div>

                    <span className={`font-display text-2xl md:text-3xl font-extrabold tracking-widest leading-none ${isPendente ? "" : "line-through opacity-50"}`}>
                        {codigoPin}
                    </span>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-md rounded-[24px] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 text-night hover:bg-black/20 transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="w-full h-32 bg-line relative">
                            {imageUrl ? (
                                <Image src={imageUrl} alt={titulo} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-night-3 text-amber">
                                    <Utensils className="w-12 h-12 opacity-50" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-4 left-5 right-5 text-white">
                                <h3 className="font-display font-extrabold text-2xl leading-tight mb-1">{titulo}</h3>
                                <div className="flex items-center gap-1.5 text-sm font-medium opacity-90">
                                    <Store className="w-4 h-4" />
                                    <span>{loja}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="mb-6">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full mb-4 ${status === "RETIRADO" ? "bg-success/20 text-success" :
                                    status === "CANCELADO" ? "bg-red-500/20 text-red-500" :
                                        status === "EXPIRADO" ? "bg-line text-muted" :
                                            "bg-amber text-night"
                                    }`}>
                                    {status === "RETIRADO" && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    {status === "CANCELADO" && <XCircle className="w-3.5 h-3.5" />}
                                    {status === "EXPIRADO" && <Clock3 className="w-3.5 h-3.5" />}
                                    {status === "PENDENTE" && <AlertCircle className="w-3.5 h-3.5" />}
                                    Status: {status}
                                </span>

                                {endereco && (
                                    <div className="flex gap-3 mb-4 items-start">
                                        <div className="w-8 h-8 rounded-full bg-line flex items-center justify-center shrink-0 text-night">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-0.5">Endereço de Retirada</p>
                                            <a
                                                href={mapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block hover:bg-line/50 p-2 -ml-2 rounded-lg transition-colors group"
                                            >
                                                <p className="text-sm font-medium text-night leading-snug group-hover:text-amber-dark underline decoration-line underline-offset-4">{endereco}</p>
                                                {bairro && <p className="text-xs text-muted mt-0.5">{bairro}</p>}
                                                <span className="text-[10px] font-bold text-amber-dark uppercase tracking-widest mt-1 block">Abrir GPS →</span>
                                            </a>

                                            {telefone && (
                                                <a
                                                    href={`https://wa.me/55${telefone.replace(/\D/g, '')}?text=Olá! Sobre o meu pedido no Salgado Salvo...`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-bold transition-colors"
                                                >
                                                    <Phone className="w-3.5 h-3.5" />
                                                    Falar com a Loja
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {dataFormatada && (
                                    <div className="flex gap-3 items-start">
                                        <div className="w-8 h-8 rounded-full bg-line flex items-center justify-center shrink-0 text-night">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-0.5">Validade do Pedido</p>
                                            <p className="text-sm font-medium text-night">Até {dataFormatada}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-paper border border-line-dark rounded-xl p-5 text-center">
                                <p className="text-xs text-muted mb-2 font-medium uppercase tracking-widest">Código de Retirada</p>
                                <p className={`font-display text-4xl font-extrabold tracking-[0.2em] leading-none text-night ${isPendente ? "" : "line-through opacity-50"}`}>
                                    {codigoPin}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 border-t border-line bg-paper flex flex-col gap-2">
                            {cancelError && (
                                <p className="text-xs text-red-500 font-bold text-center mb-1">{cancelError}</p>
                            )}

                            {isRetirado && (
                                <>
                                    <button
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-success text-white hover:bg-success/90 transition-colors shadow-sm"
                                        onClick={() => setIsAvaliacaoOpen(true)}
                                    >
                                        <Star className="w-4 h-4 fill-current" /> Avaliar Pedido
                                    </button>
                                    <ModalAvaliacao isOpen={isAvaliacaoOpen} onClose={() => setIsAvaliacaoOpen(false)} resgateId={id} />
                                </>
                            )}

                            {podeCancelar && (
                                <button
                                    onClick={handleCancelar}
                                    disabled={isCancelling}
                                    className="w-full py-3 rounded-xl font-bold text-sm border-2 border-red-500 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                    {isCancelling ? "Cancelando..." : "Cancelar Pedido"}
                                </button>
                            )}

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full py-3 rounded-xl font-bold text-sm bg-night text-amber hover:bg-night-3 transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
