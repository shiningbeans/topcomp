import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withErrorHandler } from '@/lib/api-error';

async function handler() {
    // Run all aggregations in parallel
    const [
        brands,
        cpuBrands,
        cpuModels,
        gpuBrands,
        gpuModels,
        screenSizes,
        displayTypes,
        ramOptions,
        storageOptions,
        osOptions,
        priceRange,
        categories,
    ] = await Promise.all([
        db.laptop.groupBy({ by: ['brand'], _count: true }),
        db.laptop.groupBy({ by: ['cpuBrand'], _count: true }),
        db.laptop.groupBy({ by: ['cpuModel'], _count: true }),
        db.laptop.groupBy({ by: ['gpuBrand'], _count: true }),
        db.laptop.groupBy({ by: ['gpuModel'], _count: true }),
        db.laptop.groupBy({ by: ['screenSize'], _count: true }),
        db.laptop.groupBy({ by: ['displayType'], _count: true }),
        db.laptop.groupBy({ by: ['ramGb'], _count: true }),
        db.laptop.groupBy({ by: ['storageGb'], _count: true }),
        db.laptop.groupBy({ by: ['os'], _count: true }),
        db.laptop.aggregate({ _min: { lowestPrice: true }, _max: { lowestPrice: true } }),
        db.laptop.groupBy({ by: ['category'], _count: true }),
    ]);

    // Helper to format
    // Helper to format
    const format = <T extends Record<string, unknown>>(items: T[], key: keyof T & string) =>
        items
            .map((i) => ({ value: i[key], count: (i as any)._count }))
            .filter((i) => i.value !== null)
            .sort((a, b) => b.count - a.count); // Sort by popularity

    // Helper for numbers (sort asc)
    const formatNum = <T extends Record<string, unknown>>(items: T[], key: keyof T & string) =>
        items
            .map((i) => i[key])
            .filter((i) => i !== null)
            .sort((a, b) => (Number(a) - Number(b)));

    // Clean up format
    const response = {
        brands: format(brands, 'brand'),
        cpuBrands: format(cpuBrands, 'cpuBrand'),
        cpuModels: format(cpuModels, 'cpuModel').slice(0, 20), // Limit high cardinality
        gpuBrands: format(gpuBrands, 'gpuBrand'),
        gpuModels: format(gpuModels, 'gpuModel').slice(0, 20),
        screenSizes: formatNum(screenSizes, 'screenSize'),
        displayTypes: format(displayTypes, 'displayType').map(x => x.value), // Contract just says string[] for displayTypes? 
        // Contract: displayTypes: ["IPS", ...] (strings). But wait, api-contract example shows string array for some, object array for others.
        // Example: "brands": [{value, count}], "screenSizes": [13, 14], "displayTypes": ["IPS"]
        // Let's stick strictly to example.
        ramOptions: formatNum(ramOptions, 'ramGb'),
        storageOptions: formatNum(storageOptions, 'storageGb'),
        osOptions: format(osOptions, 'os').map(x => x.value),
        priceRange: {
            min: priceRange._min.lowestPrice || 0,
            max: priceRange._max.lowestPrice || 5000,
        },
        categories: format(categories, 'category').map(x => x.value),
    };

    return NextResponse.json(
        { data: response },
        {
            headers: {
                'Cache-Control': 'public, s-maxage=300', // 5 minutes
            },
        }
    );
}

export const GET = withErrorHandler(handler);
