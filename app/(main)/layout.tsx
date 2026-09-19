import Header from "@/app/_components/Header/header";
import Footer from "../_components/footer";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main id="conteudo-principal" className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
