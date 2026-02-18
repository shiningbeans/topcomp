import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withErrorHandler } from '@/lib/api-error';
import { validateQuery } from '@/lib/validate';
import { z } from 'zod';
import { Prisma } from '@/generated/prisma/client';

const querySchema = z.object({
    category: z.enum(['WORK', 'GAMING', 'APPLE']).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    limit: z.coerce.number().min(1).max(50).default(20),
});

async function handler(req: NextRequest) {
    const { category, maxPrice, limit } = validateQuery(req, querySchema);

    // Fetch candidates
    // We fetch more than limit to perform client-side scoring and sorting
    // Heuristic: only look at laptops with known price
    const laptops = await db.laptop.findMany({
        where: {
            lowestPrice: {
                not: null,
                ...(maxPrice ? { lte: maxPrice } : {}),
            },
            ...(category ? { category } : {}),
        },
        take: 200, // Fetch top 200 candidates by price to find best value among them? 
        // Or maybe just fetch reasonably priced ones. 
        // Actually, "Budget Picks" implies we want good specs for low price.
        // Let's just fetch 200 cheapest ones that meet criteria, OR just 200 random ones under maxPrice?
        // Better: Fetch 200 with lowestPrice asc.
        orderBy: {
            lowestPrice: 'asc',
        },
        include: {
            prices: {
                orderBy: { price: 'asc' },
                take: 3,
                select: {
                    retailer: true,
                    price: true,
                    inStock: true,
                },
            },
        },
    });

    // Calculate Value Score
    // Score = (RAM * 10 + Storage * 0.5 + ReviewScore * 2) / Price
    // We want high specs, high review, low price.
    const scored = laptops.map((laptop) => {
        const price = laptop.lowestPrice || 10000;
        const ram = laptop.ramGb || 0;
        const storage = laptop.storageGb || 0;
        const review = laptop.reviewScore || 70; // Default to average if no reviews

        // Weights:
        // RAM: 16GB is good. 16 * 10 = 160.
        // Storage: 512GB is good. 512 * 0.2 = 102.
        // Review: 90 is good. 90 * 2 = 180.
        // Total utility ~ 440.
        // Price: $500. Score = 0.88.
        // Price: $1000. Score = 0.44.
        const score = (ram * 10 + storage * 0.2 + review * 2) / price;

        return { ...laptop, _valueScore: score };
    });

    // Sort by score desc
    scored.sort((a, b) => b._valueScore - a._valueScore);

    const result = scored.slice(0, limit).map(({ _valueScore, ...l }) => l);

    return NextResponse.json(
        {
            data: result,
            pagination: {
                page: 1,
                limit,
                total: result.length,
                totalPages: 1,
            },
        },
        {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
            },
        }
    );
}

export const GET = withErrorHandler(handler);
