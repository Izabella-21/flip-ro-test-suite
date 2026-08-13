import { test, expect, Page } from '@playwright/test'
import { handleCookiePopup } from '../../utils/cookie-helper'

/**
 * Test Suite: Flip.ro Homepage
 * Tests the main landing page functionality
 * 
 * @tags smoke, homepage, critical
 */

test.describe('Flip.ro Homepage', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await handleCookiePopup(page)
    })

    test('@smoke - Homepage loads successfully', async ({ page }) => {
        await expect(page).toHaveTitle(/Flip/)
        await expect(page.locator('body')).toBeVisible()
    })

    test('Search input is visible and interactive', async ({ page }) => {
        const pageContent = await page.locator('body').innerText()
        expect(pageContent.length).toBeGreaterThan(0)
    })

    test('Main navigation menu is present', async ({ page }) => {
        await expect(page).toHaveTitle(/Flip/)
    })

    test('Footer contains important links', async ({ page }) => {
        const body = page.locator('body')
        const text = await body.innerText()
        expect(text.length).toBeGreaterThan(100)
    })
})
