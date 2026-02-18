import { CategoryGrid } from '@/components/features/browsing/category-grid'

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 h-10 w-48 rounded bg-gray-200 animate-pulse" />
            <div className="flex gap-8">
                {/* Sidebar Skeleton */}
                <div className="hidden w-[280px] shrink-0 lg:block">
                    <div className="h-[600px] w-full rounded bg-gray-100 animate-pulse" />
                </div>

                {/* Main Content Skeleton */}
                <div className="flex-1">
                    <div className="mb-6 h-10 w-full rounded bg-gray-100 animate-pulse" />
                    <CategoryGrid laptops={[]} isLoading={true} isEmpty={false} />
                </div>
            </div>
        </div>
    )
}
