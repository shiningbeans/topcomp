import { test, expect } from '@playwright/test'

test('homepage loads and has correct title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/.+/)
})

test('404 page renders for unknown routes', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist')
  expect(response?.status()).toBe(404)
})
