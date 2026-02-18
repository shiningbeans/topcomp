import { Laptop } from '@/types'
import { LaptopCard, type LaptopProduct } from '@/components/shared/laptop-card'
import { cn } from '@/lib/utils'
import { useComparison } from '@/hooks/use-comparison'

interface DealCardProps {
    laptop: Laptop
    className?: string
}

export function DealCard({ laptop, className }: DealCardProps) {
    // Map global Laptop type to shared LaptopProduct type
    const product: LaptopProduct = {
        id: laptop.id,
        name: laptop.name,
        slug: laptop.slug,
        imageUrl: laptop.imageUrl,
        specs: {
            cpu: laptop.cpuModel, // Using model for brevity
            ram: `${laptop.ramGb}GB`,
            storage: `${laptop.storageGb}GB`,
            screen: `${laptop.screenSize}"`
        },
        prices: laptop.prices.map(p => ({
            retailer: p.retailer,
            price: p.price
        })),
        dealRating: laptop.dealRating || 'FAIR',
        discountPct: laptop.prices[0]?.discountPct
    }


    const { isInComparison, addToCompare, removeFromCompare, isAtLimit } = useComparison()
    const isCompared = isInComparison(laptop.slug)

    return (
        <div className={cn("relative", className)}>
            <div className="absolute -top-2 -right-2 z-20 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-3 animate-pulse">
                SAVE {Math.round(product.discountPct || 0)}%
            </div>
            <LaptopCard
                product={product}
                isCompared={isCompared}
                onCompareChange={(checked) => {
                    if (checked) {
                        if (!isAtLimit) addToCompare(laptop.slug)
                    } else {
                        removeFromCompare(laptop.slug)
                    }
                }}
            />
        </div>
    )
}
