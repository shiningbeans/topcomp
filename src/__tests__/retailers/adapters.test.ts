import { describe, it, expect } from 'vitest';
import { retailers } from '@/lib/retailers';

describe('Retailer Adapters', () => {
    it('all adapters implement fetchProducts', () => {
        retailers.forEach((retailer) => {
            expect(retailer).toHaveProperty('name');
            expect(retailer).toHaveProperty('fetchProducts');
            expect(retailer).toHaveProperty('fetchPrice');
            expect(typeof retailer.fetchProducts).toBe('function');
            expect(typeof retailer.fetchPrice).toBe('function');
        });
    });

    it('all adapters have unique names', () => {
        const names = retailers.map((r) => r.name);
        const uniqueNames = new Set(names);
        expect(uniqueNames.size).toBe(names.length);
    });
});
