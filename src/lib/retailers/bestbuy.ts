import { RetailerAdapter, Category, RawProduct, PriceData } from './types';

export class BestBuyAdapter implements RetailerAdapter {
    name = 'Best Buy';

    async fetchProducts(category: Category): Promise<RawProduct[]> {
        // Uses Best Buy API (developer.bestbuy.com)
        // Key: process.env.BESTBUY_API_KEY
        return [];
    }

    async fetchPrice(productId: string): Promise<PriceData | null> {
        return null;
    }
}
