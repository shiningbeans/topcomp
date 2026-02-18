import { Laptop } from '@/types'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface DetailHeroProps {
    laptop: Laptop
}

export function DetailHero({ laptop }: DetailHeroProps) {
    // Determine badge color based on deal rating
    const dealColor = {
        GREAT: 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200',
        FAIR: 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200',
        ABOVE_AVERAGE: 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200'
    }[laptop.dealRating || 'FAIR']

    const dealLabel = {
        GREAT: 'Great Price',
        FAIR: 'Fair Price',
        ABOVE_AVERAGE: 'Above Average'
    }[laptop.dealRating || 'FAIR']

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-10">
            {/* Image Side */}
            <div className="relative aspect-[4/3] bg-white rounded-2xl border border-neutral-200 p-8 flex items-center justify-center shadow-sm">
                {laptop.dealRating && (
                    <div className="absolute top-4 left-4 z-10">
                        <Badge className={`${dealColor} border shadow-none px-3 py-1 text-sm font-semibold`}>
                            {dealLabel}
                        </Badge>
                    </div>
                )}

                {laptop.imageUrl ? (
                    <Image
                        src={laptop.imageUrl}
                        alt={laptop.name}
                        width={600}
                        height={450}
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-300">
                        {/* Placeholder SVG */}
                        <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Info Side */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="text-neutral-500 border-neutral-300">
                        {laptop.brand}
                    </Badge>
                    <Badge variant="outline" className="text-neutral-500 border-neutral-300">
                        {laptop.category}
                    </Badge>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight mb-4">
                    {laptop.name}
                </h1>

                <p className="text-neutral-500 text-lg mb-8 leading-relaxed">
                    {laptop.cpuModel} • {laptop.gpuBrand} {laptop.gpu} • {laptop.ramGb}GB RAM • {laptop.storageGb}GB SSD
                </p>

                <div className="flex flex-col gap-2">
                    <span className="text-sm text-neutral-500 font-medium">Best Price</span>
                    <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-mono font-bold text-neutral-900">
                            ${laptop.lowestPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-neutral-500 font-medium">
                            at {laptop.lowestRetailer}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
