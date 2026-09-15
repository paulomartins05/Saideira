import { z } from "zod";
export const loginSchema = z.object({
    email: z.string().email("Digite um e-mail válido"),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    lembrarMe: z.boolean().optional(),
});
export type LoginFormInputs = z.infer<typeof loginSchema>;
