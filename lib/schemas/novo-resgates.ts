import { z } from "zod";

export const novoResgateSchema = z.object({
  nome: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres."),
  descricao: z.string().min(10, "Detalhe melhor os ingredientes do seu lanche."),
  categoria: z.string().min(1, "Você precisa selecionar uma categoria acima."),
  precoOriginal: z.string().min(1, "Obrigatório"),
  precoResgate: z.string().min(1, "Obrigatório"),
  quantidade: z.number({ message: "Obrigatório" }).min(1, "Mínimo de 1."),
  validade: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Informe um horário válido (HH:MM)"),
  termosAceitos: z.boolean().refine((val) => val === true, {
    message: "Você precisa aceitar os termos de contrato.",
  }),

  cep: z.string().min(8, "CEP inválido"),
  rua: z.string().min(1, "Rua é obrigatória"),
  numero: z.string().min(1, "Número é obrigatório"),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().min(2, "Estado é obrigatório"),
}).refine((data) => {
  const pOrig = Number(data.precoOriginal.replace(/\./g, "").replace(",", "."));
  const pResg = Number(data.precoResgate.replace(/\./g, "").replace(",", "."));
  return pResg < pOrig;
}, {
  message: "Atenção: O Preço de Resgate deve ser MENOR que o Preço Normal!",
  path: ["precoResgate"],
});

export type NovoResgateFormInputs = z.infer<typeof novoResgateSchema>;
