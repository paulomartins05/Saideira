

import Header from "@/app/_components/Header/header";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
}
