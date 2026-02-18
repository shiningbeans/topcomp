'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

// Types for available filter options from API
interface FilterOptions {
    brands: { value: string; count: number }[]
    cpuBrands: { value: string; count: number }[]
    cpuModels: { value: string; count: number }[]
    gpuBrands: { value: string; count: number }[]
    gpuModels: { value: string; count: number }[]
    screenSizes: number[]
    displayTypes: string[]
    ramOptions: number[]
    storageOptions: number[]
    osOptions: string[]
    priceRange: { min: number; max: number }
    categories: string[]
}

interface FiltersResponse {
    data: FilterOptions
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useFilters() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // 1. Fetch available options
    // We pass current params to /api/filters so it returns accurate counts/options based on CURRENT selection
    // e.g. if Brand=Apple is selected, OS options should only show macOS
    const queryString = searchParams.toString()
    const { data: filterOptions, isLoading } = useSWR<FiltersResponse>(
        `/api/filters?${queryString}`,
        fetcher
    )

    // 2. Helper to updating URL
    const updateFilter = useCallback(
        (key: string, value: string | number | null, mode: 'set' | 'append' | 'toggle' = 'set') => {
            const params = new URLSearchParams(searchParams.toString())

            if (value === null) {
                params.delete(key)
            } else {
                const strValue = String(value)

                switch (mode) {
                    case 'set':
                        params.set(key, strValue)
                        break
                    case 'append':
                        // Should verify if it already exists to avoid duplicates
                        const current = params.get(key)
                        if (current) {
                            const values = current.split(',')
                            if (!values.includes(strValue)) {
                                params.set(key, [...values, strValue].join(','))
                            }
                        } else {
                            params.set(key, strValue)
                        }
                        break
                    case 'toggle':
                        const currentToggle = params.get(key)
                        if (currentToggle) {
                            const values = currentToggle.split(',')
                            if (values.includes(strValue)) {
                                const newValues = values.filter(v => v !== strValue)
                                if (newValues.length > 0) {
                                    params.set(key, newValues.join(','))
                                } else {
                                    params.delete(key)
                                }
                            } else {
                                params.set(key, [...values, strValue].join(','))
                            }
                        } else {
                            params.set(key, strValue)
                        }
                        break
                }
            }

            // Reset page to 1 on any filter change
            if (params.has('page')) {
                params.set('page', '1')
            }

            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        },
        [router, pathname, searchParams]
    )

    // 3. Helper to clear all filters
    const clearFilters = useCallback(() => {
        router.replace(pathname, { scroll: false })
    }, [router, pathname])

    // 4. Helper to check if a value is selected
    const isSelected = useCallback(
        (key: string, value: string | number) => {
            const current = searchParams.get(key)
            if (!current) return false
            return current.split(',').includes(String(value))
        },
        [searchParams]
    )

    return {
        filters: filterOptions?.data,
        isLoading,
        updateFilter,
        clearFilters,
        isSelected,
        searchParams // Expose raw params if needed
    }
}
