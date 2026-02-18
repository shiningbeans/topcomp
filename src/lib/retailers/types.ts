export enum Category {
    WORK = 'WORK',
    GAMING = 'GAMING',
    APPLE = 'APPLE',
}

export interface RawProduct {
    name: string;
    brand: string;
    model: string;
    specs: Record<string, string>; // Raw spec strings, will be normalized by Gemini
    price: number;
    originalPrice?: number;
    url: string;
    imageUrl?: string;
    inStock: boolean;
    currency?: string; // Default 'USD'
}

export interface PriceData {
    price: number;
    originalPrice?: number;
    inStock: boolean;
    currency?: string;
}

export interface RetailerAdapter {
    name: string; // "amazon", "bestbuy", etc.

    /**
     * Fetches a list of products for a given category.
     * Scrapers will navigate to the category page and parse results.
     * API adapters will call the search endpoint.
     */
    fetchProducts(category: Category): Promise<RawProduct[]>;

    /**
     * Fetches the current price for a specific product URL.
     * Used for updating prices of existing items.
     * For API adapters, productId might be the SKU/ASIN. 
     * For scrapers, it's usually the URL.
     */
    fetchPrice(productId: string): Promise<PriceData | null>;
}
