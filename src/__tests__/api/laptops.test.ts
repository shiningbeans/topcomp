import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/laptops/route';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

// Mock the DB
vi.mock('@/lib/db', () => ({
    db: {
        laptop: {
            count: vi.fn(),
            findMany: vi.fn(),
        },
    },
}));

describe('GET /api/laptops', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns valid paginated response', async () => {
        // Mock Data
        (db.laptop.count as any).mockResolvedValue(1);
        (db.laptop.findMany as any).mockResolvedValue([
            {
                id: '1',
                name: 'Test Laptop',
                prices: [{ price: 1000, retailer: 'Amazon' }],
            },
        ]);

        const req = new NextRequest('http://localhost:3000/api/laptops?limit=10&page=1');
        const res = await GET(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.data).toHaveLength(1);
        expect(json.pagination).toEqual({
            page: 1, // number
            limit: 10,
            total: 1,
            totalPages: 1,
        });
    });

    it('filters by category', async () => {
        (db.laptop.count as any).mockResolvedValue(0);
        (db.laptop.findMany as any).mockResolvedValue([]);

        const req = new NextRequest('http://localhost:3000/api/laptops?category=GAMING');
        await GET(req);

        expect(db.laptop.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    category: 'GAMING',
                }),
            })
        );
    });

    it('returns 422 for invalid query params', async () => {
        const req = new NextRequest('http://localhost:3000/api/laptops?limit=invalid');
        const res = await GET(req);
        const json = await res.json();

        expect(res.status).toBe(422);
        expect(json.error.code).toBe('VALIDATION_ERROR');
    });
});
