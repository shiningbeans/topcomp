import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-10 w-64 mb-8" />

            <div className="grid grid-cols-4 gap-4">
                <Skeleton className="h-[400px] col-span-1" />
                <Skeleton className="h-[400px] col-span-1" />
                <Skeleton className="h-[400px] col-span-1" />
                <Skeleton className="h-[400px] col-span-1 border-dashed bg-transparent" />
            </div>
        </div>
    )
}
