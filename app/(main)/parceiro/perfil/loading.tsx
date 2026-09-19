
export default function Loading() {
    return (
        <div className="min-h-screen bg-paper font-inter flex flex-col">

            <div className="border-b border-line w-full bg-card h-[72px] animate-pulse"></div>

            <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex flex-col gap-2">
                        <div className="w-48 h-8 bg-line rounded animate-pulse"></div>
                        <div className="w-64 h-4 bg-line rounded animate-pulse"></div>
                    </div>
                    <div className="w-full md:w-40 h-12 bg-line rounded-xl animate-pulse"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="h-[120px] bg-line rounded-[1.5rem] animate-pulse"></div>
                    <div className="h-[120px] bg-line rounded-[1.5rem] animate-pulse"></div>
                    <div className="h-[120px] bg-line rounded-[1.5rem] animate-pulse"></div>
                </div>

                <div className="w-full h-80 bg-card border border-line rounded-[2rem] animate-pulse p-8">
                    <div className="w-40 h-6 bg-line rounded mb-6 animate-pulse"></div>
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-full h-16 bg-line rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
}
