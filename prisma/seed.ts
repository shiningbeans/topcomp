import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient({} as any);

async function main() {
    console.log('Database seed script — no demo data.');
    console.log('TopComp uses real retailer data only.');
    console.log('Run the scraper/indexer to populate the database.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
