import { DealCard } from '@/components/features/deals/deal-card'
import { Laptop } from '@/types'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Top Laptop Deals - TopComp',
    description: 'Best laptop deals from across the web. Updated every 30 minutes.',
}

export const dynamic = 'force-dynamic';

async function getDeals(): Promise<Laptop[]> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    try {
        const res = await fetch(`${baseUrl}/api/deals?limit=20`, {
            next: { revalidate: 300 } // 5 minutes
        })
        if (!res.ok) return []
        const json = await res.json()
        return json.data || []
    } catch (error) {
        // TODO: error reporting
        return []
    }
}

export default async function DealsPage() {
    const deals = await getDeals()

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8" aria-label="Page Header">
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Top Deals Right Now</h1>
                <p className="text-neutral-500">
                    The biggest price drops across all our tracked retailers.
                </p>
            </header>

            {deals.length === 0 ? (
                <div className="text-center py-20 bg-neutral-50 rounded-xl">
                    <p className="text-neutral-500">No deals found at the moment. Check back soon!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list" aria-label="Deal listings">
                    {deals.map((laptop) => (
                        <DealCard key={laptop.id} laptop={laptop} />
                    ))}
                </div>
            )}
        </div>
    )
}
