export const getHeaderRoutes = (role?: string | null) => {
  const rotasComuns = [
    { label: "Início", path: "/" },
  ];

  if (role === "PARCEIRO") {
    return [
      ...rotasComuns,
      { label: "Painel do Parceiro", path: "/parceiro/perfil" }
    ];
  }

  return [
    ...rotasComuns,
    { label: "Ofertas", path: "/resgates" },
    { label: "Cadastre seu Restaurante", path: "/contato" }
  ];
};
