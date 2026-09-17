import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { buscarParceirosPendentes } from "../actions/admin";
import { getMetricasAdmin } from "../actions/dashboard-admin";
import Header from "../_components/header";
import AdminMasterDetail from "./AdminMasterDetail";
import { StatsCard } from "../componentes/StatsCard";
import { DollarSign, Store, Activity } from "lucide-react";

export default async function AdminPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session || session.user.role !== "ADMIN") redirect("/");

  const parceirosPendentes = await buscarParceirosPendentes();
  const metricas = await getMetricasAdmin();

  return (
    <div className="min-h-screen flex flex-col font-inter bg-paper">
      <Header />
      <hr className="border-line" />
      <main className="flex-1 flex flex-col h-[calc(100vh-80px)]">
        <div className="p-6 md:px-8">
          <h2 className="text-2xl font-bold font-display mb-4">Painel Administrativo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              titulo="Receita Mensal (MRR)"
              valor={`R$ ${metricas.mrr.toFixed(2)}`}
              subtitulo={`${metricas.assinaturasAtivas} assinaturas ativas`}
              icone={DollarSign}
            />
            <StatsCard
              titulo="Lojas Parceiras"
              valor={metricas.totalParceiros}
              subtitulo={`${metricas.parceirosInativos} aguardando pagamento`}
              icone={Store}
            />
            <StatsCard
              titulo="Volume Negociado (GMV)"
              valor={`R$ ${metricas.gmv.toFixed(2).replace('.', ',')}`}
              subtitulo={`Resgatado por ${metricas.clientesUnicosDoMes} clientes`}
              icone={Activity}
            />
          </div>
        </div>
        <AdminMasterDetail parceiros={parceirosPendentes} />
      </main>
    </div>
  );
}
