import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://topcomp.dev'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const laptops = await db.laptop.findMany({
        select: { slug: true, updatedAt: true },
    })

    const laptopEntries: MetadataRoute.Sitemap = laptops.map((laptop) => ({
        url: `${BASE_URL}/laptop/${laptop.slug}`,
        lastModified: laptop.updatedAt,
        changeFrequency: 'daily',
        priority: 0.8,
    }))

    const staticPages: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${BASE_URL}/deals`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/budget-picks`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
        { url: `${BASE_URL}/best-rated`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
        { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
        { url: `${BASE_URL}/work`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/gaming`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/apple`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    ]

    return [...staticPages, ...laptopEntries]
}
