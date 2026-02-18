import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withErrorHandler } from '@/lib/api-error';
import { validateQuery } from '@/lib/validate';
import { z } from 'zod';
import { Prisma } from '@/generated/prisma/client';

const dealsQuerySchema = z.object({
    category: z.enum(['WORK', 'GAMING', 'APPLE']).optional(),
    limit: z.coerce.number().min(1).max(50).default(20),
});

type LaptopWithPrices = Prisma.LaptopGetPayload<{
    include: {
        prices: {
            select: { retailer: true; price: true; inStock: true };
        };
    };
}>;

async function handler(req: NextRequest) {
    const { category, limit } = validateQuery(req, dealsQuerySchema);

    // We fetch 3x the limit to account for duplicates (same laptop, multiple deals)
    const fetchLimit = limit * 3;

    const topPrices = await db.price.findMany({
        where: {
            discountPct: { gt: 0 },
            ...(category ? { laptop: { category } } : {}),
        },
        orderBy: {
            discountPct: 'desc',
        },
        take: fetchLimit,
        include: {
            laptop: {
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
            },
        },
    });

    const seenLaptops = new Set<string>();
    const laptops: LaptopWithPrices[] = [];

    for (const p of topPrices) {
        if (!seenLaptops.has(p.laptopId)) {
            seenLaptops.add(p.laptopId);
            // The included 'laptop' has 'prices' from the nested include.
            // However, the Price type from findMany is (Price & { laptop: (Laptop & { prices: ... }) })
            // So p.laptop is compatible with LaptopWithPrices
            laptops.push(p.laptop as unknown as LaptopWithPrices);
        }
        if (laptops.length >= limit) break;
    }

    return NextResponse.json(
        {
            data: laptops,
            pagination: {
                page: 1,
                limit,
                total: laptops.length,
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
