'use client'

import React, { useCallback, useEffect, useState } from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { useFilters } from '@/hooks/use-filters'
// import { cn } from '@/lib/utils' // Assuming utils exist, or I'll inline styles

interface PriceRangeSliderProps {

}

export function PriceRangeSlider({ }: PriceRangeSliderProps) {
    const { filters, updateFilter, searchParams } = useFilters()
    const minPrice = filters?.priceRange?.min ?? 0
    const maxPrice = filters?.priceRange?.max ?? 5000

    // Local state for smooth sliding before committing to URL
    const [localValue, setLocalValue] = useState([minPrice, maxPrice])

    // Sync with URL params on mount or external change
    useEffect(() => {
        const currentMin = Number(searchParams.get('minPrice')) || minPrice
        const currentMax = Number(searchParams.get('maxPrice')) || maxPrice
        setLocalValue([currentMin, currentMax])
    }, [searchParams, minPrice, maxPrice])

    const handleValueChange = (newValue: number[]) => {
        setLocalValue(newValue)
    }

    const handleValueCommit = (newValue: number[]) => {
        updateFilter('minPrice', newValue[0])
        updateFilter('maxPrice', newValue[1])
    }

    return (
        <div className="border-b py-4" style={{ borderColor: 'var(--color-surface-border)' }}>
            <div className="mb-4 flex items-center justify-between">
                <span className="font-medium text-sm" style={{ color: 'var(--color-surface-foreground)' }}>Price Range</span>
            </div>

            <SliderPrimitive.Root
                className="relative flex w-full touch-none select-none items-center"
                value={localValue}
                min={minPrice}
                max={maxPrice}
                step={50}
                minStepsBetweenThumbs={1}
                onValueChange={handleValueChange}
                onValueCommit={handleValueCommit}
            >
                <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200">
                    <SliderPrimitive.Range className="absolute h-full bg-primary-600" />
                </SliderPrimitive.Track>
                {localValue.map((_, index) => (
                    <SliderPrimitive.Thumb
                        key={index}
                        className="block h-4 w-4 rounded-full border border-primary-600 bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50"
                    />
                ))}
            </SliderPrimitive.Root>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="rounded border px-2 py-1 bg-white">
                    ${localValue[0]}
                </div>
                <div className="rounded border px-2 py-1 bg-white">
                    ${localValue[1]}
                </div>
            </div>
        </div>
    )
}
