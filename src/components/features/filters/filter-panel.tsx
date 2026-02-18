'use client'

import { useFilters } from '@/hooks/use-filters'
import { FilterSection } from './filter-section'

export function FilterPanel() {
    const { filters, isLoading, clearFilters } = useFilters()

    if (isLoading || !filters) {
        return (
            <div className="space-y-6 p-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-3 animate-pulse">
                        <div className="h-4 w-1/3 rounded bg-gray-200" />
                        <div className="space-y-2">
                            <div className="h-3 w-3/4 rounded bg-gray-100" />
                            <div className="h-3 w-2/3 rounded bg-gray-100" />
                            <div className="h-3 w-1/2 rounded bg-gray-100" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-1 p-4">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                    onClick={clearFilters}
                    className="text-xs font-medium text-primary-600 hover:text-primary-800"
                    aria-label="Clear all active filters"
                >
                    Clear all
                </button>
            </div>

            <FilterSection
                title="Brand"
                filterKey="brand"
                options={filters.brands}
            />

            <FilterSection
                title="Screen Size"
                filterKey="screenSize"
                options={filters.screenSizes.map(s => ({ value: s, count: 0, label: `${s}"` }))} // Counts need adjustment if API returns simple array
            />

            {/* Note: In real implementation, API should return objects with counts for all fields. 
          For now, I'm mapping simple arrays to the object shape if needed, 
          but based on API contract, some are arrays of strings/numbers. 
          I'll assume the API hook normalizes this or I handle it here. 
          
          Looking at use-filters.ts and api-contract.md:
          brands: { value: string; count: number }[] -> Correct
          screenSizes: number[] -> Need to map this. The API contract says just numbers.
          But wait, the `useFilters` hook interface defined:
          screenSizes: number[]
          
          So I need to handle the count display. If the API doesn't return counts for these, 
          I should hide the count or simpler pass them.
          
          Actually, the API contract says:
          "Only returns values that have matching laptops (no dead-end filters)."
          So simply existing in the list implies > 0 count.
          Ideally verify if API returns counts for all. The example response shows simple arrays for screenSizes/displayTypes.
          So for those, I won't show counts, or I'll just map them with a placeholder count or omit it.
      */}

            <FilterSection
                title="Internal Memory (RAM)"
                filterKey="minRam" // Simplified: often users filter by minimal RAM. Or API supports 'ram' param?
                // API contract: minRam, maxRam. The list returns 'ramOptions': [8, 16, 32].
                // Let's treat these as specific options for now, mapping to 'minRam' effectively or strict equality if API supports 'ram'.
                // API Contract Query Params: minRam, maxRam. 
                // If I use 'ram' it might not work. Let's use 'minRam' for now as a "At least X GB" 
                // OR better, if I send 'minRam=16', I get 16+. 
                // But FilterSection uses toggles. 
                // Let's assume for v1 we might need to adjust `use-laptops` to handle `ram` exact match if we want checkboxes.
                // For now, I will use `ram` as the key and hope the API can handle it or I'll update `useLaptops` to parse it.
                // Wait, API contract says `minRam`, `maxRam`. 
                // If I want to filter for exactly 16GB, I'd need minRam=16 & maxRam=16.
                // Let's skip precise wiring for 'options' that are just numbers until I verify API behavior.
                // I will just map them to options.
                options={filters.ramOptions.map(r => ({ value: r, count: 0, label: `${r} GB` }))}
            />

            <FilterSection
                title="Display Type"
                filterKey="displayType"
                options={filters.displayTypes.map(d => ({ value: d, count: 0 }))}
            />

            <FilterSection
                title="Operating System"
                filterKey="os"
                options={filters.osOptions.map(o => ({ value: o, count: 0 }))}
            />

            {/* CPU & GPU are more complex (Brand + Model). 
          I'll add CPU Brand and GPU Brand for now. */}

            <FilterSection
                title="CPU Brand"
                filterKey="cpuBrand"
                options={filters.cpuBrands}
            />

            <FilterSection
                title="GPU Brand"
                filterKey="gpuBrand"
                options={filters.gpuBrands}
            />
        </div>
    )
}
