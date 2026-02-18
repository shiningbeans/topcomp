import { SkeletonCard } from '@/components/shared/skeleton-card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-96 mb-6" />
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-10 w-24 rounded-full" />
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        </div>
    )
}
