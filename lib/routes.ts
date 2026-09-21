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

  const rotasUsuario = [
    ...rotasComuns,
    { label: "Ofertas", path: "/resgates" },
  ];

  if (!role) {
    rotasUsuario.push({ label: "Sobre Nós", path: "/sobre-nos" });
  }

  return rotasUsuario;
};
