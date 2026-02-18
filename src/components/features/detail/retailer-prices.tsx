import { Laptop, RetailerPrice } from '@/types'
import { ExternalLink, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RetailerPricesProps {
    laptop: Laptop
}

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
}

function isStale(dateString: string): boolean {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    return diffInHours > 2
}

export function RetailerPrices({ laptop }: RetailerPricesProps) {
    // Sort prices: In stock first, then by price asc
    const sortedPrices = [...laptop.prices].sort((a, b) => {
        if (a.inStock && !b.inStock) return -1
        if (!a.inStock && b.inStock) return 1
        return a.price - b.price
    })

    return (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/50 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-neutral-900">Compare Retailers</h3>
                <span className="text-xs text-neutral-500 font-medium">
                    {laptop.prices.length} retailers tracked
                </span>
            </div>

            <div className="divide-y divide-neutral-100">
                {sortedPrices.map((price, idx) => (
                    <div key={price.retailer} className="p-4 sm:px-6 hover:bg-neutral-50 transition-colors group">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                            {/* Retailer Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-neutral-900">{price.retailer}</h4>
                                    {!price.inStock && (
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                                            Unavailable
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                    <Clock className="w-3 h-3" />
                                    <span>Checked {formatTimeAgo(price.lastChecked)}</span>
                                    {isStale(price.lastChecked) && (
                                        <span className="flex items-center gap-1 text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded">
                                            <AlertTriangle className="w-3 h-3" />
                                            Price may be outdated
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Price & Action */}
                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                <div className="text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="text-lg font-mono font-medium text-neutral-900">
                                            ${price.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </span>
                                        {price.inStock && price.originalPrice && price.originalPrice > price.price && (
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <span className="line-through text-neutral-400">
                                                    ${price.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </span>
                                                <span className="text-green-600 font-bold bg-green-50 px-1 rounded">
                                                    -{Math.round(((price.originalPrice - price.price) / price.originalPrice) * 100)}%
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    asChild
                                    variant={idx === 0 && price.inStock ? "default" : "outline"}
                                    disabled={!price.inStock}
                                    className="w-32 shrink-0"
                                >
                                    <a
                                        href={price.retailerUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2"
                                    >
                                        {price.inStock ? 'Buy Now' : 'Out of Stock'}
                                        {price.inStock && <ExternalLink className="w-3 h-3" />}
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
