import { RetailerAdapter, Category, RawProduct, PriceData } from './types';
// import * as cheerio from 'cheerio'; // Will be available after install

export class NeweggAdapter implements RetailerAdapter {
    name = 'Newegg';
    async fetchProducts(category: Category): Promise<RawProduct[]> {
        // Implementation for Newegg scraping
        return [];
    }
    async fetchPrice(id: string): Promise<PriceData | null> { return null; }
}

export class BHPhotoAdapter implements RetailerAdapter {
    name = 'B&H Photo';
    async fetchProducts(category: Category): Promise<RawProduct[]> {
        // Implementation for B&H
        return [];
    }
    async fetchPrice(id: string): Promise<PriceData | null> { return null; }
}

export class MicroCenterAdapter implements RetailerAdapter {
    name = 'Micro Center';
    async fetchProducts(category: Category): Promise<RawProduct[]> {
        // Implementation for Micro Center
        return [];
    }
    async fetchPrice(id: string): Promise<PriceData | null> { return null; }
}

export class AdoramaAdapter implements RetailerAdapter {
    name = 'Adorama';
    async fetchProducts(category: Category): Promise<RawProduct[]> {
        // Implementation for Adorama
        return [];
    }
    async fetchPrice(id: string): Promise<PriceData | null> { return null; }
}
