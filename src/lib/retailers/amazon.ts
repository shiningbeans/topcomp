import { RetailerAdapter, Category, RawProduct, PriceData } from './types';

export class AmazonAdapter implements RetailerAdapter {
    name = 'Amazon';

    async fetchProducts(category: Category): Promise<RawProduct[]> {
        // Requires PA-API credentials.
        // Ensure process.env.AMAZON_ACCESS_KEY, etc. are set.
        // Implementation stubbed for now as we don't have keys.
        // In production, use 'amazon-paapi' package or fetch directly.
        return [];
    }

    async fetchPrice(productId: string): Promise<PriceData | null> {
        // Fetch via API or scraping fallback (cautiously)
        return null;
    }
}
