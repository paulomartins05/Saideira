import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Container from "@/app/componentes/container";
import Header from "@/app/_components/header";
import Button from "@/app/componentes/button";
import Link from "next/link";
import { editarOferta } from "@/app/actions/ofertas";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import FormGroup from "@/app/componentes/FormGroup";
import { Store, Tag, Scale, Utensils, MapPin } from "lucide-react";

export default async function EditarProduto({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const reqHeaders = await headers()
    const session = await auth.api.getSession({ headers: reqHeaders })

    if (!session || session.user.role !== "PARCEIRO") redirect("/")

    const id = (await params).id;
    const oferta = await prisma.oferta.findUnique({ where: { id } });
    if (!oferta || oferta.vendedorId !== session.user.id) {
        redirect("/parceiro/perfil?aba=produtos");
    }

    const dataValidadeFormatada = new Date(oferta.dataValidade.getTime() - (oferta.dataValidade.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

    const inputClass = "w-full bg-paper border border-line rounded-xl py-3 px-4 text-[14.5px] font-medium text-night placeholder:text-muted focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-colors";

    return (
        <div className="min-h-screen flex flex-col font-inter text-night bg-paper">
            <Header />
            <hr className="border-line" />
            <main className="py-10 grow">
                <Container>
                    <div className="mb-8 text-center md:text-left">
                        <div className="text-[13px] text-muted mb-3 font-medium">
                            Dashboard {'>'} Resgates {'>'} <span className="font-bold text-night">Editar</span>
                        </div>
                        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-night tracking-tight">
                            Editar Oferta
                        </h1>
                    </div>

                    <div className="max-w-3xl mx-auto bg-card p-6 md:p-10 rounded-[24px] shadow-sm border border-line flex flex-col gap-10">
                        <div className="bg-night rounded-2xl p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="text-amber pl-2">
                                    <Store className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[12px] text-muted font-medium tracking-widest uppercase">Editando</span>
                                    <span className="text-[15px] text-paper font-bold">{oferta.titulo}</span>
                                </div>
                            </div>
                            <Link href="/parceiro/perfil?aba=produtos" className="bg-white/10 hover:bg-white/20 text-white py-1.5 px-4 rounded-lg text-xs font-bold transition-colors">
                                Voltar
                            </Link>
                        </div>

                        <form action={async (formData) => {
                            "use server";
                            await editarOferta(formData);
                        }} className="flex flex-col gap-8">
                            <input type="hidden" name="id" value={oferta.id} />
                            <input type="hidden" name="localizacao" value={oferta.localizacao || ""} />

                            <div className="flex flex-col gap-6">
                                <FormGroup label="Nome do Produto">
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"><Tag className="w-4 h-4" /></span>
                                        <input type="text" name="titulo" defaultValue={oferta.titulo} required className={`${inputClass} pl-10`} />
                                    </div>
                                </FormGroup>

                                <FormGroup label="Descrição">
                                    <textarea name="descricao" defaultValue={oferta.descricao} required rows={3} className={`${inputClass} resize-none`}></textarea>
                                </FormGroup>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormGroup label="Categoria">
                                        <select name="categoria" defaultValue={oferta.categoria} required className={`${inputClass} appearance-none cursor-pointer`}>
                                            <option value="">Selecione...</option>
                                            <option value="Salgados">Salgados</option>
                                            <option value="Doces">Doces</option>
                                            <option value="Assados">Assados</option>
                                            <option value="Bolos">Bolos</option>
                                            <option value="Prato principal">Prato Feito</option>
                                            <option value="Marmita">Marmita</option>
                                            <option value="Sobremesa">Sobremesa</option>
                                            <option value="Bebida">Bebida</option>
                                            <option value="Pães">Pães</option>
                                            <option value="Hortifruti">Hortifruti</option>
                                            <option value="Padaria própria">Padaria</option>
                                            <option value="Açougue">Açougue</option>
                                            <option value="Mercearia">Mercearia</option>
                                            <option value="Doces finos">Doces Finos</option>
                                            <option value="Tortas">Tortas</option>
                                            <option value="Diversos">Diversos</option>
                                            <option value="Outros">Outros</option>
                                        </select>
                                    </FormGroup>

                                    <FormGroup label="Data e Hora de Validade">
                                        <input type="datetime-local" name="dataValidade" defaultValue={dataValidadeFormatada} required className={inputClass} />
                                    </FormGroup>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                                    <FormGroup label="Preço Normal">
                                        <input type="number" step="0.01" name="precoOriginal" defaultValue={oferta.precoOriginal} required className={`${inputClass} line-through text-muted`} />
                                    </FormGroup>

                                    <FormGroup label="Preço Resgate">
                                        <input type="number" step="0.01" name="precoResgate" defaultValue={oferta.precoResgate} required className={`${inputClass} !bg-green-50 !border-green-600 !text-green-700 font-bold focus:!border-green-700`} />
                                    </FormGroup>

                                    <FormGroup label="Qtde">
                                        <input type="number" name="quantidade" defaultValue={oferta.quantidade} required min="0" className={inputClass} />
                                    </FormGroup>
                                </div>

                                <FormGroup label="Peso Estimado (em Kg)">
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"><Scale className="w-4 h-4" /></span>
                                        <input type="text" name="peso" defaultValue={oferta.peso?.toString().replace(".", ",") || "0,3"} required placeholder="Ex: 0,5" className={`${inputClass} pl-10`} />
                                    </div>
                                    <p className="text-[11px] text-muted mt-1">Isso ajuda a calcular o impacto ambiental gerado.</p>
                                </FormGroup>
                            </div>

                            <div className="mt-2 mb-4">
                                <label className="block text-[13px] font-bold text-night mb-3">Fotos Atuais (Envie novas para substituir)</label>
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {[0, 1, 2].map((i) => {
                                        const img = oferta.imagemUrl?.[i];
                                        return (
                                            <div key={i} className={`aspect-square rounded-2xl border-2 flex items-center justify-center overflow-hidden bg-paper ${img ? "border-line shadow-sm" : "border-dashed border-line opacity-50"}`}>
                                                {img ? (
                                                    <img src={img} className="w-full h-full object-cover" alt={`Slot ${i + 1}`} />
                                                ) : (
                                                    <span className="text-xl text-muted"><Utensils className="w-5 h-5" /></span>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>

                                <label className="flex items-center justify-center w-full p-5 border-2 border-dashed border-line rounded-2xl bg-paper hover:bg-line/30 hover:border-amber transition-colors cursor-pointer group">
                                    <div className="flex flex-col items-center text-center">
                                        <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📤</span>
                                        <span className="text-[13px] font-bold text-night">Trocar fotos da oferta</span>
                                        <span className="text-[11.5px] text-muted mt-1 font-medium">Deixe vazio para manter as fotos atuais (Máx: 3 arquivos)</span>
                                    </div>
                                    <input type="file" name="imagem" multiple accept="image/png, image/jpeg, image/webp" className="hidden" />
                                </label>
                            </div>

                            <button type="submit" className="bg-amber hover:bg-amber-dark text-night font-bold text-[15px] py-4 rounded-xl w-full transition-all">
                                Salvar Alterações
                            </button>
                        </form>

                        <div className="mt-6 p-6 rounded-[20px] border border-coral/30 bg-[#FFF5F5] relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-display font-bold text-lg text-coral mb-2">Zona de Perigo</h3>
                                <p className="text-[13px] text-night/80 mb-5 font-medium leading-relaxed">Ao excluir esta oferta, ela será permanentemente removida. Resgates já gerados continuarão válidos. Esta ação é irreversível.</p>
                                <form action={async () => {
                                    "use server";
                                    const { excluirOferta } = await import("@/app/actions/ofertas");
                                    await excluirOferta(oferta.id);
                                }}>
                                    <button type="submit" className="w-full bg-coral hover:bg-[#d64a38] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-[13.5px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                        Excluir Oferta
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </Container>
            </main>
        </div>
    );
}
