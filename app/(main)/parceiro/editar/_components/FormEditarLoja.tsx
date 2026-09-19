"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { atualizarPerfilUsuario } from "@/app/actions/usuario";
import { appToast } from "@/lib/toast";
import FormGroup from "@/app/componentes/FormGroup";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";

const editarLojaSchema = z.object({
  nome: z.string().min(2, "O nome precisa ter pelo menos 2 caracteres."),
  email: z.string().email("E-mail inválido."),
  telefone: z.string().min(10, "Telefone muito curto."),
  cnpj: z.string().optional(),
  rua: z.string().optional(),
  numero: z.string().optional(),
});

type EditarLojaInputs = z.infer<typeof editarLojaSchema>;

export default function FormEditarLoja({ usuario }: { usuario: any }) {
  const router = useRouter();
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(usuario.image || null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EditarLojaInputs>({
    resolver: zodResolver(editarLojaSchema),
    defaultValues: {
      nome: usuario.name || "",
      email: usuario.email || "",
      telefone: usuario.telefone || "",
      cnpj: usuario.cnpj || "",
      rua: usuario.rua || "",
      numero: usuario.numero || "",
    }
  });

  const onSubmit = async (data: EditarLojaInputs) => {
    try {
      const formData = new FormData();
      formData.append("nome", data.nome);
      formData.append("email", data.email);
      formData.append("telefone", data.telefone);
      if (data.cnpj) formData.append("cnpj", data.cnpj);
      if (data.rua) formData.append("rua", data.rua);
      if (data.numero) formData.append("numero", data.numero);
      if (imagemFile) formData.append("imagem", imagemFile);

      await atualizarPerfilUsuario(formData);
      appToast.sucesso("Perfil Atualizado!", "Os dados da sua loja foram salvos com sucesso.");
      router.refresh();
    } catch (error: any) {
      appToast.erro("Erro ao atualizar", error.message || "Tente novamente mais tarde.");
    }
  };

  const inputClass = "w-full bg-paper border border-line rounded-xl py-3 px-4 text-[14.5px] font-medium text-night placeholder:text-muted focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-colors";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-line rounded-2xl bg-paper hover:bg-line/20 transition-colors">
        <img
          src={imagemPreview || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
          alt="Foto da Loja"
          className="w-24 h-24 rounded-full object-cover mb-4 shadow-sm border border-line"
        />
        <label className="flex items-center gap-2 cursor-pointer group">
          <span className="bg-night text-amber p-2 rounded-full group-hover:scale-110 transition-transform">
            <Upload className="w-4 h-4" />
          </span>
          <span className="text-[14px] font-bold text-night">Alterar Foto da Loja</span>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                setImagemFile(file);
                setImagemPreview(URL.createObjectURL(file));
              }
            }}
          />
        </label>
      </div>

      <FormGroup label="Nome da Loja" error={errors.nome?.message}>
        <input type="text" className={inputClass} {...register("nome")} />
      </FormGroup>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormGroup label="E-mail Corporativo" error={errors.email?.message}>
          <input type="email" className={inputClass} {...register("email")} />
        </FormGroup>

        <FormGroup label="Telefone / WhatsApp" error={errors.telefone?.message}>
          <input type="tel" className={inputClass} {...register("telefone")} />
        </FormGroup>
      </div>

      <FormGroup label="CNPJ" error={errors.cnpj?.message}>
        <input type="text" className={inputClass} {...register("cnpj")} />
      </FormGroup>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormGroup label="Rua" error={errors.rua?.message}>
          <input type="text" className={inputClass} {...register("rua")} />
        </FormGroup>

        <FormGroup label="Número" error={errors.numero?.message}>
          <input type="text" className={inputClass} {...register("numero")} />
        </FormGroup>
      </div>

      <button type="submit" disabled={isSubmitting} className={`mt-2 bg-amber hover:bg-amber-dark text-night font-bold py-4 rounded-xl w-full transition-all ${isSubmitting ? "opacity-50" : ""}`}>
        {isSubmitting ? "SALVANDO..." : "Salvar Alterações"}
      </button>
    </form>
  );
}
