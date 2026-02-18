import { RetailerAdapter, Category, RawProduct, PriceData } from './types';

export class EbayAdapter implements RetailerAdapter {
    name = 'eBay';

    async fetchProducts(category: Category): Promise<RawProduct[]> {
        // Uses eBay Browse API
        return [];
    }

    async fetchPrice(productId: string): Promise<PriceData | null> {
        return null;
    }
}
