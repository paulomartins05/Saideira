import ContatoForm from "./contato-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserCircle2 } from "lucide-react";

export default async function ContatoPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="bg-paper min-h-screen flex flex-col font-inter text-night">
      <hr className="border-line" />

      <main className="py-12 grow flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full bg-card p-8 rounded-3xl shadow-sm border border-line">
          <h1 className="text-2xl font-display font-bold text-center mb-2">
            Fale com a gente
          </h1>
          <p className="text-sm text-muted text-center mb-6">
            Dúvida, sugestão ou problema com um resgate? Manda pra gente.
          </p>

          <div className="bg-line/30 rounded-xl p-4 mb-6 flex items-center gap-3 border border-line/50">
            <div className="w-10 h-10 bg-night text-amber rounded-full flex items-center justify-center shrink-0">
              <UserCircle2 className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[13px] font-bold text-night truncate">
                Enviando como {session.user.name}
              </p>
              <p className="text-xs text-muted truncate">
                {session.user.email}
              </p>
            </div>
          </div>

          <ContatoForm />
        </div>
      </main>
    </div>
  );
}
