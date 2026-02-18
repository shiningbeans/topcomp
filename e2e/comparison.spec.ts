import { test, expect } from '@playwright/test';

test('comparison flow works', async ({ page }) => {
    // Mock listing API for selection
    await page.route('*/**/api/deals?*', async route => {
        const json = {
            data: [
                {
                    id: '1',
                    name: 'Laptop A',
                    slug: 'laptop-a',
                    prices: [{ price: 1000 }],
                }
            ]
        };
        await route.fulfill({ json });
    });

    // Mock detail API for comparison page
    await page.route('*/**/api/laptops/laptop-a', async route => {
        const json = {
            data: {
                id: '1',
                name: 'Laptop A',
                slug: 'laptop-a',
                prices: [{ price: 1000 }],
                lowestPrice: 1000,
                cpuModel: 'CPU A'
            }
        };
        await route.fulfill({ json });
    });

    // 1. Go to deals page (where we have checkboxes via DealCard)
    await page.goto('/deals');

    // 2. Click compare checkbox
    // Note: Checkbox might be hidden on small screens or require specific selector
    const checkbox = page.locator('div').filter({ hasText: /^Compare$/ }).getByRole('checkbox');
    // Or handle implementation detail of CompareCheckbox label
    await page.getByLabel('Compare').first().check();

    // 3. Verify Tray appears
    await expect(page.getByText('Compare (1 of 3)')).toBeVisible();

    // 4. Go to comparison page directly (since Compare Now needs 2 items)
    await page.goto('/compare?compare=laptop-a');

    // 5. Verify comparison table
    await expect(page.getByRole('heading', { name: 'Compare Laptops' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Laptop A' })).toBeVisible();
    await expect(page.getByText('CPU A')).toBeVisible();
});
