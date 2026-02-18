'use client'

import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Laptop, Tag, Cpu, ArrowRight } from 'lucide-react'
import { useSearch } from '@/hooks/use-search'

export function SearchTypeahead() {
    const {
        query,
        setQuery,
        suggestions,
        isLoading,
        isOpen,
        setIsOpen,
        handleSearch,
        onSelectSuggestion
    } = useSearch()

    const containerRef = useRef<HTMLDivElement>(null)

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [setIsOpen])

    return (
        <div ref={containerRef} className="relative w-full max-w-sm lg:max-w-md">
            <form onSubmit={handleSearch} className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                    type="text"
                    className="block w-full rounded-md border py-2 pl-10 pr-3 leading-5 placeholder-gray-500 focus:border-primary-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                    aria-label="Search laptops, brands, or specs"
                    style={{
                        borderColor: 'var(--color-surface-border)',
                        backgroundColor: 'var(--color-surface-background)',
                        color: 'var(--color-surface-foreground)',
                    }}
                    placeholder="Search laptops, brands, or specs..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setIsOpen(true)
                    }}
                    onFocus={() => {
                        if (query.length >= 2) setIsOpen(true)
                    }}
                />
            </form>

            <AnimatePresence>
                {isOpen && suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.1 }}
                        className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border shadow-lg"
                        style={{
                            backgroundColor: 'var(--color-surface-card)',
                            borderColor: 'var(--color-surface-border)',
                        }}
                    >
                        <ul className="max-h-96 overflow-y-auto py-1">
                            {suggestions.map((suggestion, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => onSelectSuggestion(suggestion)}
                                        className="flex w-full items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                                            {suggestion.type === 'laptop' && <Laptop className="h-4 w-4 text-gray-500" />}
                                            {suggestion.type === 'brand' && <Tag className="h-4 w-4 text-gray-500" />}
                                            {suggestion.type === 'spec' && <Cpu className="h-4 w-4 text-gray-500" />}
                                        </span>
                                        <div className="ml-3 flex-1 overflow-hidden">
                                            <p className="truncate text-sm font-medium text-gray-900">{suggestion.text}</p>
                                            <p className="truncate text-xs text-gray-400 capitalize">{suggestion.type}</p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                            <li className="border-t border-gray-100">
                                <button
                                    onClick={handleSearch}
                                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-primary-600 hover:bg-gray-50"
                                >
                                    <span>View all results for "{query}"</span>
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
