import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Container from "@/app/componentes/container";
import FormOferta from "@/app/componentes/FormOferta";

export default async function NovoResgate() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session || session.user.role !== "PARCEIRO") {
    redirect("/");
  }

  return (
    <div className="bg-paper min-h-screen flex flex-col font-inter">
      <hr className="border-line" />
      <main className="py-10 grow">
        <Container>
          <div className="mb-8 text-center md:text-left">
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-night tracking-tight mb-2">
              Nova Oferta
            </h1>
            <p className="text-muted text-[15px]">Preencha os detalhes para publicar um novo resgate.</p>
          </div>


          <FormOferta />

        </Container>
      </main>
    </div>
  );
}
