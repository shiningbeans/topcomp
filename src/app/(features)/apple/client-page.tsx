'use client'

import { CategoryGrid } from '@/components/features/browsing/category-grid'
import { SortControls } from '@/components/features/browsing/sort-controls'
import { useLaptops } from '@/hooks/use-laptops'
import { Suspense } from 'react'
import { FilterPanel } from '@/components/features/filters/filter-panel'

function ApplePageContent() {
    const { laptops, isLoading, error } = useLaptops({ category: 'APPLE' })
    const isEmpty = !isLoading && laptops.length === 0

    if (error) {
        throw new Error(error.message)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Apple Laptops</h1>
                <SortControls />
            </div>

            <div className="flex gap-8">
                <aside className="hidden w-[280px] shrink-0 lg:block">
                    <FilterPanel />
                </aside>

                <main className="flex-1">
                    <CategoryGrid laptops={laptops} isLoading={isLoading} isEmpty={isEmpty} />
                </main>
            </div>
        </div>
    )
}

export default function ApplePageClient() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
            <ApplePageContent />
        </Suspense>
    )
}
