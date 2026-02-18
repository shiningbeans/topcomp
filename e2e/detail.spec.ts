import { test, expect } from '@playwright/test';

// Mock data or rely on seeded data?
// For now, these tests assume some data exists or we mock the API response.
// Since we don't have a backend running in this environment, tests against localhost:3000 will fail if not running.
// However, I must write the tests.

test('detail page loads correctly', async ({ page }) => {
    // Navigate to a likely existing slug (or one we mock)
    // For robustness, let's navigate to a known route or mock the API

    // Mock API response
    await page.route('*/**/api/laptops/test-laptop', async route => {
        const json = {
            data: {
                id: '1',
                name: 'Test Laptop',
                slug: 'test-laptop',
                brand: 'TestBrand',
                model: 'Model X',
                category: 'WORK',
                cpu: 'Intel Core i9',
                cpuBrand: 'Intel',
                cpuModel: 'Core i9-13900H',
                gpu: 'NVIDIA RTX 4090',
                gpuBrand: 'NVIDIA',
                ramGb: 32,
                storageGb: 1024,
                storageType: 'SSD',
                screenSize: 16,
                screenRes: '3840x2400',
                displayType: 'OLED',
                refreshRate: 120,
                weightLbs: 4.5,
                os: 'Windows 11',
                lowestPrice: 1999.99,
                lowestRetailer: 'Amazon',
                prices: [
                    { retailer: 'Amazon', price: 1999.99, inStock: true, retailerUrl: '#', lastChecked: new Date().toISOString() }
                ],
                dealRating: 'GREAT'
            }
        };
        await route.fulfill({ json });
    });

    await page.goto('/laptop/test-laptop');

    // Verify Hero
    await expect(page.getByRole('heading', { name: 'Test Laptop' })).toBeVisible();
    await expect(page.getByText('TestBrand')).toBeVisible();
    await expect(page.getByText('Great Price')).toBeVisible();

    // Verify Specs
    await expect(page.getByText('Intel Core i9')).toBeVisible();
    await expect(page.getByText('NVIDIA RTX 4090')).toBeVisible();

    // Verify Prices
    await expect(page.getByText('$1,999.99')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Buy Now' })).toBeVisible();
});
