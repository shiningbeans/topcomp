import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl animate-pulse">
            {/* Hero Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-10">
                <Skeleton className="aspect-[4/3] rounded-2xl w-full" />
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-16 w-1/2 mt-4" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Specs Skeleton */}
                    <div className="border rounded-xl p-6 space-y-4">
                        <Skeleton className="h-8 w-1/3 mb-4" />
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex justify-between">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    {/* Prices Skeleton */}
                    <div className="border rounded-xl p-6 space-y-4">
                        <Skeleton className="h-8 w-1/2 mb-4" />
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between items-center py-2">
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
