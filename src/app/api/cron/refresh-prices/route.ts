import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withErrorHandler, ApiError } from '@/lib/api-error';
import { retailers } from '@/lib/retailers';
import { normalizeSpecs } from '@/lib/spec-normalizer';
import { Prisma, Category as PrismaCategory } from '@/generated/prisma/client';
import { Category as RetailerCategory } from '@/lib/retailers/types';

// Protected by CRON_SECRET
async function handler(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        throw ApiError.unauthorized('Invalid CRON_SECRET');
    }

    const results: Record<string, { updated: number; errors: number }> = {};

    // Iterate all retailers
    // In production, might want to use a queue or split this up if it takes too long.
    // Vercel function timeout is usually 10s-60s. 
    // 16 retailers * 2 seconds delay = 32s. Might timeout.
    // However, we can run them in parallel.

    const promises = retailers.map(async (retailer) => {
        const result = { updated: 0, errors: 0 };
        try {
            // Fetch all categories? Or just iterate all Categories enum?
            // For simplicity, let's say we fetch 'WORK' and 'GAMING' and 'APPLE'.
            const categories: PrismaCategory[] = [PrismaCategory.WORK, PrismaCategory.GAMING, PrismaCategory.APPLE];

            for (const cat of categories) {
                try {
                    const products = await retailer.fetchProducts(cat as unknown as RetailerCategory);

                    for (const raw of products) {
                        // Logic to Upsert Laptop
                        // 1. Normalize specs (maybe cache this to avoid expensive Gemini calls if already exists?)
                        // Actually, only normalize if we are creating a NEW laptop or if specs are missing.
                        // Rely on Slug to identify unique laptops? 
                        // "slug" is unique in DB.
                        // How do we generate slug from raw product? 
                        // "brand-model".

                        // Simple slugify
                        const baseSlug = `${raw.brand}-${raw.name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

                        // Check if exists
                        let laptop = await db.laptop.findFirst({
                            where: {
                                OR: [
                                    { slug: baseSlug },
                                    // Maybe match by brand + model approximately?
                                    // For now, simple slug match.
                                ]
                            }
                        });

                        if (!laptop) {
                            // New Laptop - Normalize Specs
                            // Limit API calls or it will be slow/expensive.
                            // Depending on rate limits.
                            const specs = await normalizeSpecs(JSON.stringify(raw.specs));
                            if (!specs) continue; // Skip if can't normalize

                            try {
                                laptop = await db.laptop.create({
                                    data: {
                                        slug: baseSlug, // might fail if duplicate, need retry with suffix
                                        name: raw.name,
                                        brand: raw.brand,
                                        model: raw.model,
                                        category: cat,
                                        imageUrl: raw.imageUrl,
                                        // Specs
                                        cpu: `${specs.cpuBrand} ${specs.cpuModel}`,
                                        cpuBrand: specs.cpuBrand || 'Unknown',
                                        cpuModel: specs.cpuModel,
                                        gpu: specs.gpuModel ? `${specs.gpuBrand} ${specs.gpuModel}` : null,
                                        gpuBrand: specs.gpuBrand,
                                        gpuModel: specs.gpuModel,
                                        ramGb: specs.ramGb || 8,
                                        ramType: specs.ramType,
                                        storageGb: specs.storageGb || 256,
                                        storageType: specs.storageType || 'SSD',
                                        storageInterface: specs.storageInterface,
                                        screenSize: specs.screenSize || 14,
                                        screenRes: specs.screenRes || '1920x1080',
                                        displayType: specs.displayType,
                                        refreshRate: specs.refreshRate,
                                        touchscreen: specs.touchscreen || false,
                                        // weight, battery, os...
                                        os: specs.os,
                                    }
                                });
                            } catch (e) {
                                // Handle slug collision?
                                result.errors++;
                                continue;
                            }
                        }

                        // Upsert Price
                        if (laptop) {
                            await db.price.upsert({
                                where: {
                                    laptopId_retailer: {
                                        laptopId: laptop.id,
                                        retailer: retailer.name,
                                    }
                                },
                                update: {
                                    price: raw.price,
                                    inStock: raw.inStock,
                                    lastChecked: new Date(),
                                    retailerUrl: raw.url,
                                },
                                create: {
                                    laptopId: laptop.id,
                                    retailer: retailer.name,
                                    retailerUrl: raw.url,
                                    price: raw.price,
                                    originalPrice: raw.originalPrice,
                                    inStock: raw.inStock,
                                }
                            });

                            // Record History
                            await db.priceHistory.create({
                                data: {
                                    laptopSlug: laptop.slug,
                                    retailer: retailer.name,
                                    price: raw.price,
                                }
                            });

                            result.updated++;
                        }
                    }
                } catch (e) {
                    if (process.env.NODE_ENV === 'development') {
                        console.error(`Error fetching ${retailer.name} category ${cat}:`, e);
                    }
                    result.errors++;
                }
            }
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(`Error processing ${retailer.name}:`, e);
            }
            result.errors++;
        }

        return { [retailer.name]: result };
    });

    const processed = await Promise.all(promises);
    processed.forEach(p => Object.assign(results, p));

    return NextResponse.json({ status: 'ok', retailers: results });
}

export const POST = withErrorHandler(handler);
