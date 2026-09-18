import { z } from "zod";

export const cadastroSchema = z.object({
  tipoConta: z.enum(["consumidor", "parceiro"]),
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().min(1, "O e-mail é obrigatório.").email("Digite um e-mail válido."),
  senha: z.string().min(8, "A senha deve possuir 8 caracteres"),
  confirmarSenha: z.string().min(1, "Confirme sua senha"),
  telefone: z.string().min(8, "Digite um número de telefone válido"),
  localizacao: z.string().optional(),
  cnpj: z.string().optional(),
  tipoNegocio: z.string().optional(),
  cep: z.string().optional(),
  rua: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.senha !== data.confirmarSenha) {
    ctx.addIssue({ code: "custom", message: "As senhas não coincidem", path: ["confirmarSenha"] });
  }
  if (data.tipoConta === "parceiro") {
    if (!data.cnpj || data.cnpj.trim() === "") ctx.addIssue({ code: "custom", message: "CNPJ é obrigatório", path: ["cnpj"] });
    if (!data.tipoNegocio || data.tipoNegocio.trim() === "") ctx.addIssue({ code: "custom", message: "Selecione o tipo do negócio", path: ["tipoNegocio"] });
    if (!data.cep || data.cep.length < 8) ctx.addIssue({ code: "custom", message: "CEP inválido", path: ["cep"] });
    if (!data.rua || data.rua.trim() === "") ctx.addIssue({ code: "custom", message: "Rua é obrigatória", path: ["rua"] });
    if (!data.numero || data.numero.trim() === "") ctx.addIssue({ code: "custom", message: "Número é obrigatório", path: ["numero"] });
    if (!data.bairro || data.bairro.trim() === "") ctx.addIssue({ code: "custom", message: "Bairro é obrigatório", path: ["bairro"] });
    if (!data.cidade || data.cidade.trim() === "") ctx.addIssue({ code: "custom", message: "Cidade é obrigatória", path: ["cidade"] });
    if (!data.estado || data.estado.trim() === "") ctx.addIssue({ code: "custom", message: "Estado é obrigatório", path: ["estado"] });
  }
});

export type CadastroFormInputs = z.infer<typeof cadastroSchema>;
