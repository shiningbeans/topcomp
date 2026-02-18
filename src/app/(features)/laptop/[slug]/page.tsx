import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { DetailHero } from '@/components/features/detail/detail-hero'
import { SpecTable } from '@/components/features/detail/spec-table'
import { RetailerPrices } from '@/components/features/detail/retailer-prices'
import { ReviewSummary } from '@/components/features/detail/review-summary'
import { Laptop } from '@/types'

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

async function getLaptop(slug: string): Promise<Laptop | null> {
    const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    try {
        const res = await fetch(`${baseUrl}/api/laptops/${slug}`, {
            next: { revalidate: 60 }
        })

        if (!res.ok) return null

        const json = await res.json()
        return json.data
    } catch (error) {
        // TODO: error reporting
        return null
    }
}

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const laptop = await getLaptop(slug)

    if (!laptop) {
        return {
            title: 'Laptop Not Found - TopComp',
        }
    }

    return {
        title: `${laptop.name} Price & Specs - TopComp`,
        description: `Compare prices for ${laptop.name}. Specs: ${laptop.cpu}, ${laptop.gpu}, ${laptop.ramGb}GB RAM, ${laptop.storageGb}GB SSD. Found at ${laptop.prices.length} retailers.`,
    }
}

export default async function LaptopDetailPage({ params }: PageProps) {
    const { slug } = await params
    const laptop = await getLaptop(slug)

    if (!laptop) {
        notFound()
    }

    return (
        <main className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Breadcrumb could go here */}

            <DetailHero laptop={laptop} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <SpecTable laptop={laptop} />

                    {laptop.reviewScore && (
                        <section aria-label="Expert Reviews">
                            <h2 className="text-xl font-bold mb-4">Expert Reviews</h2>
                            <ReviewSummary
                                score={laptop.reviewScore}
                                count={laptop.reviewCount}
                                summary={laptop.reviewSummary}
                            />
                        </section>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <RetailerPrices laptop={laptop} />

                        <div className="mt-6 p-4 bg-neutral-50 rounded-xl text-sm text-neutral-500">
                            <p>
                                Prices update every 30 minutes. We may earn a commission from links on this page, but this does not affect our deal ratings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
