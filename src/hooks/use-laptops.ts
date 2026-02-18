'use client'

import useSWR from 'swr'
import { useSearchParams } from 'next/navigation'
import { Laptop } from '@/components/features/browsing/laptop-card' // Import shared type later

interface UseLaptopsParams {
    category?: string
    initialData?: Laptop[]
}

interface PaginationData {
    page: number
    limit: number
    total: number
    totalPages: number
}

interface LaptopsResponse {
    data: Laptop[]
    pagination: PaginationData
}

const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}))
        throw new Error(errorBody.error?.message || 'Failed to fetch laptops')
    }
    return res.json()
}

export function useLaptops({ category }: UseLaptopsParams = {}) {
    const searchParams = useSearchParams()

    // Construct query string from params
    const queryString = new URLSearchParams(searchParams.toString())

    // Force category if provided (override URL param if it conflicts, or add it)
    if (category) {
        queryString.set('category', category)
    }

    // Define SWR key
    const key = `/api/laptops?${queryString.toString()}`

    const { data, error, isLoading, mutate } = useSWR<LaptopsResponse>(key, fetcher, {
        keepPreviousData: true, // Keep showing old data while fetching new filter results
        revalidateOnFocus: false,
        dedupingInterval: 60000, // 1 minute
    })

    return {
        laptops: data?.data || [],
        pagination: data?.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 },
        isLoading,
        error,
        mutate,
    }
}
