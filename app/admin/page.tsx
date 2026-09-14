import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { buscarParceirosPendentes } from "../actions/admin";
import Header from "../pages/header";
import AdminMasterDetail from "./AdminMasterDetail";

export default async function AdminPage() {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });

    if (!session || session.user.role !== "ADMIN") redirect("/");

    const parceirosPendentes = await buscarParceirosPendentes();

    return (
        <div className="min-h-screen flex flex-col font-inter bg-paper">
            <Header />
            <hr className="border-line" />
            <main className="flex-1 flex flex-col h-[calc(100vh-80px)]">
                <AdminMasterDetail parceiros={parceirosPendentes} />
            </main>
        </div>
    );
}
