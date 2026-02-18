'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFilters } from '@/hooks/use-filters'

interface FilterOption {
    value: string | number
    count: number
    label?: string
}

interface FilterSectionProps {
    title: string
    filterKey: string
    options: FilterOption[]
    type?: 'checkbox' | 'radio' // Default to checkbox
}

export function FilterSection({ title, filterKey, options, type = 'checkbox' }: FilterSectionProps) {
    const [isOpen, setIsOpen] = useState(true)
    const { updateFilter, isSelected } = useFilters()

    const handleToggle = (value: string | number) => {
        if (type === 'radio') {
            // For radio, if it's already selected, clicking again might deselect or do nothing
            // Let's assume clicking a selected radio deselects it for now (toggle behavior)
            updateFilter(filterKey, value, 'toggle')
        } else {
            updateFilter(filterKey, value, 'toggle')
        }
    }

    if (!options || options.length === 0) return null

    return (
        <div className="border-b py-4 last:border-0" style={{ borderColor: 'var(--color-surface-border)' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between py-2 text-left font-medium hover:text-primary-600 focus:outline-none"
                style={{ color: 'var(--color-surface-foreground)' }}
            >
                <span>{title}</span>
                {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-2 pt-2">
                            {options.map((option) => {
                                const checked = isSelected(filterKey, option.value)
                                const id = `filter-${filterKey}-${option.value}`

                                return (
                                    <div key={option.value} className="flex items-center">
                                        <input
                                            id={id}
                                            type={type}
                                            checked={checked}
                                            onChange={() => handleToggle(option.value)}
                                            className={`h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 ${type === 'radio' ? 'rounded-full' : ''}`}
                                            aria-label={`${type === 'radio' ? 'Select' : 'Filter by'} ${option.label || option.value} (${option.count} results)`}
                                        />
                                        <label
                                            htmlFor={id}
                                            className="ml-2 flex flex-1 items-center justify-between text-sm cursor-pointer select-none"
                                            style={{ color: 'var(--color-surface-foreground)' }}
                                        >
                                            <span className={checked ? 'font-medium' : ''}>
                                                {option.label || option.value}
                                            </span>
                                            <span className="text-xs text-gray-400 ml-2 tabular-nums">
                                                ({option.count})
                                            </span>
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
