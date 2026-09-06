import Header from "../pages/header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ContatoForm from "./contato-form";
export default async function Contato() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="bg-[#F6EFE5] min-h-screen flex flex-col">
      <Header />
      <hr className="opacity-10 border-background-secondary" />

      <main className="py-12 grow flex flex-col items-center justify-center px-6 font-inter">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-playfair font-bold text-center mb-2">Fale com a gente</h1>
          <p className="text-sm text-gray-600 text-center mb-6">
            Dúvida, sugestão ou problema com um resgate? Manda pra gente.
          </p>

          <ContatoForm />
        </div>
      </main>
    </div>
  );
}