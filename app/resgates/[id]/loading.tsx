import Header from "@/app/pages/header";

export default function Loading() {
    return (
        <div className="bg-paper min-h-screen font-inter flex flex-col">
            <Header />
            
            {/* Fake countdown band */}
            <div className="w-full h-[52px] bg-night animate-pulse"></div>
            
            <main className="max-w-6xl mx-auto px-6 py-8 md:py-12 w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                
                {/* Skeleton Galeria */}
                <div className="flex flex-col gap-4">
                    <div className="w-full aspect-square bg-line rounded-[2rem] animate-pulse"></div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="aspect-square bg-line rounded-2xl animate-pulse"></div>
                        <div className="aspect-square bg-line rounded-2xl animate-pulse"></div>
                        <div className="aspect-square bg-line rounded-2xl animate-pulse"></div>
                    </div>
                </div>
                
                {/* Skeleton Informações */}
                <div className="flex flex-col gap-5 pt-2 md:pt-4">
                    <div className="w-28 h-8 bg-line rounded-full animate-pulse mb-2"></div>
                    <div className="w-full h-12 bg-line rounded-xl animate-pulse"></div>
                    <div className="w-3/4 h-12 bg-line rounded-xl animate-pulse"></div>
                    
                    <div className="w-full h-32 bg-line rounded-2xl animate-pulse mt-4"></div>
                    
                    <div className="w-full h-56 bg-line rounded-[2rem] animate-pulse mt-6"></div>
                </div>
                
            </main>
        </div>
    );
}
