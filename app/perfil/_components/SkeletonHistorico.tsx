import { History, PackageCheck, TrendingDown } from "lucide-react";

export function SkeletonHistorico() {
    return (
        <div className="animate-pulse">
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-night/10 rounded-[20px] p-6 h-[140px]"></div>
                <div className="bg-amber/30 rounded-[20px] p-6 h-[140px]"></div>
            </div>

            <div className="bg-card border border-line rounded-[20px] p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6 border-b border-line pb-4">
                    <History className="w-5 h-5 text-muted" />
                    <h2 className="font-display font-extrabold text-lg">Histórico Recente</h2>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="h-16 bg-line/50 rounded-xl"></div>
                    <div className="h-16 bg-line/50 rounded-xl"></div>
                </div>
            </div>
        </div>
    );
}
