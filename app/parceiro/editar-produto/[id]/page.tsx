import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Container from "@/app/componentes/container";
import Header from "@/app/pages/header";
import Button from "@/app/componentes/button";
import Link from "next/link";
import { editarOferta } from "@/app/actions/ofertas";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

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

    return (
        <div className="min-h-screen flex flex-col font-inter text-night">
            <Header />
            <hr className="border-line" />
            <main className="py-10 grow">
                <Container>
                    <div className="max-w-2xl mx-auto bg-card p-8 md:p-10 rounded-[2rem] shadow-sm border border-line">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-3xl font-display font-bold text-night">Editar Produto</h1>
                            <Link href="/parceiro/perfil?aba=produtos" className="text-sm font-semibold text-muted hover:text-night transition-colors">
                                Cancelar e Voltar
                            </Link>
                        </div>

                        <form action={async (formData) => {
                            "use server";
                            await editarOferta(formData);
                        }} className="flex flex-col gap-5">
                            <input type="hidden" name="id" value={oferta.id} />
                            <input type="hidden" name="localizacao" value={oferta.localizacao || ""} />

                            <div>
                                <label className="block text-sm font-bold mb-2">Nome do Produto</label>
                                <input type="text" name="titulo" defaultValue={oferta.titulo} required className="w-full px-4 py-3 bg-paper border border-line rounded-xl focus:border-amber focus:ring-1 focus:ring-amber outline-none transition-all font-medium" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Descrição</label>
                                <textarea name="descricao" defaultValue={oferta.descricao} required rows={3} className="w-full px-4 py-3 bg-paper border border-line rounded-xl focus:border-amber focus:ring-1 focus:ring-amber outline-none transition-all resize-none"></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Categoria</label>
                                    <select name="categoria" defaultValue={oferta.categoria} required className="w-full px-4 py-3 bg-paper border border-line rounded-xl focus:border-amber outline-none transition-all">
                                        <option value="">Selecione...</option>
                                        <option value="Salgados">Salgados</option>
                                        <option value="Doces">Doces</option>
                                        <option value="Assados">Assados</option>
                                        <option value="Bolos">Bolos</option>
                                        <option value="Outros">Outros</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Quantidade</label>
                                    <input type="number" name="quantidade" defaultValue={oferta.quantidade} required min="0" className="w-full px-4 py-3 bg-paper border border-line rounded-xl focus:border-amber outline-none transition-all font-medium" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-muted">Preço Original (R$)</label>
                                    <input type="number" step="0.01" name="precoOriginal" defaultValue={oferta.precoOriginal} required className="w-full px-4 py-3 bg-paper border border-line rounded-xl focus:border-amber outline-none transition-all font-medium line-through text-muted" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-success">Preço Resgate (R$)</label>
                                    <input type="number" step="0.01" name="precoResgate" defaultValue={oferta.precoResgate} required className="w-full px-4 py-3 bg-success-bg border border-success/30 rounded-xl focus:border-success outline-none transition-all font-bold text-night" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Data e Hora de Validade</label>
                                <input type="datetime-local" name="dataValidade" defaultValue={dataValidadeFormatada} required className="w-full px-4 py-3 bg-paper border border-line rounded-xl focus:border-amber outline-none transition-all font-medium" />
                            </div>

                            <div className="mt-2 mb-4">
                                <label className="block text-sm font-bold text-night mb-3">Fotos Atuais da Oferta</label>
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {[0, 1, 2].map((i) => {
                                        const img = oferta.imagemUrl?.[i];
                                        return (
                                            <div key={i} className={`aspect-square rounded-2xl border-2 flex items-center justify-center overflow-hidden bg-paper ${img ? "border-line shadow-sm" : "border-dashed border-line opacity-50"}`}>
                                                {img ? (
                                                    <img src={img} className="w-full h-full object-cover" alt={`Slot ${i + 1}`} />
                                                ) : (
                                                    <span className="text-xs text-muted font-medium">Vazio</span>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>

                                <label className="flex items-center justify-center w-full p-5 border-2 border-dashed border-line rounded-2xl bg-paper hover:bg-line/30 hover:border-amber transition-colors cursor-pointer group">
                                    <div className="flex flex-col items-center text-center">
                                        <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📤</span>
                                        <span className="text-sm font-bold text-night">Trocar fotos da oferta</span>
                                        <span className="text-[11px] text-muted mt-1 font-medium">Substituirá as imagens atuais (Máx: 3 arquivos)</span>
                                    </div>
                                    <input type="file" name="imagem" multiple accept="image/png, image/jpeg, image/webp" className="hidden" />
                                </label>
                            </div>

                            <Button type="submit" className="mt-2 bg-amber hover:bg-amber-dark text-night font-extrabold text-lg py-4 rounded-xl w-full shadow-lg shadow-amber/20 transition-all">
                                Salvar Alterações
                            </Button>
                        </form>

                        <div className="mt-12 p-6 rounded-[2rem] border-2 border-coral/30 bg-[#FFF5F5] shadow-inner relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-coral rounded-full mix-blend-multiply filter blur-[60px] opacity-20 pointer-events-none"></div>
                            <div className="relative z-10">
                                <h3 className="font-display font-bold text-xl text-coral mb-2">Zona de Perigo</h3>
                                <p className="text-sm text-night/80 mb-6 font-medium leading-relaxed">Ao excluir esta oferta, ela será permanentemente removida. Resgates já gerados continuarão válidos. Esta ação é irreversível.</p>
                                <form action={async () => {
                                    "use server";
                                    const { excluirOferta } = await import("@/app/actions/ofertas");
                                    await excluirOferta(oferta.id);
                                }}>
                                    <Button type="submit" className="w-full bg-coral hover:bg-[#d64a38] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors text-base">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                        Excluir Oferta Definitivamente
                                    </Button>
                                </form>
                            </div>
                        </div>

                    </div>
                </Container>
            </main>
        </div>
    );
}
