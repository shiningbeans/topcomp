'use client'

import { useComparison } from '@/hooks/use-comparison'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Laptop } from '@/types'

export function ComparisonTrayContent() {
    const { comparedSlugs, removeFromCompare, clearComparison, count } = useComparison()
    const [laptops, setLaptops] = useState<Laptop[]>([])

    useEffect(() => {
        if (comparedSlugs.length === 0) {
            setLaptops([])
            return
        }

        const fetchLaptops = async () => {
            try {
                const promises = comparedSlugs.map(slug =>
                    fetch(`/api/laptops/${slug}`).then(r => r.ok ? r.json() : null)
                )
                const results = await Promise.all(promises)
                const data = results.map(r => r?.data).filter(Boolean)
                setLaptops(data)
            } catch (e) {
                // TODO: error reporting
            }
        }

        fetchLaptops()
    }, [comparedSlugs])

    if (count === 0) return null

    return (
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-4 overflow-x-auto py-2">
                <span className="font-semibold text-neutral-900 whitespace-nowrap">
                    Compare ({count} of 3)
                </span>

                <div className="flex items-center gap-2">
                    {laptops.map(laptop => (
                        <div key={laptop.slug} className="relative group w-12 h-12 bg-white rounded border border-neutral-200 p-1 flex-shrink-0">
                            {laptop.imageUrl ? (
                                <Image
                                    src={laptop.imageUrl}
                                    alt={laptop.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="w-full h-full bg-neutral-100" />
                            )}
                            <button
                                onClick={() => removeFromCompare(laptop.slug)}
                                aria-label={`Remove ${laptop.name} from comparison`}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    {/* Placeholders for remaining slots */}
                    {Array.from({ length: 3 - count }).map((_, i) => (
                        <div key={i} className="w-12 h-12 border border-dashed border-neutral-300 rounded flex items-center justify-center text-neutral-300 text-xs">
                            +
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={clearComparison} className="text-neutral-500">
                    Clear all
                </Button>
                <Button asChild disabled={count < 2}>
                    <Link href={`/compare?compare=${comparedSlugs.join(',')}`}>
                        Compare Now
                    </Link>
                </Button>
            </div>
        </div>
    )
}
