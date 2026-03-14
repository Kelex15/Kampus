import { Skeleton } from "@/components/ui/skeleton";

export default function DiscoverSkeleton() {
    return (
        <div className="pt-24 sm:pt-28 pb-16 px-5 sm:px-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10">
                    <div className="flex items-center gap-4 mb-3">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div>
                            <Skeleton className="h-8 w-52 mb-2" />
                            <Skeleton className="h-5 w-36" />
                        </div>
                    </div>
                    <Skeleton className="h-16 w-full rounded-2xl mt-5" />
                </div>

                <Skeleton className="h-14 w-full rounded-2xl mb-6" />

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div
                            key={i}
                            className="p-6 rounded-2xl border border-[#e2e1dc] bg-white"
                        >
                            <div className="flex items-center gap-2.5 mb-4">
                                <Skeleton className="h-6 w-14 rounded-lg" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                            <Skeleton className="h-5 w-3/4 mb-1.5" />
                            <Skeleton className="h-5 w-1/2 mb-4" />
                            <div className="flex gap-4">
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}