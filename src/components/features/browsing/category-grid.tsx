'use client'

import { Laptop, LaptopCard } from '@/components/features/browsing/laptop-card'
import { FeatureCard } from '@/components/shared/feature-card'
import { SearchX } from 'lucide-react'

interface CategoryGridProps {
    laptops: Laptop[]
    isLoading: boolean
    isEmpty: boolean
}

export function CategoryGrid({ laptops, isLoading, isEmpty }: CategoryGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="aspect-[16/10] w-full rounded-xl border p-4 animate-pulse"
                        style={{
                            backgroundColor: 'var(--color-surface-muted)',
                            borderColor: 'var(--color-surface-border)',
                        }}
                    />
                ))}
            </div>
        )
    }

    if (isEmpty) {
        return (
            <div className="py-12">
                <FeatureCard
                    title="No laptops found"
                    description="Try adjusting your filters or search criteria to find what you're looking for."
                    icon={<SearchX className="h-6 w-6 text-gray-400" />}
                    isEmpty={true}
                />
            </div>
        )
    }

    return (
        <section aria-label="Laptop results" role="region" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div role="list" className="contents">
                {laptops.map((laptop) => (
                    <div key={laptop.id} role="listitem" className="contents">
                        <LaptopCard laptop={laptop} />
                    </div>
                ))}
            </div>
        </section>
    )
}
