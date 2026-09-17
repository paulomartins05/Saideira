import Header from "../_components/header";
import ContatoForm from "./contato-form";

export default function ContatoPage() {
  return (
    <div className="bg-paper min-h-screen flex flex-col font-inter text-night">
      <Header />
      <hr className="border-line" />

      <main className="py-12 grow flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full bg-card p-8 rounded-3xl shadow-sm border border-line">
          <h1 className="text-2xl font-display font-bold text-center mb-2">
            Fale com a gente
          </h1>
          <p className="text-sm text-muted text-center mb-6">
            Dúvida, sugestão ou problema com um resgate? Manda pra gente.
          </p>

          <ContatoForm />
        </div>
      </main>
    </div>
  );
}
