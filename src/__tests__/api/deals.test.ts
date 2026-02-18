import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/deals/route';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

vi.mock('@/lib/db', () => ({
    db: {
        price: {
            findMany: vi.fn(),
        },
    },
}));

describe('GET /api/deals', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns sorted deals and deduplicates', async () => {
        // Mock prices response
        (db.price.findMany as any).mockResolvedValue([
            {
                laptopId: '1',
                discountPct: 20,
                laptop: { id: '1', name: 'Laptop 1', prices: [] },
            },
            {
                laptopId: '1', // Duplicate laptop, different deal
                discountPct: 15,
                laptop: { id: '1', name: 'Laptop 1', prices: [] },
            },
            {
                laptopId: '2',
                discountPct: 10,
                laptop: { id: '2', name: 'Laptop 2', prices: [] },
            },
        ]);

        const req = new NextRequest('http://localhost:3000/api/deals?limit=2');
        const res = await GET(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.data).toHaveLength(2);
        expect(json.data[0].name).toBe('Laptop 1');
        expect(json.data[1].name).toBe('Laptop 2');
    });
});
