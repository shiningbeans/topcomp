'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

// Types based on API contract
interface LaptopPrice {
    retailer: string
    price: number
    inStock: boolean
}

export interface Laptop {
    id: string
    name: string
    slug: string
    brand: string
    model: string
    category: 'WORK' | 'GAMING' | 'APPLE'
    imageUrl: string
    cpu: string
    gpu: string
    ramGb: number
    storageGb: number
    screenSize: number
    screenRes: string
    displayType: string
    refreshRate: number
    weightLbs: number
    batteryHours: number
    dealRating: 'GREAT' | 'FAIR' | 'ABOVE_AVERAGE'
    reviewScore: number
    reviewCount: number
    lowestPrice: number
    lowestRetailer: string
    prices: LaptopPrice[]
    discountPct?: number
}

interface LaptopCardProps {
    laptop: Laptop
}

export function LaptopCard({ laptop }: LaptopCardProps) {
    // Deal badge colors based on design tokens
    const getDealBadgeColor = (rating: string) => {
        switch (rating) {
            case 'GREAT':
                return { bg: 'var(--color-deal-greatLight)', text: 'var(--color-deal-great)' }
            case 'FAIR':
                return { bg: 'var(--color-deal-fairLight)', text: 'var(--color-deal-fair)' }
            case 'ABOVE_AVERAGE':
                return { bg: 'var(--color-deal-aboveAverageLight)', text: 'var(--color-deal-aboveAverage)' }
            default:
                return { bg: 'var(--color-deal-fairLight)', text: 'var(--color-deal-fair)' }
        }
    }

    const dealColors = getDealBadgeColor(laptop.dealRating)

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="group relative flex flex-col rounded-xl border transition-all hover:shadow-md"
            style={{
                backgroundColor: 'var(--color-surface-card)',
                borderColor: 'var(--color-surface-cardBorder)',
            }}
        >
            {/* Image Container */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-xl bg-white p-4">
                <Link href={`/laptops/${laptop.slug}`} className="block h-full w-full relative">
                    <div className="relative h-full w-full transition-transform duration-300 group-hover:scale-105">
                        {/* Using a placeholder if image fails or for initial dev */}
                        <Image
                            src={laptop.imageUrl || '/placeholder-laptop.svg'}
                            alt={laptop.name}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                </Link>

                {/* Deal Rating Badge */}
                <div
                    className="absolute left-3 top-3 px-2 py-1 text-xs font-bold rounded-full uppercase tracking-wide"
                    style={{
                        backgroundColor: dealColors.bg,
                        color: dealColors.text
                    }}
                >
                    {laptop.dealRating.replace('_', ' ')} PRICE
                </div>

                {/* Discount Badge */}
                {laptop.discountPct && laptop.discountPct > 0 && (
                    <div
                        className="absolute right-3 top-3 px-2 py-1 text-xs font-bold rounded-full bg-red-600 text-white"
                    >
                        -{Math.round(laptop.discountPct)}%
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
                {/* Brand & Title */}
                <div className="mb-2">
                    <span className="text-xs font-medium text-gray-500">{laptop.brand}</span>
                    <Link href={`/laptops/${laptop.slug}`} className="block">
                        <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-gray-900 group-hover:text-primary-600">
                            {laptop.name}
                        </h3>
                    </Link>
                </div>

                {/* Review Score */}
                <div className="mb-3 flex items-center gap-1 text-xs text-yellow-500">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="font-medium text-gray-900">{laptop.reviewScore}</span>
                    <span className="text-gray-400">({laptop.reviewCount})</span>
                </div>

                {/* Key Specs */}
                <div className="mb-4 grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-600">
                    <div className="truncate" title={laptop.cpu}>{laptop.cpu}</div>
                    <div className="truncate" title={laptop.gpu}>{laptop.gpu}</div>
                    <div>{laptop.ramGb}GB / {laptop.storageGb}GB</div>
                    <div>{laptop.screenSize}" {laptop.screenRes}</div>
                </div>

                {/* Footer: Price & Retailer */}
                <div className="mt-auto flex items-end justify-between border-t pt-3">
                    <div>
                        <div className="text-xs text-gray-500">Lowest at {laptop.lowestRetailer}</div>
                        <div className="text-lg font-bold text-gray-900">
                            ${laptop.lowestPrice.toLocaleString()}
                        </div>
                    </div>
                    <Link
                        href={`/laptops/${laptop.slug}`}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors hover:opacity-90"
                        style={{ backgroundColor: 'var(--color-primary-600)' }}
                    >
                        View Deal
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
