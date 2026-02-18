import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withErrorHandler } from '@/lib/api-error';
import { validateQuery } from '@/lib/validate';
import { z } from 'zod';

const querySchema = z.object({
    q: z.string().min(2),
    limit: z.coerce.number().min(1).max(15).default(8),
});

type Suggestion = {
    type: 'laptop' | 'brand' | 'spec';
    text: string;
    slug?: string;
    url?: string;
    priority?: number;
};

// Curated list of search keywords for "spec" suggestions
const COMMON_SPECS = [
    { text: 'Gaming Laptops', url: '/gaming' },
    { text: 'Work Laptops', url: '/work' },
    { text: 'MacBooks', url: '/apple' },
    { text: 'RTX 4060', url: '/gaming?gpuModel=RTX+4060' },
    { text: 'RTX 4070', url: '/gaming?gpuModel=RTX+4070' },
    { text: 'RTX 4080', url: '/gaming?gpuModel=RTX+4080' },
    { text: 'RTX 4090', url: '/gaming?gpuModel=RTX+4090' },
    { text: 'OLED Display', url: '/laptops?displayType=OLED' },
    { text: 'Touchscreen', url: '/laptops?touchscreen=true' },
    { text: '32GB RAM', url: '/laptops?minRam=32' },
    { text: '1TB Storage', url: '/laptops?minStorage=1024' },
    { text: 'Intel Core i7', url: '/laptops?cpuModel=Core+i7' },
    { text: 'Intel Core i9', url: '/laptops?cpuModel=Core+i9' },
    { text: 'AMD Ryzen 7', url: '/laptops?cpuModel=Ryzen+7' },
    { text: 'AMD Ryzen 9', url: '/laptops?cpuModel=Ryzen+9' },
];

const BRANDS = ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI', 'Razer', 'Samsung', 'Microsoft', 'LG', 'Gigabyte'];

async function handler(req: NextRequest) {
    const { q, limit } = validateQuery(req, querySchema);
    const queryLower = q.toLowerCase();

    const suggestions: Suggestion[] = [];

    // 1. Search Brands
    const matchedBrands = BRANDS.filter((b) => b.toLowerCase().includes(queryLower));
    for (const brand of matchedBrands) {
        suggestions.push({
            type: 'brand',
            text: brand,
            url: `/laptops?brand=${encodeURIComponent(brand)}`,
            priority: 100, // High priority
        });
    }

    // 2. Search Specs / Categories
    const matchedSpecs = COMMON_SPECS.filter((s) => s.text.toLowerCase().includes(queryLower));
    for (const spec of matchedSpecs) {
        suggestions.push({
            type: 'spec',
            text: spec.text,
            url: spec.url,
            priority: 80,
        });
    }

    // 3. Search Laptops (DB)
    // We only fetch enough to fill the remaining slots + some buffer
    const dbLimit = Math.max(limit - suggestions.length + 2, 5);

    const laptops = await db.laptop.findMany({
        where: {
            OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { model: { contains: q, mode: 'insensitive' } },
            ],
        },
        take: dbLimit,
        select: {
            name: true,
            slug: true,
            category: true,
        },
    });

    for (const laptop of laptops) {
        suggestions.push({
            type: 'laptop',
            text: laptop.name,
            slug: laptop.slug,
            priority: 50,
        });
    }

    // Sort by priority then alphabetical? Or just priority.
    // We want exact matches first?
    // Let's just sort strictly by priority for now.
    suggestions.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    return NextResponse.json(
        { data: suggestions.slice(0, limit) },
        {
            headers: {
                'Cache-Control': 'public, s-maxage=300', // 5 minutes
            },
        }
    );
}

export const GET = withErrorHandler(handler);
