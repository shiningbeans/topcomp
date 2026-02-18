import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withErrorHandler, ApiError } from '@/lib/api-error';
import { computeDealRating } from '@/lib/deal-rating';

async function handler(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        throw ApiError.unauthorized('Invalid CRON_SECRET');
    }

    // Optimize: Iterate in batches if many laptops
    const laptops = await db.laptop.findMany({
        include: {
            prices: true,
        },
    });

    let updatedCount = 0;

    for (const laptop of laptops) {
        const result = computeDealRating(laptop.prices);
        if (result) {
            await db.laptop.update({
                where: { id: laptop.id },
                data: {
                    lowestPrice: result.lowestPrice,
                    lowestRetailer: result.lowestRetailer,
                    dealRating: result.rating,
                },
            });
            updatedCount++;
        }
    }

    return NextResponse.json({ status: 'ok', laptopsUpdated: updatedCount });
}

export const POST = withErrorHandler(handler);
