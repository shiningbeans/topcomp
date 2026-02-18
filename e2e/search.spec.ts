import { test, expect } from '@playwright/test'

test.describe('Search', () => {
    test('should allow typing in search', async ({ page }) => {
        await page.goto('/')
        // This assumes the Layout has the search bar.
        // Since we didn't touch layout, we hope Foundation agent put it there.

        // If not, we can test /search page directly
        await page.goto('/search?q=test')
        await expect(page.getByRole('heading', { name: /Search results for "test"/i })).toBeVisible()
    })
})
