'use client'

import Image from "next/image";
import Link from "next/link";
import { Laptop } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DealBadge, type DealRating } from "@/components/shared/deal-badge";
import { PriceDisplay } from "@/components/shared/price-display";
import { SkeletonCard } from "@/components/shared/skeleton-card";

export interface LaptopProduct {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
    specs: {
        cpu: string;
        ram: string;
        storage: string;
        screen: string;
    };
    prices: {
        retailer: string;
        price: number;
    }[];
    dealRating: DealRating;
    discountPct?: number;
}

interface LaptopCardProps {
    product?: LaptopProduct;
    isLoading?: boolean;
    onCompareChange?: (checked: boolean) => void;
    isCompared?: boolean;
}

export function LaptopCard({ product, isLoading, onCompareChange, isCompared }: LaptopCardProps) {
    if (isLoading) {
        return <SkeletonCard />;
    }

    if (!product) {
        return null; // Or return EmptyState if strictly required, but usually grid handles empty list
    }

    // Fallback image if no imageUrl
    const ImageComponent = product.imageUrl ? (
        <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform group-hover:scale-105"
            onError={(e) => {
                // This won't work server-side/build-time easily without client wrapper, 
                // but native Image has no easy fallback prop. 
                // Often better to handle at data level or use a wrapper.
                // For now, assume data quality or use a simple conditional if empty string.
            }}
        />
    ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted/20 text-muted-foreground">
            <Laptop className="h-16 w-16 opacity-50" />
        </div>
    );

    const topPrices = product.prices.slice(0, 3);
    const lowestPrice = product.prices[0]?.price || 0;

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
            {/* Badges */}
            <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
                <DealBadge rating={product.dealRating} />
                {product.discountPct && (
                    <Badge variant="secondary" className="w-fit">
                        {Math.round(product.discountPct)}% off
                    </Badge>
                )}
            </div>

            {/* Compare Checkbox */}
            <div className="absolute right-3 top-3 z-10">
                <Checkbox
                    className="bg-background/80 backdrop-blur-sm"
                    checked={isCompared}
                    onChange={(e) => onCompareChange?.(e.target.checked)}
                    aria-label={`Compare ${product.name}`}
                />
            </div>

            {/* Image Area */}
            <div className="aspect-[4/3] w-full relative bg-white">
                {ImageComponent}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
                <Link
                    href={`/laptops/${product.slug}`}
                    className="group-hover:text-primary transition-colors"
                    aria-label={`View details for ${product.name}`}
                >
                    <h3 className="line-clamp-2 min-h-[2.5rem] font-semibold text-foreground">
                        {product.name}
                    </h3>
                </Link>

                {/* Specs */}
                <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <span className="truncate" title={product.specs.cpu}>{product.specs.cpu}</span>
                    <span className="truncate" title={product.specs.ram}>{product.specs.ram}</span>
                    <span className="truncate" title={product.specs.storage}>{product.specs.storage}</span>
                    <span className="truncate" title={product.specs.screen}>{product.specs.screen}</span>
                </div>

                {/* Prices */}
                <div className="mt-4 flex-1 space-y-2">
                    {topPrices.map((price, idx) => (
                        <div key={price.retailer} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground truncate max-w-[50%]">{price.retailer}</span>
                            <PriceDisplay
                                price={price.price}
                                className={cn(idx === 0 ? "text-primary font-bold" : "text-foreground")}
                            />
                        </div>
                    ))}
                    {product.prices.length > 3 && (
                        <div className="text-xs text-muted-foreground text-right pl-1">
                            + {product.prices.length - 3} more
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-border">
                    <Button asChild className="w-full">
                        <Link href={`/laptops/${product.slug}`}>
                            View Details
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
