import { RetailerAdapter, Category, RawProduct, PriceData } from './types';

export class WalmartAdapter implements RetailerAdapter {
    name = 'Walmart';

    async fetchProducts(category: Category): Promise<RawProduct[]> {
        // Uses Walmart Affiliate API (IO)
        return [];
    }

    async fetchPrice(productId: string): Promise<PriceData | null> {
        return null;
    }
}
