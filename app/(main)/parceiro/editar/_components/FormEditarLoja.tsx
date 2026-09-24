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
  cep: z.string().optional(),
  rua: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  tipoNegocio: z.enum(["RESTAURANTE", "PADARIA", "MERCADO", "DOCERIA", "OUTRO"]).optional(),
});

type EditarLojaInputs = z.infer<typeof editarLojaSchema>;

const formatarCNPJ = (v: string) => {
  v = v.replace(/\D/g, "");
  return v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d)/, "$1.$2.$3/$4-$5").slice(0, 18);
};

export default function FormEditarLoja({ usuario }: { usuario: any }) {
  const router = useRouter();
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(usuario.image || null);

  const { register, handleSubmit, setError, clearErrors, setValue, watch, formState: { errors, isSubmitting } } = useForm<EditarLojaInputs>({
    resolver: zodResolver(editarLojaSchema),
    defaultValues: {
      nome: usuario.name || "",
      email: usuario.email || "",
      telefone: usuario.telefone || "",
      cnpj: usuario.cnpj || "",
      cep: usuario.cep || "",
      rua: usuario.rua || "",
      numero: usuario.numero || "",
      bairro: usuario.bairro || "",
      cidade: usuario.cidade || "",
      estado: usuario.estado || "",
      tipoNegocio: usuario.tipoNegocio || "",
    }
  });

  const handleBuscarCep = async () => {
    const cepAtual = watch("cep");
    if (!cepAtual) return;
    const cepLimpo = cepAtual.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (data.erro) {
        appToast.erro("CEP Inválido", "Verifique o número e tente novamente.");
        return;
      }
      setValue("rua", data.logradouro, { shouldValidate: true });
      setValue("bairro", data.bairro, { shouldValidate: true });
      setValue("cidade", data.localidade, { shouldValidate: true });
      setValue("estado", data.uf, { shouldValidate: true });
      appToast.sucesso("Endereço encontrado!", "Preenchemos os campos para você.");
    } catch (e) {
      appToast.erro("Erro de conexão", "Falha ao buscar o CEP no ViaCEP.");
    }
  };

  const validarCnpjAoVivo = async (cnpjDigitado: string) => {
    const cnpjLimpo = cnpjDigitado.replace(/\D/g, "");
    if (cnpjLimpo.length !== 14) return;
    
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);
      if (!res.ok) {
        setError("cnpj", { type: "manual", message: "CNPJ não encontrado na Receita Federal" });
        return;
      }
      const data = await res.json();
      if (data.descricao_situacao_cadastral !== "ATIVA") {
        setError("cnpj", { type: "manual", message: `CNPJ inativo (Situação: ${data.descricao_situacao_cadastral})` });
        return;
      }
      clearErrors("cnpj");
    } catch (error) {
      console.error("Erro ao validar CNPJ", error);
    }
  };

  const onSubmit = async (data: EditarLojaInputs) => {
    try {
      const formData = new FormData();
      formData.append("nome", data.nome);
      formData.append("email", data.email);
      formData.append("telefone", data.telefone);
      if (data.cnpj) formData.append("cnpj", data.cnpj);
      if (data.cep) formData.append("cep", data.cep);
      if (data.rua) formData.append("rua", data.rua);
      if (data.numero) formData.append("numero", data.numero);
      if (data.bairro) formData.append("bairro", data.bairro);
      if (data.cidade) formData.append("cidade", data.cidade);
      if (data.estado) formData.append("estado", data.estado);
      if (data.tipoNegocio) formData.append("tipoNegocio", data.tipoNegocio);
      if (imagemFile) formData.append("imagem", imagemFile);

      await atualizarPerfilUsuario(formData);
      appToast.sucesso("Perfil Atualizado!", "Os dados da sua loja foram salvos com sucesso.");
      router.refresh();
      router.push("/parceiro/perfil");
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
                
                if (file.size > 5 * 1024 * 1024) {
                  appToast.erro("Arquivo muito grande", "A foto da loja deve ter no máximo 5MB.");
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
        <input 
          type="text" 
          className={inputClass} 
          {...register("cnpj", {
            onChange: (e) => e.target.value = formatarCNPJ(e.target.value),
            onBlur: (e) => validarCnpjAoVivo(e.target.value)
          })} 
        />
      </FormGroup>

      <FormGroup label="Categoria do Estabelecimento" error={errors.tipoNegocio?.message}>
        <select className={inputClass} {...register("tipoNegocio")}>
          <option value="">Selecione uma categoria...</option>
          <option value="RESTAURANTE">Restaurante</option>
          <option value="PADARIA">Padaria</option>
          <option value="MERCADO">Mercado</option>
          <option value="DOCERIA">Doceria / Confeitaria</option>
          <option value="OUTRO">Outro</option>
        </select>
      </FormGroup>

      <div className="flex flex-col gap-6 pt-4 border-t border-line">
        <h3 className="font-display font-bold text-night text-lg">Endereço Completo</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <FormGroup label="CEP" error={errors.cep?.message}>
            <input type="text" placeholder="00000-000" className={inputClass} 
              {...register("cep", { 
                onChange: (e) => e.target.value = e.target.value.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").slice(0, 9),
                onBlur: () => handleBuscarCep()
              })} />
          </FormGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <FormGroup label="Rua / Logradouro" error={errors.rua?.message}>
              <input type="text" className={inputClass} {...register("rua")} />
            </FormGroup>
          </div>
          <FormGroup label="Número" error={errors.numero?.message}>
            <input type="text" className={inputClass} {...register("numero")} />
          </FormGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormGroup label="Bairro" error={errors.bairro?.message}>
            <input type="text" className={inputClass} {...register("bairro")} />
          </FormGroup>
          <FormGroup label="Cidade" error={errors.cidade?.message}>
            <input type="text" className={inputClass} {...register("cidade")} />
          </FormGroup>
          <FormGroup label="Estado (UF)" error={errors.estado?.message}>
            <input type="text" placeholder="SP" maxLength={2} className={`${inputClass} uppercase`} {...register("estado")} />
          </FormGroup>
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} className={`mt-2 bg-amber hover:bg-amber-dark text-night font-bold py-4 rounded-xl w-full transition-all ${isSubmitting ? "opacity-50" : ""}`}>
        {isSubmitting ? "SALVANDO..." : "Salvar Alterações"}
      </button>
    </form>
  );
}
