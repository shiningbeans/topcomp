import { SkeletonCard } from '@/components/shared/skeleton-card'

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <div className="h-8 w-64 bg-neutral-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-96 bg-neutral-200 rounded animate-pulse" />
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        </div>
    )
}
