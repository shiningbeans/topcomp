import { renderHook, act } from '@testing-library/react'
import { useSearch } from '@/hooks/use-search'
import { vi, describe, it, expect } from 'vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
}))

// Mock SWR
vi.mock('swr', () => ({
    default: (key: string | null) => ({
        data: key ? { data: [{ text: 'Suggestion' }] } : undefined,
        isLoading: false
    })
}))

describe('useSearch', () => {
    it('should initialize with empty query', () => {
        const { result } = renderHook(() => useSearch())
        expect(result.current.query).toBe('')
    })

    it('should update query when setQuery is called', () => {
        const { result } = renderHook(() => useSearch())
        act(() => {
            result.current.setQuery('test')
        })
        expect(result.current.query).toBe('test')
    })
})
