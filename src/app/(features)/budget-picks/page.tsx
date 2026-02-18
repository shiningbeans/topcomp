import { DealCard } from '@/components/features/deals/deal-card'
import { Laptop } from '@/types'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Best Budget Laptops - TopComp',
    description: 'Top rated budget laptops with the best price-to-performance ratio.',
}

export const dynamic = 'force-dynamic';

// Fetch budget picks from API
async function getBudgetPicks(maxPrice?: number): Promise<Laptop[]> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const query = maxPrice ? `?maxPrice=${maxPrice}` : ''

    try {
        const res = await fetch(`${baseUrl}/api/budget-picks${query}`, {
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

interface PageProps {
    searchParams: Promise<{ maxPrice?: string }>
}

const PRICE_TIERS = [500, 800, 1000]

export default async function BudgetPicksPage({ searchParams }: PageProps) {
    const { maxPrice } = await searchParams
    const selectedMaxPrice = maxPrice ? parseInt(maxPrice) : undefined

    const laptops = await getBudgetPicks(selectedMaxPrice)

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8" aria-label="Page Header">
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Best Value Picks</h1>
                <p className="text-neutral-500 mb-6">
                    High-performance laptops that don't break the bank. Ordered by specs-to-price ratio.
                </p>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2" role="group" aria-label="Price range filters">
                    <Button
                        variant={!selectedMaxPrice ? "secondary" : "outline"}
                        asChild
                        className="rounded-full"
                        aria-pressed={!selectedMaxPrice}
                    >
                        <Link href="/budget-picks">All Budgets</Link>
                    </Button>
                    {PRICE_TIERS.map(price => (
                        <Button
                            key={price}
                            variant={selectedMaxPrice === price ? "secondary" : "outline"}
                            asChild
                            className="rounded-full"
                            aria-pressed={selectedMaxPrice === price}
                        >
                            <Link href={`/budget-picks?maxPrice=${price}`}>Under ${price}</Link>
                        </Button>
                    ))}
                </div>
            </header>

            {laptops.length === 0 ? (
                <div className="text-center py-20 bg-neutral-50 rounded-xl">
                    <p className="text-neutral-500">No budget picks found for this price range.</p>
                    <Button variant="link" asChild className="mt-2">
                        <Link href="/budget-picks">View all budget picks</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list" aria-label="Budget laptop listings">
                    {laptops.map((laptop) => (
                        <DealCard key={laptop.id} laptop={laptop} />
                    ))}
                </div>
            )}
        </div>
    )
}
