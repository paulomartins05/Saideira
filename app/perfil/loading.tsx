import Header from "../_components/header";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Loading() {
    return (
        <div className="bg-paper min-h-screen flex flex-col font-inter">
            <Header />
            <main className="pb-10">
                <div className="max-w-[800px] mx-auto px-7 pt-7">

                    {/* Breadcrumbs Skeleton */}
                    <div className="flex items-center gap-1.5 mb-6">
                        <div className="w-12 h-4 bg-line rounded animate-pulse"></div>
                        <ChevronRight className="w-3.5 h-3.5 text-muted" />
                        <div className="w-24 h-4 bg-line rounded animate-pulse"></div>
                    </div>

                    {/* Profile Header Skeleton */}
                    <div className="bg-card border border-line rounded-[20px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 mb-6">
                        <div className="w-[88px] h-[88px] rounded-full bg-line animate-pulse shrink-0"></div>
                        <div className="flex flex-col gap-3 grow items-center md:items-start w-full">
                            <div className="w-48 h-8 bg-line rounded animate-pulse"></div>
                            <div className="w-32 h-4 bg-line rounded animate-pulse"></div>
                        </div>
                        <div className="w-24 h-10 bg-line rounded-lg animate-pulse shrink-0 mt-4 md:mt-0"></div>
                    </div>

                    {/* Stats Grid Skeleton */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="h-40 bg-line rounded-[20px] animate-pulse"></div>
                        <div className="h-40 bg-line rounded-[20px] animate-pulse"></div>
                    </div>

                    {/* History Section Skeleton */}
                    <div className="bg-card border border-line rounded-[20px] p-6 md:p-8">
                        <div className="flex items-center gap-2 mb-6 border-b border-line pb-4">
                            <div className="w-6 h-6 bg-line rounded-full animate-pulse"></div>
                            <div className="w-32 h-6 bg-line rounded animate-pulse"></div>
                        </div>
                        <div className="flex flex-col gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex justify-between items-center border-b border-line pb-4 last:border-0 last:pb-0">
                                    <div className="flex flex-col gap-2">
                                        <div className="w-32 h-5 bg-line rounded animate-pulse"></div>
                                        <div className="w-20 h-3 bg-line rounded animate-pulse"></div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="w-16 h-4 bg-line rounded animate-pulse"></div>
                                        <div className="w-12 h-3 bg-line rounded animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
