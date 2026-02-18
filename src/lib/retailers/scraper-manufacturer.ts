import { RetailerAdapter, Category, RawProduct, PriceData } from './types';

export class LenovoAdapter implements RetailerAdapter {
    name = 'Lenovo';
    async fetchProducts(category: Category): Promise<RawProduct[]> { return []; }
    async fetchPrice(id: string): Promise<PriceData | null> { return null; }
}

export class DellAdapter implements RetailerAdapter {
    name = 'Dell';
    async fetchProducts(category: Category): Promise<RawProduct[]> { return []; }
    async fetchPrice(id: string): Promise<PriceData | null> { return null; }
}

export class HPAdapter implements RetailerAdapter {
    name = 'HP';
    async fetchProducts(category: Category): Promise<RawProduct[]> { return []; }
    async fetchPrice(id: string): Promise<PriceData | null> { return null; }
}

export class AppleAdapter implements RetailerAdapter {
    name = 'Apple';
    async fetchProducts(category: Category): Promise<RawProduct[]> { return []; }
    async fetchPrice(id: string): Promise<PriceData | null> { return null; }
}
