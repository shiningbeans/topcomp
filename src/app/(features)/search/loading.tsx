export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 h-10 w-64 rounded bg-gray-200 animate-pulse" />
            <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-24 w-full rounded bg-gray-100 animate-pulse" />
                ))}
            </div>
        </div>
    )
}
