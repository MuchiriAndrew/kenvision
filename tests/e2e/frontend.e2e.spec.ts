import { test, expect } from '@playwright/test'

test.describe('Website launch', () => {
  test('shows the public website with an enquiry CTA', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/Professional Training & Technical Solutions/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Technology, expertise and training')
    await expect(page.getByRole('link', { name: 'Talk to our team' })).toHaveAttribute('href', '/contact')
  })

  test('opens a prefiltered training area', async ({ page }) => {
    await page.goto('http://localhost:3000/training?category=Security%20Systems')
    await expect(page.getByRole('combobox', { name: 'Training area' })).toHaveValue('Security Systems')
    await expect(page.getByText(/Showing \d+ of \d+ programmes/)).toBeVisible()
  })

  test('hides learner routes until the addon is enabled', async ({ request }) => {
    test.skip(process.env.ENABLE_LMS === 'true', 'LMS addon enabled for this run')
    for (const path of ['/login', '/register', '/dashboard', '/learn/cctv-operator-control-room']) {
      const response = await request.get(`http://localhost:3000${path}`)
      expect(response.status()).toBe(404)
    }
  })
})
