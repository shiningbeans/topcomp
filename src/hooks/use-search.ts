'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'


interface Suggestion {
    type: 'laptop' | 'brand' | 'spec'
    text: string
    slug?: string
    url?: string
}

interface SuggestionsResponse {
    data: Suggestion[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [query, setQuery] = useState('')
    const [debouncedQuery, setDebouncedQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    // Sync internal state with URL param on mount/change
    useEffect(() => {
        const q = searchParams.get('q')
        if (q) setQuery(q)
    }, [searchParams])

    // Custom debounce for the query state to trigger API fetch
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query)
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    // Fetch suggestions when debounced query changes
    const shouldFetch = debouncedQuery.length >= 2
    const { data: suggestionsData, isLoading } = useSWR<SuggestionsResponse>(
        shouldFetch ? `/api/search/suggestions?q=${encodeURIComponent(debouncedQuery)}` : null,
        fetcher
    )

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        router.push(`/search?q=${encodeURIComponent(query)}`)
        setIsOpen(false)
    }, [query, router])

    const onSelectSuggestion = useCallback((suggestion: Suggestion) => {
        if (suggestion.type === 'laptop' && suggestion.slug) {
            router.push(`/laptops/${suggestion.slug}`)
        } else if (suggestion.url) {
            router.push(suggestion.url)
        } else {
            router.push(`/search?q=${encodeURIComponent(suggestion.text)}`)
        }
        setIsOpen(false)
        setQuery(suggestion.text)
    }, [router])

    return {
        query,
        setQuery,
        suggestions: suggestionsData?.data || [],
        isLoading,
        isOpen,
        setIsOpen,
        handleSearch,
        onSelectSuggestion
    }
}
