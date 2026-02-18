import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
    return (
        <div
            className="flex flex-col space-y-3 rounded-lg border border-border bg-card p-4 shadow-sm"
            role="status"
            aria-label="Loading laptop card"
        >
            <Skeleton className="h-48 w-full rounded-md" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="mt-4 flex items-center justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-24" />
            </div>
            <div className="space-y-2 pt-4">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
            </div>
        </div>
    );
}
