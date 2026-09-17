import Container from "../../componentes/container";
import Header from "../../_components/header";
import FormNovoResgate from "./_components/FormNovoResgate";

export default function CadastrarNovoResgate() {
  return (
    <div className="min-h-screen flex flex-col font-inter text-night bg-paper">
      <Header />
      <hr className="border-line" />

      <main className="py-10 grow">
        <Container>
          <div className="mb-8 text-center md:text-left">
            <div className="text-[13px] text-muted mb-3 font-medium">
              Dashboard {'>'} Resgates {'>'} <span className="font-bold text-night">Novo Cadastro</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-night tracking-tight">
              Anunciar Produto
            </h1>
          </div>

          <FormNovoResgate />
        </Container>
      </main>
    </div>
  );
}
