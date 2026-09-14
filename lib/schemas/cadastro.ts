import { z } from "zod";

export const cadastroSchema = z.object({
  tipoConta: z.enum(["consumidor", "parceiro"]),
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().min(1, "O e-mail é obrigatório.").email("Digite um e-mail válido."),
  senha: z.string().min(6, "A senha deve possuir 6 caracteres"),
  confirmarSenha: z.string().min(1, "Confirme sua senha"),
  telefone: z.string().min(8, "Digite um número de telefone válido"),
  localizacao: z.string().optional(),
  cnpj: z.string().optional(),
  tipoNegocio: z.string().optional(),
  cep: z.string().min(8, "CEP inválido"),
  rua: z.string().min(1, "Rua é obrigatória"),
  numero: z.string().min(1, "Número é obrigatório"),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().min(2, "Estado é obrigatório"),
}).superRefine((data, ctx) => {
  if (data.senha !== data.confirmarSenha) {
    ctx.addIssue({ code: "custom", message: "As senhas não coincidem", path: ["confirmarSenha"] });
  }
  if (data.tipoConta === "parceiro") {
    if (!data.cnpj || data.cnpj.trim() === "") ctx.addIssue({ code: "custom", message: "CNPJ é obrigatório", path: ["cnpj"] });
    if (!data.tipoNegocio || data.tipoNegocio.trim() === "") ctx.addIssue({ code: "custom", message: "Selecione o tipo do negócio", path: ["tipoNegocio"] });
  }
});

export type CadastroFormInputs = z.infer<typeof cadastroSchema>;
