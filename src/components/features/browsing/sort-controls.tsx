'use client'

import { useFilters } from '@/hooks/use-filters'

const SORT_OPTIONS = [
    { label: 'Price: Low to High', value: 'price-asc', sortBy: 'price', order: 'asc' },
    { label: 'Price: High to Low', value: 'price-desc', sortBy: 'price', order: 'desc' },
    { label: 'Biggest Discount', value: 'discount-desc', sortBy: 'discount', order: 'desc' },
    { label: 'Highest Rated', value: 'rating-desc', sortBy: 'reviewScore', order: 'desc' },
    { label: 'Newest Arrivals', value: 'newest-desc', sortBy: 'newest', order: 'desc' },
]

export function SortControls() {
    const { updateFilter, searchParams } = useFilters()

    const currentSortBy = searchParams.get('sortBy') || 'price'
    const currentOrder = searchParams.get('order') || 'asc'
    const currentValue = `${currentSortBy}-${currentOrder}`

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = SORT_OPTIONS.find((opt) => opt.value === e.target.value)
        if (selected) {
            updateFilter('sortBy', selected.sortBy)
            updateFilter('order', selected.order)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                Sort by:
            </label>
            <select
                id="sort"
                value={currentValue}
                onChange={handleChange}
                className="rounded-md border py-1.5 pl-3 pr-8 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                aria-label="Sort results"
                style={{
                    borderColor: 'var(--color-surface-border)',
                    backgroundColor: 'var(--color-surface-background)',
                    color: 'var(--color-surface-foreground)',
                }}
            >
                {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
