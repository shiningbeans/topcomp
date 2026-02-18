import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withErrorHandler, ApiError } from '@/lib/api-error';

async function handler(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    const { slug } = params;

    if (!slug) {
        throw ApiError.validation('Slug is required');
    }

    const laptop = await db.laptop.findUnique({
        where: { slug },
        include: {
            prices: {
                orderBy: { price: 'asc' },
            },
        },
    });

    if (!laptop) {
        throw ApiError.notFound(`Laptop not found: ${slug}`);
    }

    return NextResponse.json(
        { data: laptop },
        {
            headers: {
                'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
            },
        }
    );
}

export const GET = withErrorHandler(handler);
