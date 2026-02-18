import { test, expect } from '@playwright/test';

test('deals page loads and displays deals', async ({ page }) => {
    // Mock API
    await page.route('*/**/api/deals?*', async route => {
        const json = {
            data: [
                {
                    id: '1',
                    name: 'Deal Laptop 1',
                    slug: 'deal-laptop-1',
                    brand: 'DealBrand',
                    prices: [{ retailer: 'Amazon', price: 999, discountPct: 25 }],
                    dealRating: 'GREAT'
                }
            ]
        };
        await route.fulfill({ json });
    });

    await page.goto('/deals');

    await expect(page.getByRole('heading', { name: 'Top Deals Right Now' })).toBeVisible();
    await expect(page.getByText('Deal Laptop 1')).toBeVisible();
    await expect(page.getByText('SAVE 25%')).toBeVisible();
});
