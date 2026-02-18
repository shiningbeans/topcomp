import { DealCard } from '@/components/features/deals/deal-card'
import { Laptop } from '@/types'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Highest Rated Laptops - TopComp',
    description: 'Top rated laptops based on expert reviews from around the web.',
}

export const dynamic = 'force-dynamic';

async function getBestRated(): Promise<Laptop[]> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    try {
        const res = await fetch(`${baseUrl}/api/best-rated`, {
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

export default async function BestRatedPage() {
    const laptops = await getBestRated()

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8" aria-label="Page Header">
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Highest Rated</h1>
                <p className="text-neutral-500">
                    The critics have spoken. These are the best reviewed laptops on the market.
                </p>
            </header>

            {laptops.length === 0 ? (
                <div className="text-center py-20 bg-neutral-50 rounded-xl">
                    <p className="text-neutral-500">No rated laptops found at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list" aria-label="Highest rated laptops">
                    {laptops.map((laptop) => (
                        <DealCard key={laptop.id} laptop={laptop} />
                    ))}
                </div>
            )}
        </div>
    )
}
