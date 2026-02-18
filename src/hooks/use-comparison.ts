'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

const MAX_COMPARE = 3
const PARAM_NAME = 'compare'

export function useComparison() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const comparedSlugs = useMemo(() => {
        const param = searchParams.get(PARAM_NAME)
        if (!param) return []
        return param.split(',').filter(Boolean)
    }, [searchParams])

    const updateComparison = useCallback((slugs: string[]) => {
        const params = new URLSearchParams(searchParams.toString())
        if (slugs.length > 0) {
            params.set(PARAM_NAME, slugs.join(','))
        } else {
            params.delete(PARAM_NAME)
        }
        // Use replace to prevent history stack buildup for every toggle
        router.replace(`?${params.toString()}`, { scroll: false })
    }, [router, searchParams])

    const addToCompare = useCallback((slug: string) => {
        if (comparedSlugs.includes(slug)) return
        if (comparedSlugs.length >= MAX_COMPARE) return
        updateComparison([...comparedSlugs, slug])
    }, [comparedSlugs, updateComparison])

    const removeFromCompare = useCallback((slug: string) => {
        updateComparison(comparedSlugs.filter(s => s !== slug))
    }, [comparedSlugs, updateComparison])

    const clearComparison = useCallback(() => {
        updateComparison([])
    }, [updateComparison])

    const isInComparison = useCallback((slug: string) => {
        return comparedSlugs.includes(slug)
    }, [comparedSlugs])

    return {
        comparedSlugs,
        addToCompare,
        removeFromCompare,
        clearComparison,
        isInComparison,
        isAtLimit: comparedSlugs.length >= MAX_COMPARE,
        count: comparedSlugs.length,
        canAdd: comparedSlugs.length < MAX_COMPARE
    }
}
