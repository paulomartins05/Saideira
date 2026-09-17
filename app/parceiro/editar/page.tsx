import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Header from "@/app/_components/header";
import Container from "@/app/componentes/container";
import Button from "@/app/componentes/button";
import Link from "next/link";
import { alterarSenha, atualizarPerfilUsuario } from "@/app/actions/usuario";

export default async function EditarPerfilParceiro() {

    const reqHeaders = await headers()
    const session = await auth.api.getSession({
        headers: reqHeaders
    })

    if (!session || session.user.role !== "PARCEIRO") {
        redirect("/")
    }

    const usuarioDB = await prisma.user.findUnique({
        where: {
            id: session.user.id
        }
    })

    if (!usuarioDB) {
        redirect("/")
    }

    return (
        <div className="bg-[#F6EFE5] min-h-screen flex flex-col font-inter text-background-secondary">
            <Header />
            <hr className="opacity-10 border-background-secondary" />
            <main className="py-8 grow">
                <Container>
                    <div className="mb-8">
                        <div className="text-sm text-[#B87042] mb-4 flex items-center gap-2">
                            <Link href="/" className="hover:underline">Início</Link>
                            <span>{'>'}</span>
                            <Link href="/parceiro/perfil" className="hover:underline">Área do Parceiro</Link>
                            <span>{'>'}</span>
                            <span className="font-medium">Editar Loja</span>
                        </div>
                    </div>
                    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-playfair font-bold">Editar Dados da Loja</h1>
                            <Link href="/parceiro/perfil" className="text-sm text-gray-500 hover:underline">
                                Cancelar
                            </Link>
                        </div>
                        {/* Chama a exata mesma action do usuário comum */}
                        <form action={atualizarPerfilUsuario} className="flex flex-col gap-5">
                            <div className="flex flex-col items-center p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                                <img
                                    src={usuarioDB.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                                    alt="Sua foto atual"
                                    className="w-24 h-24 rounded-full object-cover mb-3 shadow-md"
                                />
                                <label className="text-sm font-medium mb-1">Alterar Logo da Loja</label>
                                {/* Input já corrigido sem o max={3} */}
                                <input type="file" name="imagem" accept="image/png, image/jpeg, image/webp" className="text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Nome da Loja</label>
                                <input type="text" name="nome" defaultValue={usuarioDB.name} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">E-mail Corporativo</label>
                                <input type="email" name="email" defaultValue={usuarioDB.email} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Telefone / WhatsApp</label>
                                <input type="tel" name="telefone" defaultValue={usuarioDB.telefone || ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">CNPJ</label>
                                <input type="text" name="cnpj" defaultValue={usuarioDB.cnpj || ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Rua</label>
                                    <input type="text" name="rua" defaultValue={usuarioDB.rua || ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Número</label>
                                    <input type="text" name="numero" defaultValue={usuarioDB.numero || ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                                </div>
                            </div>
                            <Button type="submit" className="mt-4 bg-[#D9774A] hover:bg-[#c4683e] text-white py-3 rounded-xl w-full font-bold">
                                Salvar Alterações
                            </Button>
                        </form>
                        <div className="mt-10 pt-8 border-t border-gray-200">
                            <h2 className="text-xl font-bold mb-6 text-laranja-destaque">Alterar Senha</h2>
                            <form action={alterarSenha} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Senha Atual</label>
                                    <input
                                        type="password"
                                        name="senhaAtual"
                                        required
                                        placeholder="Sua senha atual"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nova Senha</label>
                                    <input
                                        type="password"
                                        name="novaSenha"
                                        required
                                        placeholder="Mínimo 8 caracteres"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Confirmar Nova Senha</label>
                                    <input
                                        type="password"
                                        name="confirmarSenha"
                                        required
                                        placeholder="Repita a nova senha"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <Button type="submit" className="mt-2 bg-gray-800 hover:bg-black text-white py-3 rounded-xl w-full font-bold">
                                    Atualizar Senha
                                </Button>
                            </form>
                        </div>
                    </div>
                </Container>
            </main>
        </div>
    );
}