import { PrismaClient, Category, DealRating } from '../src/generated/prisma/client';

const prisma = new PrismaClient({} as any);

const RETAILERS = ['Amazon', 'Best Buy', 'Newegg', 'B&H Photo', 'Walmart', 'Micro Center'];

async function main() {
    console.log('Seeding database...');

    // Clear existing data
    await prisma.priceHistory.deleteMany();
    await prisma.price.deleteMany();
    await prisma.searchSuggestion.deleteMany();
    await prisma.laptop.deleteMany();

    console.log('Cleared existing data.');

    const laptops = [
        // APPLE
        {
            name: 'MacBook Air 13" M2',
            slug: 'macbook-air-13-m2',
            brand: 'Apple',
            model: 'MLXW3LL/A',
            category: Category.APPLE,
            imageUrl: 'https://placehold.co/600x400?text=MacBook+Air+M2',
            cpu: 'Apple M2 8-core', cpuBrand: 'Apple', cpuModel: 'M2',
            gpu: 'Apple M2 8-core', gpuBrand: 'Apple', gpuModel: 'M2',
            ramGb: 8, ramType: 'LPDDR5',
            storageGb: 256, storageType: 'SSD', storageInterface: 'NVMe',
            screenSize: 13.6, screenRes: '2560x1664', displayType: 'IPS', refreshRate: 60, touchscreen: false,
            weightLbs: 2.7, batteryHours: 18, os: 'macOS',
            releaseDate: new Date('2022-07-15'),
            reviewScore: 92, reviewCount: 1500, reviewSummary: 'Excellent battery life and performance in a thin chassis.',
            prices: [999, 899, 949] // Base prices to vary
        },
        {
            name: 'MacBook Air 15" M2',
            slug: 'macbook-air-15-m2',
            brand: 'Apple',
            model: 'MQKQ3LL/A',
            category: Category.APPLE,
            imageUrl: 'https://placehold.co/600x400?text=MacBook+Air+15',
            cpu: 'Apple M2 8-core', cpuBrand: 'Apple', cpuModel: 'M2',
            gpu: 'Apple M2 10-core', gpuBrand: 'Apple', gpuModel: 'M2',
            ramGb: 16, ramType: 'LPDDR5',
            storageGb: 512, storageType: 'SSD', storageInterface: 'NVMe',
            screenSize: 15.3, screenRes: '2880x1864', displayType: 'IPS', refreshRate: 60, touchscreen: false,
            weightLbs: 3.3, batteryHours: 18, os: 'macOS',
            releaseDate: new Date('2023-06-13'),
            reviewScore: 90, reviewCount: 800, reviewSummary: 'Big screen Air is what everyone wanted.',
            prices: [1499, 1399, 1449]
        },
        {
            name: 'MacBook Pro 14" M3 Pro',
            slug: 'macbook-pro-14-m3-pro',
            brand: 'Apple',
            model: 'MRX33LL/A',
            category: Category.APPLE,
            imageUrl: 'https://placehold.co/600x400?text=MacBook+Pro+14',
            cpu: 'Apple M3 Pro 11-core', cpuBrand: 'Apple', cpuModel: 'M3 Pro',
            gpu: 'Apple M3 Pro 14-core', gpuBrand: 'Apple', gpuModel: 'M3 Pro',
            ramGb: 18, ramType: 'LPDDR5',
            storageGb: 512, storageType: 'SSD', storageInterface: 'NVMe',
            screenSize: 14.2, screenRes: '3024x1964', displayType: 'Mini-LED', refreshRate: 120, touchscreen: false,
            weightLbs: 3.5, batteryHours: 18, os: 'macOS',
            releaseDate: new Date('2023-11-07'),
            reviewScore: 94, reviewCount: 500, reviewSummary: 'The best all-around laptop for creatives.',
            prices: [1999, 1849, 1949]
        },
        // WORK
        {
            name: 'Dell XPS 13',
            slug: 'dell-xps-13-9315',
            brand: 'Dell',
            model: 'XPS9315',
            category: Category.WORK,
            imageUrl: 'https://placehold.co/600x400?text=Dell+XPS+13',
            cpu: 'Intel Core i7-1250U', cpuBrand: 'Intel', cpuModel: 'Core i7',
            gpu: 'Intel Iris Xe', gpuBrand: 'Intel', gpuModel: 'Iris Xe',
            ramGb: 16, ramType: 'LPDDR5',
            storageGb: 512, storageType: 'SSD', storageInterface: 'NVMe',
            screenSize: 13.4, screenRes: '1920x1200', displayType: 'IPS', refreshRate: 60, touchscreen: false,
            weightLbs: 2.59, batteryHours: 12, os: 'Windows',
            releaseDate: new Date('2022-06-01'),
            reviewScore: 85, reviewCount: 300, reviewSummary: 'Compact and premium but lacks ports.',
            prices: [999, 849, 899]
        },
        {
            name: 'Lenovo ThinkPad X1 Carbon Gen 11',
            slug: 'lenovo-thinkpad-x1-carbon-gen-11',
            brand: 'Lenovo',
            model: '21HM000HUS',
            category: Category.WORK,
            imageUrl: 'https://placehold.co/600x400?text=ThinkPad+X1',
            cpu: 'Intel Core i7-1355U', cpuBrand: 'Intel', cpuModel: 'Core i7',
            gpu: 'Intel Iris Xe', gpuBrand: 'Intel', gpuModel: 'Iris Xe',
            ramGb: 16, ramType: 'LPDDR5',
            storageGb: 512, storageType: 'SSD', storageInterface: 'NVMe',
            screenSize: 14.0, screenRes: '1920x1200', displayType: 'IPS', refreshRate: 60, touchscreen: false,
            weightLbs: 2.48, batteryHours: 14, os: 'Windows',
            releaseDate: new Date('2023-04-01'),
            reviewScore: 89, reviewCount: 450, reviewSummary: 'The gold standard for business laptops.',
            prices: [1400, 1199, 1350]
        },
        // GAMING
        {
            name: 'Razer Blade 14',
            slug: 'razer-blade-14-2023',
            brand: 'Razer',
            model: 'RZ09-0482',
            category: Category.GAMING,
            imageUrl: 'https://placehold.co/600x400?text=Razer+Blade+14',
            cpu: 'AMD Ryzen 9 7940HS', cpuBrand: 'AMD', cpuModel: 'Ryzen 9',
            gpu: 'NVIDIA GeForce RTX 4070', gpuBrand: 'NVIDIA', gpuModel: 'RTX 4070',
            ramGb: 16, ramType: 'DDR5',
            storageGb: 1024, storageType: 'SSD', storageInterface: 'NVMe',
            screenSize: 14.0, screenRes: '2560x1600', displayType: 'IPS', refreshRate: 240, touchscreen: false,
            weightLbs: 4.06, batteryHours: 8, os: 'Windows',
            releaseDate: new Date('2023-06-20'),
            reviewScore: 88, reviewCount: 200, reviewSummary: 'Powerful and portable gaming machine.',
            prices: [2699, 2399, 2499]
        },
        {
            name: 'ASUS ROG Zephyrus G14',
            slug: 'asus-rog-zephyrus-g14-2023',
            brand: 'ASUS',
            model: 'GA402XV',
            category: Category.GAMING,
            imageUrl: 'https://placehold.co/600x400?text=ASUS+ROG+G14',
            cpu: 'AMD Ryzen 9 7940HS', cpuBrand: 'AMD', cpuModel: 'Ryzen 9',
            gpu: 'NVIDIA GeForce RTX 4060', gpuBrand: 'NVIDIA', gpuModel: 'RTX 4060',
            ramGb: 16, ramType: 'DDR5',
            storageGb: 512, storageType: 'SSD', storageInterface: 'NVMe',
            screenSize: 14.0, screenRes: '2560x1600', displayType: 'IPS', refreshRate: 165, touchscreen: false,
            weightLbs: 3.64, batteryHours: 10, os: 'Windows',
            releaseDate: new Date('2023-03-15'),
            reviewScore: 91, reviewCount: 600, reviewSummary: 'Best compact gaming laptop for most people.',
            prices: [1599, 1299, 1399]
        },
    ];

    for (const raw of laptops) {
        const { prices: basePrices, ...laptopData } = raw;

        // Create Laptop
        const laptop = await prisma.laptop.create({
            data: laptopData,
        });

        // Create Prices
        const priceObjects = [];
        const usedRetailers = new Set<string>();

        for (const basePrice of basePrices) {
            // Pick a random retailer
            let retailer = RETAILERS[Math.floor(Math.random() * RETAILERS.length)];
            while (usedRetailers.has(retailer)) {
                retailer = RETAILERS[Math.floor(Math.random() * RETAILERS.length)];
            }
            usedRetailers.add(retailer);

            // Vary price slightly
            const variation = (Math.random() * 0.1) - 0.05; // +/- 5%
            const priceVal = Math.round(basePrice * (1 + variation));

            // Determine if discounted
            const isDiscounted = priceVal < basePrice * 0.9;
            const originalPrice = isDiscounted ? Math.round(priceVal * 1.2) : undefined;
            const discountPct = originalPrice ? Math.round(((originalPrice - priceVal) / originalPrice) * 100) : null;

            const p = await prisma.price.create({
                data: {
                    laptopId: laptop.id,
                    retailer,
                    retailerUrl: `https://${retailer.toLowerCase().replace(' ', '')}.com/product/${laptop.slug}`,
                    price: priceVal,
                    originalPrice,
                    discountPct,
                    inStock: true,
                    lastChecked: new Date(),
                }
            });
            priceObjects.push(p);

            // Add History
            await prisma.priceHistory.create({
                data: {
                    laptopSlug: laptop.slug,
                    retailer: retailer,
                    price: priceVal,
                    recordedAt: new Date(),
                }
            });
        }

        // Compute Denormalized Fields
        const sorted = priceObjects.sort((a, b) => a.price - b.price);
        const lowest = sorted[0];

        // Compute deal rating
        // Simple logic for seed
        const median = sorted[Math.floor(sorted.length / 2)].price;
        const diff = (median - lowest.price) / median;
        let rating: DealRating = 'FAIR';
        if (diff >= 0.15) rating = 'GREAT';
        else if (lowest.price > median * 1.15) rating = 'ABOVE_AVERAGE';

        await prisma.laptop.update({
            where: { id: laptop.id },
            data: {
                lowestPrice: lowest.price,
                lowestRetailer: lowest.retailer,
                dealRating: rating,
            }
        });

        // Add Search Suggestion
        await prisma.searchSuggestion.create({
            data: {
                text: laptop.name,
                type: 'laptop',
                slug: laptop.slug,
                priority: 50,
            }
        });
    }

    // Add Brand/Spec Suggestions
    const brands = Array.from(new Set(laptops.map(l => l.brand)));
    for (const b of brands) {
        await prisma.searchSuggestion.create({
            data: {
                text: b,
                type: 'brand',
                url: `/laptops?brand=${b}`,
                priority: 100,
            }
        });
    }

    console.log(`Seeded ${laptops.length} laptops.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
