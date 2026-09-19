export default function Loading() {
    return (
        <div className="flex-1 flex overflow-hidden min-h-[calc(100vh-80px)]">

            <div className="w-full md:w-1/3 md:max-w-[350px] border-r border-line bg-card flex-col h-full flex">
                <div className="p-5 border-b border-line shrink-0">
                    <div className="w-40 h-6 bg-line rounded animate-pulse mb-2"></div>
                    <div className="w-28 h-4 bg-line rounded animate-pulse"></div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="p-5 border-b border-line w-full flex flex-col gap-2">
                            <div className="w-3/4 h-5 bg-line rounded animate-pulse"></div>
                            <div className="w-1/2 h-4 bg-line rounded animate-pulse"></div>
                            <div className="w-20 h-5 bg-line rounded mt-1 animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 bg-paper p-4 md:p-10 hidden md:block">
                <div className="max-w-2xl mx-auto">
                    <div className="w-full h-[500px] bg-card border border-line rounded-[2rem] animate-pulse shadow-sm p-8 flex flex-col gap-6">
                        <div className="flex gap-4 items-center">
                            <div className="w-16 h-16 bg-line rounded-2xl animate-pulse"></div>
                            <div className="flex flex-col gap-2">
                                <div className="w-48 h-6 bg-line rounded animate-pulse"></div>
                                <div className="w-32 h-4 bg-line rounded animate-pulse"></div>
                            </div>
                        </div>
                        <div className="w-full h-32 bg-line rounded-xl animate-pulse"></div>
                        <div className="w-full h-12 bg-line rounded-xl animate-pulse mt-auto"></div>
                    </div>
                </div>
            </div>

        </div>
    );
}
