"use client";
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { atualizarPerfilUsuario } from "@/app/actions/usuario"
import { appToast } from "@/lib/toast"
import FormGroup from "@/app/componentes/FormGroup"
import { Upload, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"


const editarConsumidorSchema = z.object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    telefone: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

type EditarConsumidorInputs = z.infer<typeof editarConsumidorSchema>

export default function FormEditarConsumidor({ usuario }: { usuario: any }) {

    const router = useRouter();
    const [imagemFile, setImagemFile] = useState<File | null>(null);
    const [imagemPreview, setImagemPreview] = useState<string | null>(usuario.image || null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EditarConsumidorInputs>({
        resolver: zodResolver(editarConsumidorSchema),
        defaultValues: {
            nome: usuario.name || "",
            email: usuario.email || "",
            telefone: usuario.telefone || "",
        }
    })

    const onSubmit = async (data: EditarConsumidorInputs) => {
        try {

            const formData = new FormData();
            formData.append("nome", data.nome);
            formData.append("email", data.email);
            if (data.telefone) formData.append("telefone", data.telefone);
            if (imagemFile) formData.append("imagem", imagemFile);
            await atualizarPerfilUsuario(formData);
            appToast.sucesso("Perfil Atualizado!", "Seus dados foram salvos com sucesso.");
            router.refresh();

        } catch (error: any) {
            appToast.erro("Erro ao atualizar", error.message || "Tente novamente mais tarde.");

        }
    }

    const inputClass = "w-full bg-paper border border-line rounded-xl py-3 px-4 text-[14.5px] font-medium text-night placeholder:text-muted focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-colors";
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-line rounded-2xl bg-paper hover:bg-line/20 transition-colors">
                <img
                    src={imagemPreview || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    alt="Sua foto"
                    className="w-24 h-24 rounded-full object-cover mb-4 shadow-sm border border-line"
                />
                <label className="flex items-center gap-2 cursor-pointer group">
                    <span className="bg-night text-amber p-2 rounded-full group-hover:scale-110 transition-transform">
                        <Upload className="w-4 h-4" />
                    </span>
                    <span className="text-[14px] font-bold text-night">Alterar Foto de Perfil</span>
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];

                                if (file.size > 5 * 1024 * 1024) {
                                    appToast.erro("Arquivo muito grande", "Sua foto deve ter no máximo 5MB.");
                                    e.target.value = "";
                                    return;
                                }

                                setImagemFile(file);
                                setImagemPreview(URL.createObjectURL(file));
                            }
                        }}
                    />
                </label>
            </div>
            <FormGroup label="Nome Completo" error={errors.nome?.message}>
                <input type="text" className={inputClass} {...register("nome")} />
            </FormGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup label="E-mail" error={errors.email?.message}>
                    <input type="email" className={inputClass} {...register("email")} />
                </FormGroup>

                <FormGroup label="Telefone / WhatsApp" error={errors.telefone?.message}>
                    <input type="tel" className={inputClass} {...register("telefone")} />
                </FormGroup>
            </div>
            <button type="submit" disabled={isSubmitting} className={`mt-2 bg-amber hover:bg-amber-dark text-night font-bold py-4 rounded-xl w-full transition-all ${isSubmitting ? "opacity-50" : ""}`}>
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Salvando...
                    </span>
                ) : (
                    "Salvar Alterações"
                )}
            </button>

        </form>
    );
}
