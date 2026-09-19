import { toast } from "sonner";

export const appToast = {
  loginSuccess: (name?: string) =>
    toast.success("Login efetuado com sucesso", {
      description: name ? `Bem-vindo de volta, ${name}!` : "Bem-vindo de volta ao Salgado Salvo!",
    }),
  loginError: (message?: string) =>
    toast.error("Erro ao fazer login", {
      description: message || "Verifique suas credenciais e tente novamente.",
    }),
  cadastroSuccess: () =>
    toast.success("Conta criada com sucesso!", {
      description: "Sua conta no Salgado Salvo foi criada. Aproveite nossos resgates!",
    }),
  cadastroError: (message?: string) =>
    toast.error("Erro ao criar conta", {
      description: message || "Não foi possível concluir o cadastro. Tente novamente.",
    }),
  senhaRecuperada: () =>
    toast.info("E-mail de recuperação enviado", {
      description: "Verifique sua caixa de entrada para redefinir sua senha.",
    }),
  senhaAtualizada: () =>
    toast.success("Senha atualizada com sucesso", {
      description: "Você já pode fazer login com sua nova senha.",
    }),

  addCarrinho: (itemNome: string) =>
    toast.success("Item adicionado ao carrinho", {
      description: `${itemNome} foi adicionado.`,
    }),
  removeCarrinho: (itemNome: string, onUndo?: () => void) =>
    toast.info("Item removido", {
      description: `${itemNome} foi removido do carrinho.`,
      action: onUndo ? {
        label: "Desfazer",
        onClick: onUndo
      } : undefined
    }),
  carrinhoVazio: () =>
    toast.warning("Seu carrinho está vazio", {
      description: "Adicione alguns itens deliciosos antes de finalizar o resgate.",
    }),

  resgateSucesso: (codigo: string) =>
    toast.success("Resgate confirmado!", {
      description: `Seu pedido foi confirmado. Código do resgate: ${codigo}`,
    }),
  resgateCancelado: () =>
    toast.info("Resgate cancelado", {
      description: "Seu resgate foi cancelado com sucesso.",
    }),
  resgateErro: (message?: string) =>
    toast.error("Erro ao processar resgate", {
      description: message || "Ocorreu um problema ao finalizar seu pedido.",
    }),

  parceiroAtualizado: () =>
    toast.success("Dados atualizados", {
      description: "As informações da sua loja foram atualizadas com sucesso.",
    }),
  estoqueAtualizado: (itemNome: string) =>
    toast.success("Estoque atualizado", {
      description: `A disponibilidade de ${itemNome} foi alterada.`,
    }),


  sucesso: (titulo: string, descricao?: string) =>
    toast.success(titulo, { description: descricao }),
  erro: (titulo: string, descricao?: string) =>
    toast.error(titulo, { description: descricao }),
  aviso: (titulo: string, descricao?: string) =>
    toast.warning(titulo, { description: descricao }),
  info: (titulo: string, descricao?: string) =>
    toast.info(titulo, { description: descricao }),

  promessa: <T,>(
    promise: Promise<T> | (() => Promise<T>),
    mensagens: { carregando: string; sucesso: string | ((data: T) => string); erro: string | ((erro: any) => string) }
  ) => {
    toast.promise(promise, {
      loading: mensagens.carregando,
      success: mensagens.sucesso,
      error: mensagens.erro,
    });
  }
};
