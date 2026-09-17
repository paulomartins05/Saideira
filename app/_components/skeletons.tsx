
export function OfertaCardSkeleton() {
    return (
        <div className="bg-card border border-line rounded-xl overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-muted/30"></div>

            <div className="p-3.5 space-y-3">
                <div className="h-3 w-1/3 bg-muted/30 rounded"></div>
                <div className="h-4 w-3/4 bg-muted/30 rounded"></div>

                <div className="flex items-center justify-between pt-2">
                    <div className="h-3 w-1/4 bg-muted/30 rounded"></div>
                    <div className="h-5 w-1/3 bg-muted/30 rounded"></div>
                </div>
            </div>
        </div>
    );
}

export function ResgatesSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <OfertaCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function CategoriasSkeleton() {
    return (
        <section className="pt-6 pb-2">
            <div className="max-w-[1160px] mx-auto px-7">
                <div className="flex gap-2 border-b-[1.5px] border-line mb-6 overflow-x-hidden pb-[2px]">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-10 w-24 bg-muted/30 rounded animate-pulse"></div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function TicketSkeleton() {
    return (
        <div className="bg-card border border-line rounded-[20px] p-5 mb-4 animate-pulse flex flex-col md:flex-row gap-5">
            <div className="w-full md:w-[120px] h-[120px] bg-line rounded-xl shrink-0" />

            <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                    <div className="h-4 bg-line rounded-md w-1/4 mb-3" />
                    <div className="h-6 bg-line rounded-md w-3/4 mb-4" />
                </div>
                <div className="h-10 bg-line rounded-lg w-full md:w-1/3" />
            </div>
        </div>
    );
}
