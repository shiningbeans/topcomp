import { DealRating } from '@/generated/prisma/client';

export interface DealRatingResult {
    rating: DealRating;
    lowestPrice: number;
    lowestRetailer: string;
    median: number;
}

export function computeDealRating(prices: { price: number; retailer: string }[]): DealRatingResult | null {
    if (!prices.length) return null;

    // Sort prices
    const sorted = [...prices].sort((a, b) => a.price - b.price);
    const lowest = sorted[0];
    const lowestPrice = lowest.price;
    const lowestRetailer = lowest.retailer;

    // Compute Median
    const values = sorted.map((p) => p.price);
    const mid = Math.floor(values.length / 2);
    const median = values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;

    // Determine Rating
    // GREAT: >= 15% below median
    // FAIR: within 15% of median
    // ABOVE_AVERAGE: > 15% above median (rare for "lowest" to be above average, unless only one price exists?)
    // If only 1 price, median = price. lowest = price.
    // 100 vs 100. Diff is 0. It is "FAIR".

    // Logic: 
    // percentage diff = (median - lowest) / median
    // if diff >= 0.15 -> GREAT (it is 15% cheaper than median)

    // Wait, if "lowest" is the one we are creating rating FOR.
    // The Laptop has ONE dealRating.
    // Represents "Is the current lowest price a good deal compared to market?"

    // If all retailers have same price, diff is 0 => FAIR.
    // If Amazon is 800, BestBuy is 1000. Median = 900.
    // Lowest = 800. (900-800)/900 = 0.11 (11%). => FAIR.
    // If Amz 700, BB 1000. Med 850. (850-700)/850 = 0.17 (17%). => GREAT.

    let rating: DealRating = 'FAIR';

    if (prices.length > 1) {
        const diff = (median - lowestPrice) / median;
        if (diff >= 0.15) {
            rating = 'GREAT';
        } else if (lowestPrice > median * 1.15) {
            // This case shouldn't happen if we are rating the *lowest* price against median.
            // Unless we are rating a specific price?
            // But the function returns `lowestPrice`.
            rating = 'ABOVE_AVERAGE';
        }
    }

    return {
        rating,
        lowestPrice,
        lowestRetailer,
        median,
    };
}
