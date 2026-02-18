import { RetailerAdapter, Category, RawProduct, PriceData } from './types';

export class CostcoAdapter implements RetailerAdapter {
    name = 'Costco';
    async fetchProducts(category: Category): Promise<RawProduct[]> { return []; }
    async fetchPrice(id: string): Promise<PriceData | null> { return null; }
}

export class SamsClubAdapter implements RetailerAdapter {
    name = "Sam's Club";
    async fetchProducts(category: Category): Promise<RawProduct[]> { return []; }
    async fetchPrice(id: string): Promise<PriceData | null> { return null; }
}

export class TargetAdapter implements RetailerAdapter {
    name = 'Target';
    async fetchProducts(category: Category): Promise<RawProduct[]> { return []; }
    async fetchPrice(id: string): Promise<PriceData | null> { return null; }
}

export class OfficeDepotAdapter implements RetailerAdapter {
    name = 'Office Depot';
    async fetchProducts(category: Category): Promise<RawProduct[]> { return []; }
    async fetchPrice(id: string): Promise<PriceData | null> { return null; }
}
