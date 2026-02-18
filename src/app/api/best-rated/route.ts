import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withErrorHandler } from '@/lib/api-error';
import { validateQuery } from '@/lib/validate';
import { z } from 'zod';

const querySchema = z.object({
    category: z.enum(['WORK', 'GAMING', 'APPLE']).optional(),
    minReviewScore: z.coerce.number().min(0).max(100).default(70),
    limit: z.coerce.number().min(1).max(50).default(20),
});

async function handler(req: NextRequest) {
    const { category, minReviewScore, limit } = validateQuery(req, querySchema);

    const laptops = await db.laptop.findMany({
        where: {
            reviewScore: { gte: minReviewScore },
            ...(category ? { category } : {}),
        },
        orderBy: {
            reviewScore: 'desc',
        },
        take: limit,
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
