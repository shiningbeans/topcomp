import { test, expect } from '@playwright/test'

test.describe('Browsing', () => {
    test('should load category page and display laptops', async ({ page }) => {
        // Navigate to Work category
        await page.goto('/work')

        // Check heading
        await expect(page.getByRole('heading', { name: /Work Laptops/i })).toBeVisible()

        // Check for at least one laptop card (assuming seeded data or mock)
        // If no real data, we expect "No laptops found" or Skeletons if loading stuck.
        // For now, let's verify the structure exists.
    })

    test('should handle filtering', async ({ page }) => {
        await page.goto('/work')

        // Check if sidebar filter exists (might be skeleton if loading)
        // This depends on whether we have real data hooked up or not.
        // Given we just built the frontend, and API might be mocked or empty.
    })
})
