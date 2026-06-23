import { test, expect, Page } from '@playwright/test'

/**
 * Test Suite: Flip.ro Homepage
 * Tests the main landing page functionality
 * 
 * @tags smoke, homepage, critical
 */
async function handleCookiePopup(page: Page) {
    try {
        const acceptButton = page.locator('#CybotCookiebotDialogBodyButtonAccept')

        // Check if the button is visible (give it 3 seconds to appear)
        if (await acceptButton.isVisible({ timeout: 3000 })) {
            await acceptButton.click()
            console.log('Cookie popup accepted (ID selector worked)')
            // Wait a moment for the popup to disappear
            await page.waitForTimeout(500)
        }
    } catch (error) {
        // No popup found
        console.log('No cookie popup found')
    }
}

test.describe('Flip.ro Homepage', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to homepage before each test
        await page.goto('/')
        await handleCookiePopup(page)
    })

    test('@smoke - Homepage loads successfully', async ({ page }) => {
        // 1. Page title 
        await expect(page).toHaveTitle(/Flip/)
        // 2. Logo is visible
        await expect(page.getByRole('link', { name: '' }).filter({ has: page.locator('img') }).first()).toBeVisible()
        // 3. Search input is visible
        await expect(page.getByRole('textbox', { name: 'Cauta device-ul mult dorit' })).toBeVisible()
        // 4. Navigation checks (Device-dependent)
        const viewportSize = page.viewportSize()
        const width = viewportSize?.width || 1280
        if (width >= 1024) {
            // DESKTOP: Check visible navigation links directly
            await expect(page.getByRole('link', { name: 'Telefoane' })).toBeVisible()
            await expect(page.getByRole('link', { name: 'Laptopuri' })).toBeVisible()
        } else {
            // MOBILE: Open the menu and check the links inside
            // 1. Find and click the hamburger menu button
            const menuButton = page.locator('.nav-icon').first()
            await expect(menuButton).toBeVisible()
            await menuButton.click()
            // 2. Wait a moment for the menu animation to complete
            await page.waitForTimeout(300) // Small delay for smooth UI
            // 3. Now check the navigation links INSIDE the opened menu
            // The links are now visible in the mobile menu
            await expect(page.getByRole('link', { name: 'Telefoane', exact: true })).toBeVisible()
            await expect(page.getByRole('link', { name: 'Laptopuri', exact: true })).toBeVisible()
        }
        // 5. Footer exists
        await expect(page.locator('footer, [role="contentinfo"]')).toBeVisible()
    })

    test('Search input is visible and interactive', async ({ page }) => {
        // Use getByRole with the exact name for a unique match
        const searchInput = page.getByRole('textbox', { name: 'Cauta device-ul mult dorit' })
        await expect(searchInput).toBeVisible()
        await expect(searchInput).toBeEnabled()

        // Type something to verify it works
        await searchInput.fill('iPhone')
        await expect(searchInput).toHaveValue('iPhone')
    })

    test('Main navigation menu is present', async ({ page }) => {
        const viewportSize = page.viewportSize()
        const width = viewportSize?.width || 1280

        if (width >= 1024) {
            // DESKTOP: Use data-cy attributes
            const navLinks = page.locator('[data-cy^="navbar-"]')
            const linkCount = await navLinks.count()
            expect(linkCount).toBeGreaterThan(3)

            const categories = ['Telefoane', 'Laptopuri', 'Tablete']
            for (const category of categories) {
                const categoryLink = page.getByRole('link', { name: category })
                await expect(categoryLink.first()).toBeVisible()
            }
        } else {
            // MOBILE: Open the menu and use mobile selectors
            const menuButton = page.locator('.nav-icon').first()
            await expect(menuButton).toBeVisible()
            await menuButton.click()
            await page.waitForTimeout(300)

            // Use mobile menu selectors
            const mobileNavLinks = page.locator('[data-cy^="menu-b-menu."]')
            const linkCount = await mobileNavLinks.count()
            expect(linkCount).toBeGreaterThan(3)

            // Check specific categories in the mobile menu
            const categories = ['Telefoane', 'Laptopuri', 'Tablete']
            for (const category of categories) {
                const categoryLink = page.getByRole('link', { name: category, exact: true })
                await expect(categoryLink.first()).toBeVisible()
            }
        }
    })

    test('Footer contains important links', async ({ page }) => {
        // Scroll to footer
        await page.locator('footer').scrollIntoViewIfNeeded()
        // Check for footer presence
        await expect(page.locator('footer')).toBeVisible()
        // Verify footer has links
        const footerLinks = page.locator('footer a')
        const footerLinkCount = await footerLinks.count()
        expect(footerLinkCount).toBeGreaterThan(5)
    })
})
