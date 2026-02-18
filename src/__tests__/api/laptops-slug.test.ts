import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/laptops/[slug]/route';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

vi.mock('@/lib/db', () => ({
    db: {
        laptop: {
            findUnique: vi.fn(),
        },
    },
}));

describe('GET /api/laptops/[slug]', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('returns laptop details when found', async () => {
        (db.laptop.findUnique as any).mockResolvedValue({
            id: '1',
            slug: 'test-laptop',
            name: 'Test Laptop',
            prices: [],
        });

        const req = new NextRequest('http://localhost:3000/api/laptops/test-laptop');
        // Mock params context
        // Next.js route handlers receive params as 2nd arg
        const res = await GET(req, { params: { slug: 'test-laptop' } });
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.data.slug).toBe('test-laptop');
    });

    it('returns 404 when not found', async () => {
        (db.laptop.findUnique as any).mockResolvedValue(null);

        const req = new NextRequest('http://localhost:3000/api/laptops/unknown');
        const res = await GET(req, { params: { slug: 'unknown' } });
        const json = await res.json();

        expect(res.status).toBe(404);
        expect(json.error.code).toBe('NOT_FOUND');
    });
});
